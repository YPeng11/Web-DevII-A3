import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css']
})
export class EditEventComponent implements OnInit {
  @Input() event: any;
  @Output() eventUpdated = new EventEmitter<void>();
  @Output() cancelEdit = new EventEmitter<void>();

  editForm!: FormGroup;
  categories: any[] = [];
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
  }

  initForm(): void {
    this.editForm = this.fb.group({
      name: [this.event.name, [Validators.required, Validators.minLength(3)]],
      date: [this.formatDateForInput(this.event.date), Validators.required],
      location: [this.event.location, Validators.required],
      detail: [this.event.detail, Validators.required],
      category_id: [this.event.category_id, Validators.required],
      target_price: [this.event.target_price || ''],
      ticket_price: [this.event.ticket_price || '']
    });
  }

  private formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    // YYYY-MM-DD
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  loadCategories(): void {
    this.eventService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.editForm.valid) {
      this.loading = true;
      this.error = '';

      // 准备提交数据
      const formData = { ...this.editForm.value };
      
      // check price is number
      if (formData.target_price) {
        formData.target_price = parseFloat(formData.target_price);
      }
      if (formData.ticket_price) {
        formData.ticket_price = parseFloat(formData.ticket_price);
      }

      formData.organizer_id = this.event.organizer_id;

      this.eventService.updateEvent(this.event.id, formData).subscribe({
        next: () => {
          this.loading = false;
          this.eventUpdated.emit();
        },
        error: (error) => {
          this.loading = false;
          this.error = 'Failed to update event';
          console.error('Error updating event:', error);
        }
      });
    }
  }

  onCancel(): void {
    this.cancelEdit.emit();
  }
}