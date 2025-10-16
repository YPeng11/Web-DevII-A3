import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';

export interface Event {
  id: number;
  name: string;
  date: string;
  category_id: number;
  organizer_id: number;
  location: string;
  target_price: string;
  detail: string;
  event_status: number;
  ban_status: number;
  ticket_price: string;
  current_price: string;
  organization_name: string;
  organization_email: string;
  category_name: string;
  registrations?: Registration[];
}

export interface Registration {
  id: number;
  event_id: number;
  user_name: string;
  user_email: string;
  registration_date: string;
  ticket_count: number;
}

@Component({
  selector: 'app-event-list',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  events: Event[] = [];
  loading = false;
  error = '';
  selectedEvent: Event | null = null;
  showDetailModal = false;

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    this.eventService.getAllEvents().subscribe({
      next: (data) => {
        this.events = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load events';
        this.loading = false;
        console.error('Error loading events:', error);
      }
    });
  }

  getStatus(event: Event): string {
    if (event.ban_status === 0) {
      return 'Suspended';
    }
    
    const eventDate = new Date(event.date);
    const now = new Date();
    
    if (eventDate < now) {
      return 'Past';
    } else {
      return 'Active';
    }
  }

  getStatusClass(event: Event): string {
    const status = this.getStatus(event);
    switch (status) {
      case 'Active': return 'status-active';
      case 'Past': return 'status-past';
      case 'Suspended': return 'status-suspended';
      default: return '';
    }
  }

  viewDetails(event: Event): void {
    this.loading = true;
    this.eventService.getEventDetail(event.id).subscribe({
      next: (detail) => {
        this.selectedEvent = detail;
        this.showDetailModal = true;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load event details';
        this.loading = false;
        console.error('Error loading event details:', error);
      }
    });
  }

  closeModal(): void {
    this.showDetailModal = false;
    this.selectedEvent = null;
  }

  deleteEvent(eventId: number): void {
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(eventId).subscribe({
        next: () => {
          this.events = this.events.filter(event => event.id !== eventId);
          alert('Event deleted successfully');
        },
        error: (error) => {
          if (error.status === 400) {
            alert('Cannot delete event because it has registrations');
          } else {
            alert('Failed to delete event');
          }
          console.error('Error deleting event:', error);
        }
      });
    }
  }

  getTotalRegistrations(event: Event): number {
    return event.registrations?.length || 0;
  }

  getTotalTickets(event: Event): number {
    return event.registrations?.reduce((sum, reg) => sum + reg.ticket_count, 0) || 0;
  }

  getTotalRevenue(event: Event): number {
    const ticketCount = this.getTotalTickets(event);
    return ticketCount * parseFloat(event.ticket_price || '0');
  }
  
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  }

}