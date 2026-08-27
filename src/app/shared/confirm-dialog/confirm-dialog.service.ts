import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogData } from './confirm-dialog.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  openDeleteConfirm(itemName: string): Observable<boolean> {
    const data: ConfirmDialogData = {
      title: 'Delete Superhero?',
      message: `Are you sure you want to delete "${itemName}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel'
    };

    return this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      disableClose: true,
      data
    }).afterClosed();
  }
}