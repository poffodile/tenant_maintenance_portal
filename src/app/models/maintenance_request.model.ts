export interface MaintenanceRequest {
  tenantName: string;
  description: string;
  urgency: 'Low' | 'Medium' | 'High';
  createdAt: Date; // Date when the request was created
  status: string; // Status of the request (e.g., "Pending", "In Progress", "Completed")
}
