import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-maintenance-form',
  standalone: true,

  //imports: [],
  templateUrl: './maintenance-form.component.html',
  styleUrl: './maintenance-form.component.css',
  imports: [FormsModule, CommonModule], // Import FormsModule and CommonModule for form handling
})
export class MaintenanceFormComponent {
  formData = {
    tenantName: '',
    description: '',
    urgency: '',
  };

  requests: any[] = []; // list of requests

  submitRequest() {
    this.requests.push({ ...this.formData }); // add to the list of requests
    // Reset form data after submission
    this.formData = {
      tenantName: '',
      description: '',
      urgency: '',
    };

    //console.log('Maintenance Request Submitted:', this.formData);
    // TODO: add to a list of requests
  }

  deleteRequest(index: number) {
    this.requests.splice(index, 1); // removes the request at the given index
  }
}
