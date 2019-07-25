import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeService } from 'src/app/shared/employee.service';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { DepartmentService } from 'src/app/shared/department.service';

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

  constructor(private service: EmployeeService, private departmentService: DepartmentService) { }

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
}
