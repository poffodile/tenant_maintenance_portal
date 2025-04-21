import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaintenanceRequest } from '../models/maintenance_request.model';
import { LocalStorageService } from '../services/local-storage.service';
type FormData = Omit<MaintenanceRequest, 'createdAt' | 'status'>; // Exclude createdAt and status from the form data type

@Component({
  selector: 'app-maintenance-form',
  standalone: true,
  templateUrl: './maintenance-form.component.html',
  styleUrl: './maintenance-form.component.css',
  imports: [FormsModule, CommonModule], // Import FormsModule and CommonModule for form handling
})
export class MaintenanceFormComponent implements OnInit {
  //formData: Omit<MaintenanceRequest, 'createdAt'> = {
  formData: FormData = {
    tenantName: '',
    description: '',
    urgency: '',
  };

  requests: MaintenanceRequest[] = []; // list of requests
  searchTerm: string = '';
  successMessage: string = '';
  isEditMode: boolean = false;
  editIndex: number | null = null;

  constructor(private storageService: LocalStorageService) {}

  filteredRequests(): MaintenanceRequest[] {
    // Filter requests based on the search term
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) return this.requests;

    return this.requests.filter(
      (req) =>
        req.tenantName.toLowerCase().includes(term) ||
        req.urgency.toLowerCase().includes(term) ||
        req.description.toLowerCase().includes(term)
    );
  }

  ngOnInit(): void {
    this.requests = this.storageService.loadRequests();
  }
  //const storedRequests = this.storageService.getItem('maintenanceRequests');
  // if (storedRequests) {
  //     this.requests = JSON.parse(storedRequests);

  // }

  // saveRequestsToLocalStorage() {
  //   this.storageService.setItem('maintenanceRequests', JSON.stringify(this.requests));
  // }

  submitRequest(): void {
    if (
      !this.formData.tenantName.trim() ||
      !this.formData.description.trim() ||
      !this.formData.urgency
    ) {
      alert('Please fill in all fields properly.');
      return;
    }

    if (this.isEditMode && this.editIndex !== null) {
      this.requests[this.editIndex] = {
        ...this.requests[this.editIndex],
        ...this.formData,
      };
      this.isEditMode = false;
      this.editIndex = null;
    } else {
      this.requests.push({
        ...this.formData,
        createdAt: new Date(),
        status: 'New',
      });
    }
    this.storageService.saveRequests(this.requests);

    this.formData = {
      tenantName: '',
      description: '',
      urgency: '',
    };

    this.successMessage = this.isEditMode
      ? 'Request updated successfully!'
      : 'Request submitted successfully!';

    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  deleteRequest(index: number) {
    const confirmed = confirm('Are you sure you want to delete this request?');
    if (confirmed) {
      this.requests.splice(index, 1);
      //this.saveRequestsToLocalStorage();
      this.storageService.saveRequests(this.requests);
    }
  }

  editRequest(index: number) {
    this.formData = { ...this.requests[index] };
    this.isEditMode = true;
    this.editIndex = index;

    this.successMessage = this.isEditMode
      ? 'Request updated successfully!'
      : 'Request submitted successfully!';

    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  clearAllRequests() {
    const confirmed = confirm('Are you sure you want to delete all requests?');
    if (confirmed) {
      this.requests = [];
      // this.storageService.removeItem('maintenanceRequests');
      this.storageService.clearRequests();
    }
  }
  exportToJSON(): void {
    const jsonData = JSON.stringify(this.requests, null, 2); // gives  Pretty-print with indentation
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'maintenance_requests.json';
    a.click();

    window.URL.revokeObjectURL(url); // Cleans up the object URL
  }
}
