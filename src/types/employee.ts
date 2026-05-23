export interface Employee {
    id: string;
    employeeId: string;
    firstName: string;
    lastName: string;
    designation?: string;
    branchesAssigned?: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
