import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditsComponent } from './credits/credits.component';
import { ControlsComponent } from './controls/controls.component';
import { DisplayComponent } from './display/display.component';
import { ApiCreditsComponent } from './api-credits/api-credits.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    CreditsComponent,
    ControlsComponent,
    DisplayComponent,
    ApiCreditsComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

}
