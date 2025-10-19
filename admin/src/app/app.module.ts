import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EventsComponent } from './components/events/events.component';
import { EditEventComponent } from './components/edit-event/edit-event.component';

import { NavigationComponent } from './components/nav/nav.component';
import { CreateEventComponent } from './components/create-event/create-event.component';



@NgModule({
  declarations: [
    AppComponent,
    EventsComponent,
    EditEventComponent,

    NavigationComponent,
    CreateEventComponent
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
