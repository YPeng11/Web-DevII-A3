import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EventsComponent } from './components/events/events.component';
import { EditEventComponent } from './components/edit-event/edit-event.component';
<<<<<<< HEAD
import { NavigationComponent } from './components/nav/nav.component';
import { CreateEventComponent } from './components/create-event/create-event.component';
=======
import { NavComponent } from './components/nav/nav.component';
>>>>>>> 8496f5df2173f8ee5619277662ced992a9e32aa2

@NgModule({
  declarations: [
    AppComponent,
    EventsComponent,
    EditEventComponent,
<<<<<<< HEAD
    NavigationComponent,
    CreateEventComponent
=======
    NavComponent
>>>>>>> 8496f5df2173f8ee5619277662ced992a9e32aa2
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
