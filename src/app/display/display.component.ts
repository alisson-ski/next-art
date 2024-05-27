import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ArtDisplayData } from '../interfaces/art-display-data';
import { NextArtService } from '../services/next-art.service';
import { Observable, map } from 'rxjs';


@Component({
  selector: 'app-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './display.component.html',
  styleUrl: './display.component.scss'
})
export class DisplayComponent {

  nextArtService = inject(NextArtService);
  
  data$: Observable<ArtDisplayData | null> = this.nextArtService.currentArtDisplayData$;

  filledStarsArray$: Observable<any[]> = this.data$.pipe(map(data => {
    if (data == null) return [];
    return new Array(data.rating).fill(0);
  }));

  emptyStarsArray$: Observable<any[]> = this.data$.pipe(map(data => {
    if (data == null) return [];
    return new Array(5 - data.rating).fill(0);
  }));

  constructor() { }
}
