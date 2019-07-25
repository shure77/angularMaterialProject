import { Component, OnInit } from '@angular/core';
import { EmployeeService } from 'src/app/shared/employee.service';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {

  employeesArray = [];
  //employeesArray holds the converted values we got back from the firebase database. For Angular Marterial DataTable, we have
  //to convert the data once again! Therefore MatTableDataSource. employeesListData is hooked in the template!
  employeesListData: MatTableDataSource<any>;

  //displayedColumns is hooked to the templates mat-header-row tag (there to the *matHeaderRowDef directive)and defines the header column names
  //wenn die strings im array entfernt werden oder anders sortiert werden, dann kann die Spalte entfernt oder anders angeordnet werden
  displayedColumns: string[] = ['fullName', 'email', 'mobile', 'city', 'actions'];

  constructor(private service: EmployeeService) { }

  //in ngOnInit I get the employee entries from firebase. getEmployees returns an observable, i have to subscribe to! 
  //inside the subscribe function I have to convert the data into an array
  ngOnInit() {
    this.service.getEmployees().subscribe(
      list => {
        this.employeesArray = list.map(item => {
          //here we return an object containing the employee details
          return {
            //we also can assign the Key for each employee!
            $key: item.key,
            //...item.payload.val() returns the object containing the details
            // ...for destructuring -> SPREAD-OPERATOR!
            ...item.payload.val()
          };
        });
        this.employeesListData = new MatTableDataSource(this.employeesArray);
      }
    );
  }
}
