import { Component, inject } from '@angular/core';
import { NextArtService } from '../services/next-art.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-controls',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './controls.component.html',
  styleUrl: './controls.component.scss'
})
export class ControlsComponent {

  public nextArtService = inject(NextArtService);

  switchQueue(queueName: string) {
    this.nextArtService.switchQueue(queueName);
  }
}
