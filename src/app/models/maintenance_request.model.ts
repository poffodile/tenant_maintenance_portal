export interface MaintenanceRequest {
  tenantName: string;
  description: 'Low' | 'Medium' | 'High';
  urgency: string;
  createdAt: Date; // Date when the request was created
  status: string; // Status of the request (e.g., "Pending", "In Progress", "Completed")
}
