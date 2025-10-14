import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Event, Category, EventService, SearchParams } from '../../services/event.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchForm: FormGroup;
  categories: Category[] = [];
  events: Event[] = [];
  loading = false;
  error = '';
  hasSearched = false;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService
  ) {
    this.searchForm = this.fb.group({
      date: [''],
      location: [''],
      category: ['']
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.eventService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.error = 'Error loading categories';
      }
    });
  }

  onSubmit(): void {
    if (this.searchForm.valid) {
      this.searchEvents();
    }
  }

  searchEvents(): void {
    this.loading = true;
    this.error = '';
    this.hasSearched = true;

    const searchParams: SearchParams = {
      date: this.searchForm.value.date,
      location: this.searchForm.value.location,
      category_id: this.searchForm.value.category
    };

    this.eventService.searchEvents(searchParams).subscribe({
      next: (events) => {
        this.events = events;
        this.loading = false;
      },
      error: (error) => {
        console.error('Search error:', error);
        this.error = `Search error: ${error.message}`;
        this.loading = false;
        this.events = [];
      }
    });
  }

  clearFilters(): void {
    this.searchForm.reset();
    this.events = [];
    this.hasSearched = false;
    this.error = '';
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

  getCompletionRate(event: Event): number {
    if (event.price && event.target_price) {
      return (event.price / event.target_price) * 100;
    }
    return 0;
  }

  get resultsCount(): string {
    return `There are ${this.events.length} Events`;
  }
}