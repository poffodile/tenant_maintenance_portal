import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-maintenance-form',
  standalone: true,

  //imports: [],
  templateUrl: './maintenance-form.component.html',
  styleUrl: './maintenance-form.component.css',
  imports: [FormsModule],
})
export class MaintenanceFormComponent {
  formData = {
    tenantName: '',
    description: '',
    urgency: '',
  };

  submitRequest() {
    console.log('Maintenance Request Submitted:', this.formData);
    // TODO: add to a list of requests
  }
}
