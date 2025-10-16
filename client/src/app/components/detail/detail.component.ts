import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Event, EventService, Registration } from '../../services/event.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  event: Event | null = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService
  ) { }

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.loadEventDetails(+eventId);
    } else {
      this.error = 'No event ID provided';
      this.loading = false;
    }
  }

  loadEventDetails(eventId: number): void {
    this.eventService.getEventDetail(eventId).subscribe({
      next: (event) => {
        this.event = event;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error getting event data:', error);
        this.error = 'Unable to load event data. Please try again later.';
        this.loading = false;
      }
    });
  }

  getCompletionRate(): number {
    if (this.event?.current_price && this.event?.target_price) {
      return (this.event.current_price / this.event.target_price) * 100;
    }
    return 0;
  }

  getStatusClass(): string {
    return this.event?.event_status === 1 ? 'status-ongoing' : 'status-ended';
  }

  getStatusText(): string {
    return this.event?.event_status === 1 ? 'Ongoing' : 'Past';
  }

  isEventActive(): boolean {
    return this.event?.event_status === 1;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  }

  getTotalTickets(): number {
    if (!this.event?.registrations) return 0;
    return this.event.registrations.reduce((total, reg) => total + reg.ticket_count, 0);
  }

  getTotalRegistrations(): number {
    return this.event?.registrations?.length || 0;
  }
}