import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-credits',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './credits.component.html',
  styleUrl: './credits.component.scss'
})
export class CreditsComponent {

  links = [{
    title: 'GitHub',
    href: 'https://github.com/alisson-ski',
    class: 'icon-github'
  },{
    title: 'LinkedIn',
    href: 'https://www.linkedin.com/in/alissonlewinski/',
    class: 'icon-linkedin'
  }]
}
