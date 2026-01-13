export interface UserPermission {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  contactNo?: string;
  accountType: string;
  password?: string;
  permissions: string; // JSON string containing permissions
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
