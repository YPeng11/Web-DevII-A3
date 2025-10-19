import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Event, EventService, RegistrationRequest } from '../../services/event.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  event: Event | null = null;
  loading = true;
  submitting = false;
  error = '';
  success = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService
  ) {
    this.registerForm = this.fb.group({
      user_name: ['', [Validators.required, Validators.minLength(2)]],
      user_email: ['', [Validators.required, Validators.email]],
      ticket_count: [1, [Validators.required, Validators.min(1), Validators.max(20)]]
    });
  }

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

  onSubmit(): void {
    if (this.registerForm.valid && this.event) {
      this.submitting = true;
      this.error = '';

      const registrationData: RegistrationRequest = {
        event_id: this.event.id,
        user_name: this.registerForm.value.user_name,
        user_email: this.registerForm.value.user_email,
        ticket_count: this.registerForm.value.ticket_count
      };

      this.eventService.createRegistration(this.event.id, registrationData).subscribe({
        next: (response) => {
          this.success = true;
          this.submitting = false;
        
        },
        error: (error) => {
          console.error('Registration error:', error);
          this.error = 'Registration failed. Please try again.';
          this.submitting = false;
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
    }
  }

  getTotalPrice(): number {
    if (this.event?.ticket_price && this.registerForm?.value.ticket_count) {
      return this.event.ticket_price * this.registerForm.value.ticket_count;
    }
    return 0;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  }

  goBack(): void {
    if (this.event) {
      this.router.navigate(['/detail', this.event.id]);
    } else {
      this.router.navigate(['/']);
    }
  }
}