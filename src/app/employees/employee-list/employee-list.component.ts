import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeService } from 'src/app/shared/employee.service';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { DepartmentService } from 'src/app/shared/department.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { EmployeeComponent } from '../employee/employee.component';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {

  searchKey: string;

  employeesArray = [];
  //employeesArray holds the converted values we got back from the firebase database. For Angular Marterial DataTable, we have
  //to convert the data once again! Therefore MatTableDataSource. employeesListData is hooked in the template!
  employeesListData: MatTableDataSource<any>;

  //displayedColumns is hooked to the templates mat-header-row tag (there to the *matHeaderRowDef directive)and defines the header column names
  //wenn die strings im array entfernt werden oder anders sortiert werden, dann kann die Spalte entfernt oder anders angeordnet werden
  displayedColumns: string[] = ['fullName', 'email', 'mobile', 'city', 'departmentName', 'actions'];

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private service: EmployeeService,
    private departmentService: DepartmentService,
    private dialog: MatDialog, 
    private notificationService: NotificationService) { }

  //in ngOnInit I get the employee entries from firebase. getEmployees returns an observable, i have to subscribe to! 
  //inside the subscribe function I have to convert the data into an array
  ngOnInit() {
    this.service.getEmployees().subscribe(
      list => {
        this.employeesArray = list.map(item => {
          //here i initialize the departmentName property by calling the getDepartmentName of the departmentService
          let departmentName = this.departmentService.getDepartmentName(item.payload.val()['department']);
          //here we return an object containing the employee details
          return {
            //we also can assign the Key for each employee!
            $key: item.key,
            departmentName, // short for departmentName: departmentName
            //...item.payload.val() returns the object containing the details
            // ...for destructuring -> SPREAD-OPERATOR!
            ...item.payload.val()
          };
        });
        this.employeesListData = new MatTableDataSource(this.employeesArray);
        this.employeesListData.sort = this.sort;
        this.employeesListData.paginator = this.paginator;
        //this is to limit the filter function to the shown colums only. Means I do not get any response if I search for the hire date as hire date is not part of the table
        this.employeesListData.filterPredicate = (data, filter) => {
          return this.displayedColumns.some( element => {
            return element != 'actions' && data[element].toLowerCase().indexOf(filter) != -1;
          });
        }
      }
    );
  }

  onSearchClear() {
    this.searchKey = '';
    this.employeesListData.filter = this.searchKey.trim().toLowerCase();
  }

  //keyup-Event to filter employeesList on every keystroke
  applyFilter() {
    this.employeesListData.filter = this.searchKey.trim().toLowerCase();
  }

  onCreate() {
    this.service.initializeFormGroup(); // set the default values
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true; //will disable the feature to close the window by clicking outside the popup window
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%"; //will set the width to 60% of the whole window 
    //we open the EmployeeListComponent in the dialog window
    this.dialog.open(EmployeeComponent, dialogConfig);
  }

  onEdit(row) {
    this.service.populateForm(row);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true; //will disable the feature to close the window by clicking outside the popup window
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%"; //will set the width to 60% of the whole window 
    //we open the EmployeeListComponent in the dialog window
    this.dialog.open(EmployeeComponent, dialogConfig);
  }

  onDelete($key) {
    if(confirm('Are you sure to delete this record ?')){
    this.service.deleteEmployee($key);
    this.notificationService.warn('! Deleted sucessfully');
  }
}
}
