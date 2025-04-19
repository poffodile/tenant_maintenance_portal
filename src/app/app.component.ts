import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MaintenanceFormComponent } from './maintenance-form/maintenance-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MaintenanceFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'tenant-maintenance-portal';
}
