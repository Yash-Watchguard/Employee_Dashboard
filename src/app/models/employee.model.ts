export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  department: Department;
  position: string;
  salary: number;
  role: Role;
}

export enum Department {
  HR = 'HR',
  SALES = 'Sales',
  ENGINEERING = 'Engineering',
  FINANCE = 'Finance',
  INTERN = 'Intern',
}

export enum Role {
  Admin = 'Admin',
  Employee = 'Employee',
}
