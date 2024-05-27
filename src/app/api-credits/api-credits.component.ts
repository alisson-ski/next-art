import { Component, inject } from '@angular/core';
import { NextArtService } from '../services/next-art.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-api-credits',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './api-credits.component.html',
  styleUrl: './api-credits.component.scss'
})
export class ApiCreditsComponent {

  nextArtService = inject(NextArtService);

  constructor() { }
}
