import { Component } from '@angular/core';
import { Event, EventService, Registration } from '../../services/event.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
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


}
