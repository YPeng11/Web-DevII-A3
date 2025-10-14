import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Event {
  id: number;
  name: string;
  organization_name: string;
  detail: string;
  date: string;
  event_status: number;
  ban_status: number;
  location?: string;
  category_name?: string;
  price?: number;
  target_price?: number;
}

export interface Category {
  id: number;
  name: string;
}

export interface SearchParams {
  date?: string;
  location?: string;
  category_id?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:3060/api/events';

  constructor(private http: HttpClient) { }

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl);
  }

  searchEvents(params: SearchParams): Observable<Event[]> {
    let httpParams = new HttpParams();
    
    if (params.date) {
      httpParams = httpParams.set('date', params.date);
    }
    if (params.location) {
      httpParams = httpParams.set('location', params.location);
    }
    if (params.category_id) {
      httpParams = httpParams.set('category_id', params.category_id);
    }

    return this.http.get<Event[]>(`${this.apiUrl}/search`, { params: httpParams });
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }
}