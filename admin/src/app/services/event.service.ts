import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Event {
    id: number;
    name: string;
    date: string;
    category_id: number;
    organizer_id: number;
    location: string;
    target_price: string;
    detail: string;
    event_status: number; // 0: Past, 1: Active
    ban_status: number;  // 0: Suspended, 1: Active
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


@Injectable({
    providedIn: 'root'
})


export class EventService {
    private apiUrl = 'http://localhost:3060/api';

    constructor(private http: HttpClient) { }

    getAllEvents(): Observable<Event[]> {
        return this.http.get<Event[]>(`${this.apiUrl}/events`);
    }

    getEventDetail(id: number): Observable<Event> {
        return this.http.get<Event>(`${this.apiUrl}/detail/${id}`);
    }

    updateEvent(id: number, eventData: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, eventData);
    }

    deleteEvent(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    createEvent(eventData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/event`, eventData);
    }

    getCategories(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/categories`);
    }

    getOrganization(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/organization`);
    }
}