/**
 * Title: confirm-dialog.component.js
 * Author: Phuong Tran
 * Date: 6/18/2024
 * Description: Confirm dialog component
 */

import { PostMigrationAction } from './../../../../node_modules/@angular/cdk/schematics/update-tool/migration.d';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent {

  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>) {}

  onConfirm() {
    this.dialogRef.close(true);
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
