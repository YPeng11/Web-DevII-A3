import { Component } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavigationComponent {
  isMenuOpen = false;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }
}
