import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-maintenance-form',
  standalone: true,
  templateUrl: './maintenance-form.component.html',
  styleUrl: './maintenance-form.component.css',
  imports: [FormsModule, CommonModule], // Import FormsModule and CommonModule for form handling
})
export class MaintenanceFormComponent implements OnInit {
  formData = {
    tenantName: '',
    description: '',
    urgency: '',
  };

  requests: any[] = []; // list of requests

  // Loads the saved requests from localStorage when component loads
  ngOnInit(): void {
    const storedRequests = localStorage.getItem('maintenanceRequests');
    if (storedRequests) {
      this.requests = JSON.parse(storedRequests);
    }
  }

  // Save requests to localStorage
  saveRequestsToLocalStorage() {
    localStorage.setItem('maintenanceRequests', JSON.stringify(this.requests));
  }
  submitRequest() {
    //this.requests.push({ ...this.formData }); // add to the list of requests

    //prevents empty space entres in the form
    if (
      !this.formData.tenantName.trim() ||
      !this.formData.description.trim() ||
      !this.formData.urgency
    ) {
      alert('Please fill in all fields properly.');
      return;
    }

    if (this.isEditMode && this.editIndex !== null) {
      // Update the existing request
      this.requests[this.editIndex] = { ...this.formData };
      this.isEditMode = false;
      this.editIndex = null;
    } else {
      // Add a new request
      this.requests.push({ ...this.formData });
    }
    this.saveRequestsToLocalStorage(); // Save to localStorage after adding/updating

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
    this.saveRequestsToLocalStorage(); // Save to localStorage after deletion
  }

  // Track if we're editing an existing request
  isEditMode: boolean = false;
  editIndex: number | null = null;

  // loads the selected request into the form for editing
  editRequest(index: number) {
    this.formData = { ...this.requests[index] }; // Load into form
    this.isEditMode = true;
    this.editIndex = index;
  }
}
