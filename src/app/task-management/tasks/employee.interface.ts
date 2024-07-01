/**
 * Title: employee.interface.ts
 * Author: Phuong Tran
 * Date: 6/19/2024
 * Description: Employee Interface
 */
import { Task } from "./task.interface";

export interface Employee {
  empId: number;
  todo: Array<Task>;
  done: Array<Task>;
}