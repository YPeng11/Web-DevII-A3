import { Component, OnInit } from '@angular/core';
import { Event, EventService } from '../../services/event.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  events: Event[] = [];
  loading = true;
  error = '';

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    this.fetchEvents();
  }

  fetchEvents(): void {
    this.eventService.getEvents().subscribe({
      next: (events) => {
        this.events = this.processEvents(events);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error getting event data:', error);
        this.error = 'Unable to load activity data. Please try again later.';
        this.loading = false;
      }
    });
  }

  private processEvents(events: Event[]): Event[] {
    // Filter ban_status=1
    const validEvents = events.filter(event => event.ban_status === 1);
    
    // Sort by date
    return validEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  getEventStatus(event: Event): { class: string, text: string } {
    if (event.event_status === 0) {
      return { class: 'status-past', text: 'Past' };
    } else if (event.event_status === 1) {
      return { class: 'status-ongoing', text: 'Ongoing' };
    }
    return { class: '', text: '' };
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  }
}