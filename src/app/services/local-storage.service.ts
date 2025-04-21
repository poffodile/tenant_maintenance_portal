import { Injectable } from '@angular/core';
import { MaintenanceRequest } from '../models/maintenance_request.model';

/**
 * this would help wuth sepration as the component doe snot need to care where the dat would be stored
 * it also would make it reusable and  makes the code cleaner
 */
@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private storageKey = 'maintenanceRequests';

  // Save requests to local storage
  saveRequests(requests: MaintenanceRequest[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(requests));
  }

  // Load requests from local storage
  loadRequests(): MaintenanceRequest[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  // Clear all requests
  clearRequests(): void {
    localStorage.removeItem(this.storageKey);
  }
}
