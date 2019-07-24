import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(public snackBar: MatSnackBar) { }

  //snackbar can be configured here with properties
  config: MatSnackBarConfig = {
    duration: 3000, 
    horizontalPosition: 'right',
    verticalPosition: 'top'
  }

success(msg) {
  //here i pass on css classes to the config of the snackbar
  this.config['panelClass'] = ['notification', 'success'];
  this.snackBar.open(msg, '', this.config);
}
}
