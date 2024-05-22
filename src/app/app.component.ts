import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditsComponent } from './credits/credits.component';
import { ControlsComponent } from './controls/controls.component';
import { DisplayComponent } from './display/display.component';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    CreditsComponent,
    ControlsComponent,
    DisplayComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  ngOnInit() {
    console.log('test env:', environment.apiKeys.movie);
  }
}
