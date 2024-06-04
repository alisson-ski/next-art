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
  isLoading$: Observable<boolean> = this.nextArtService.isLoading$;

  filledStarsArray$: Observable<any[]> = this.data$.pipe(map(data => {
    if (!data?.rating) return [];
    return new Array(Math.round(data.rating)).fill(0);
  }));

  emptyStarsArray$: Observable<any[]> = this.data$.pipe(map(data => {
    if (!data?.rating) return new Array(5).fill(0);
    return new Array(Math.round(5 - data.rating)).fill(0);
  }));

  constructor() { }
}
