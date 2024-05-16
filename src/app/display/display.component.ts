import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

export interface ArtDisplayData {
  title: string;
  author: string;
  rating: number;
  year: string;
  description: string;
  imageUrl: string;
  tags: string[];
}

@Component({
  selector: 'app-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './display.component.html',
  styleUrl: './display.component.scss'
})
export class DisplayComponent {

  data: ArtDisplayData = {
    title: 'The Way Of Kings',
    author: 'Brandon Sanderson',
    rating: 4,
    year: '2010',
    description: 'Roshar is a world of stone and storms. Uncanny tempests of incredible power sweep across the rocky terrain so frequently that they have shaped ecology and civilization alike. Animals hide in shells, trees pull in branches, and grass retracts into the soilless ground. Cities are built only where the topography offers shelter.',
    imageUrl: 'https://m.media-amazon.com/images/I/91SkYC1TRHL._SY466_.jpg',
    tags: ['Fantasy', 'Epic', 'Adventure']
  }

  filledStarsArray = new Array(this.data.rating).fill(0);
  emptyStarsArray = new Array(5 - this.data.rating).fill(0);
}
