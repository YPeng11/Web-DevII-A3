import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { LayoutComponent } from './components/layout/layout.component';
import { IndexComponent } from './components/index/index.component';


const routes: Routes = [
  { path: '', component: IndexComponent },

  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    IndexComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }