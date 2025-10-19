import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {
  createForm!: FormGroup;
  categories: any[] = [];
  organizations: any[] = [];
  loading = false;
  error = '';
  success = false;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
    this.loadOrganization();
  }

  initForm(): void {
    this.createForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      date: ['', Validators.required],
      location: ['', Validators.required],
      detail: ['', Validators.required],
      organization_id: ['', Validators.required],
      category_id: ['', Validators.required],
      target_price: ['', [Validators.min(0)]],
      ticket_price: ['', [Validators.min(0)]]
    });
  }

  loadCategories(): void {
    this.eventService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.error = 'Failed to load categories';
      }
    });
  }

  loadOrganization(): void {
   this.eventService.getOrganization().subscribe({
      next: (data) => {
        this.organizations = data;
      },
      error: (error) => {
        console.error('Error loading organization:', error);
        this.error = 'Failed to load organization';
      }
    });
  }

  onSubmit(): void {
    if (this.createForm.valid) {
      this.loading = true;
      this.error = '';

      const formData = this.createForm.value;

      // to number
      if (formData.target_price) {
        formData.target_price = parseFloat(formData.target_price);
      } else {
        formData.target_price = null;
      }
      
      if (formData.ticket_price) {
        formData.ticket_price = parseFloat(formData.ticket_price);
      } else {
        formData.ticket_price = null;
      }

      this.eventService.createEvent(formData).subscribe({
        next: (response) => {
          this.loading = false;
          this.success = true;
          this.createForm.reset();
          this.router.navigate(['/events']);
     
        },
        error: (error) => {
          this.loading = false;
          this.error = 'Failed to create event. Please try again.';
          console.error('Error creating event:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.createForm.controls).forEach(key => {
      this.createForm.get(key)?.markAsTouched();
    });
  }

  onCancel(): void {
    this.router.navigate(['/events']);
  }
}