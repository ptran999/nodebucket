/**
 * Title: task.component.ts
 * Author: Professor Krasso
 * Date: 6/12/24
 * Modified By: Phuong Tran
 */

import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { Employee } from './employee.interface';
import { Task } from './task.interface';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent {
  // local variables
  empId: number;
  employee: Employee;
  todo: Array<Task>;
  done: Array<Task>;
  errorMessage: string;

  constructor(private http: HttpClient, private cookieService: CookieService, public dialog: MatDialog) {
    // Assign the local variables
    this.empId = parseInt(this.cookieService.get('session_user'), 10);
    this.employee = {} as Employee;
    this.todo = [];
    this.done = [];
    this.errorMessage = '';

    // Call the get all tasks function
    this.getAllTasks()
  }

  getAllTasks() {
    // Call the API with the empID from the user to get the tasks
    this.http.get(`/api/employees/${ this.empId }/tasks`).subscribe({
      next: (emp: any) => {
        // Set the employee to the employee return from the API
        this.employee = emp;
      },
      error: () => {
        // Log an error if there wasn't an employee found with empId passed in
        console.error('Unable to get the employee data for employee ID: ', this.empId);
      },
      complete: () => {
        // Return the todo, in progress and done columns if there is anything on them; If they are nothing on them then return an empty array
        this.todo = this.employee.todo ?? [];
        this.done = this.employee.done ?? [];
      }
    });
  }

  // Create the task using ngForm
  createTask(form: NgForm) {
    // Make sure the form is valid
    if(form.valid) {
      // Get the text value from the form input text
      const todoTask = form.value.task;

      // Do a post request to the API to save the task in the todo array
      this.http.post(`/api/employees/${ this.empId }/tasks`, { text: todoTask }).subscribe({
        next: (result: any) => {
          // Create the new task
          const newTodoItem = {
            _id: result.id,
            text: todoTask
          };
          // Push the new task to the todo array
          this.todo.push(newTodoItem);
        },
        error: (err) => {
          // Log an error if the task was not created
          console.error('Unable to create task for employee: ', this.empId, err);
          // Display an error message
          this.errorMessage = err.message;
        }
      })
    }
  }

  // Update the tasks
  updateTasksList(todo: Task[], done: Task[]) {
    // Do a put request to the API to update the tasks arrays
    this.http.put(`/api/employees/${ this.empId }/tasks`, { todo,  done }).subscribe({
      next: (result: any) => {
        console.log('Update Successful');
      },
      error: (err) => {
        // Log an error if the update of the arrays failed
        console.error('Unable to update the tasks arrays: ', err);
        // Display an error message
        this.errorMessage = err.message;
      }
    })
  }

  // Delete the task
  deleteTask(taskId: string) {

    // Create the dialog with custom blur overlay
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      panelClass: 'custom-dialog-container',
      disableClose: true,
      autoFocus: false,
    });

    // After the dialog is confirmed; then delete the task with the taskId
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        // Do a delete request to the API with the empID and taskID
        this.http.delete(`/api/employees/${ this.empId }/tasks/${taskId}`).subscribe({
          next: (result: any) => {

            // Make sure if the tasks arrays are null to initialize them to an empty array
            if(!this.todo) this.todo = [];
            if(!this.done) this.done = [];

            // Delete the task that matches the taskID
            this.todo = this.todo.filter(task => task._id.toString() !== taskId.toString());
            this.done = this.done.filter(task => task._id.toString() !== taskId.toString());

          },
          error: (err) => {
            // Log an error is the task was unable to delete
            console.error('Unable to delete task: ', err);
            // Display an error message
            this.errorMessage = err.message;
          }
        });
      }
    });
  }

  // Drop event for the cdkDragDrop
  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

       // Call the update task list to update the list in the database with the new index
       this.updateTasksList(this.todo, this.done);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
       // Call the update task list to update the arrays in the database with the new tasks added/removed
       this.updateTasksList(this.todo,  this.done);
    }
  }

}

