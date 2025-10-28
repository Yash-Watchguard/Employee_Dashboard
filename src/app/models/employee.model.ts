export interface Employee {
 id:number
 name:string
 email:string
 department:Department
 position:string
 salary:number
}

export enum Department {
  HR = 'HR',
  SALES = 'Sales',
  ENGINEERING = 'Engineering',
  FINANCE = 'Finance',
  INTERN='Intern'
}