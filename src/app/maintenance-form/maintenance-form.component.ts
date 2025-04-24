import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
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
  /**
   * Captures the input from the form fields
   * the 'createdAt' and 'status' fields would be added when submitting the form.
   */
  formData: FormData = {
    tenantName: '',
    description: '',
    urgency: 'Low',
  };

  /**
   * @requests the full list of submitted  maintenance requests.
   * @searchTerm  string to filter the requests based on tenant name, urgency, or description.
   * @successMessage string to display a success message after submitting or updating a request.
   * @formData object to hold the form data for a new or edited request.
   * @isEditMode boolean to check if the form is in edit mode.
   * @editIndex index of the request being edited.
   * @filteredRequests method to filter the requests based on the search term.
   *
   */
  requests: MaintenanceRequest[] = []; // list of request
  searchTerm: string = '';
  successMessage: string = '';
  isEditMode: boolean = false;
  editIndex: number | null = null;

  constructor(private storageService: LocalStorageService) {}

  /**
   * @filteredRequests method to filter the requests based on the search term.
   * @returns filtered array of requests based on the search term.
   */

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

  // isDarkMode: boolean = true;

  theme = 'dark';

  /**
   * @ngOnInit loads the requests from local storage when the component initializes.
   * It retrieves the requests from local storage and assigns them to the requests property.
   */
  ngOnInit(): void {
    this.requests = this.storageService.loadRequests();

    this.theme = localStorage.getItem('theme') || 'dark';
    document.documentElement.classList.add(this.theme);

    //   // Load theme preference
    //   const savedTheme = localStorage.getItem('theme');
    //   this.isDarkMode = savedTheme === 'dark' || savedTheme === null; // default to dark
    //   this.applyTheme();
    // }
    // toggleTheme(): void {
    //   this.isDarkMode = !this.isDarkMode;
    //   const theme = this.isDarkMode ? 'dark' : 'light';
    //   localStorage.setItem('theme', theme);
    //   this.applyTheme();
    // }
    // applyTheme(): void {
    //   const root = document.documentElement;
    //   if (this.isDarkMode) {
    //     root.classList.add('dark');
    //   } else {
    //     root.classList.remove('dark');
    //   }
  }

  toggleTheme() {
    const newTheme = this.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.remove(this.theme);
    document.documentElement.classList.add(newTheme);
    this.theme = newTheme;
    localStorage.setItem('theme', newTheme);
  }

  /**
   * @submitRequest method to submit the form data.
   * It checks if the form is in edit mode or not and updates the request accordingly.
   * It also validates the form data before submission.
   */
  submitRequest(form: NgForm): void {
    // only proceeds if all the required fields are filled
    if (form.invalid) {
      // Mark the form as submitted so that HTML error messages show
      form.form.markAllAsTouched();
      return;
    }

    if (this.isEditMode && this.editIndex !== null) {
      this.requests[this.editIndex] = {
        // if editing, update the existing  request
        ...this.requests[this.editIndex],
        ...this.formData,
      };
      this.isEditMode = false;
      this.editIndex = null;
    } else {
      this.requests.push({
        // if not editing, add a new request
        ...this.formData,
        createdAt: new Date(),
        status: 'New',
      });
    }
    this.storageService.saveRequests(this.requests);

    this.formData = {
      // reset the form data after submission
      tenantName: '',
      description: '',
      urgency: 'Low',
    };
    form.resetForm(); // reset the form fields

    this.successMessage = this.isEditMode
      ? 'Request updated successfully!'
      : 'Request submitted successfully!';

    // Scroll to top so they can see the message
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }
  /**
   * * @deleteRequest method to delete a request from the list. (a specific index)
   * It uses the splice method to remove the request from the array.
   * It prompts the user for confirmation before deleting the request.
   * @param index the index of the request to be deleted.
   */
  deleteRequest(index: number) {
    const confirmed = confirm('Are you sure you want to delete this request?');
    if (confirmed) {
      this.requests.splice(index, 1);
      //this.saveRequestsToLocalStorage();
      this.storageService.saveRequests(this.requests);
    }
  }
  /**
   * * @editRequest method to edit a request from the list. (a specific index)
   * It sets the form data to the selected request and switches to edit mode.
   * @param index the index of the request to be edited.
   */
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

  /**
   * * @exportToJSON method to export the requests to a JSON file.
   * It converts the requests array to a JSON string and creates a Blob object from it.
   */
  exportToJSON(): void {
    const jsonData = JSON.stringify(this.requests, null, 2); // Converts requests to JSON format with pretty print indentation
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'maintenance_requests.json';
    a.click();

    window.URL.revokeObjectURL(url); // Cleans up the object URL
  }

  /**
   * * @updateStatus method to update the status of a request.
   * It sets the status of the request to "In Progress" or "Completed" based on the current status.
   * @param index the index of the request to be updated.
   * It also persists the changes to local storage.
   */
  updateStatus(index: number): void {
    this.storageService.saveRequests(this.requests); // persist changes
  }

  /**
   * * @getSummary method to get a summary of the requests.
   * It counts the number of requests based on their urgency level (Low, Medium, High).
   * It returns an object containing the total number of requests and the count of each urgency level.
   * @returns an object containing the total number of requests and the count of each urgency level.
   */
  getSummary() {
    const summary = {
      total: this.requests.length,
      low: 0,
      medium: 0,
      high: 0,
    };

    for (const req of this.requests) {
      if (req.urgency === 'Low') summary.low++;
      if (req.urgency === 'Medium') summary.medium++;
      if (req.urgency === 'High') summary.high++;
    }

    return summary;
  }
}
