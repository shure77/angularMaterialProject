import { Injectable } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

@Injectable({
  providedIn: "root"
})
export class EmployeeService {
  constructor(private firebase: AngularFireDatabase) {}

  employeeList: AngularFireList<any>;


  form: FormGroup = new FormGroup({
    $key: new FormControl(null),
    fullName: new FormControl("", Validators.required),
    email: new FormControl("", Validators.email),
    mobile: new FormControl("", [Validators.required, Validators.minLength(8)]),
    city: new FormControl(""),
    gender: new FormControl("1"), //will be a radio Button
    department: new FormControl(0), //select dropdown
    hireDate: new FormControl(""), //date picker
    isPermanent: new FormControl(false)
  });

  initializeFormGroup() {
    this.form.setValue({
      $key: null,
      fullName: "",
      email: "",
      mobile: "",
      city: "",
      gender: "1",
      department: "0",
      hireDate: "",
      isPermanent: false
    });
  }

  getEmployees() {
    this.employeeList = this.firebase.list('employees');//employees must be set up in firebase!
    return this.employeeList.snapshotChanges(); //snapshotChanges() will return an Observable
  }

  insertEmployee(employee) {
    this.employeeList.push({
      fullName: employee.fullName,
      email: employee.email,
      mobile: employee.mobile,
      city: employee.city,
      gender: employee.gender,
      department: employee.department,
      hireDate: employee.hireDate,
      isPermanent: employee.isPermanent
    });
  }

  updateEmployee(employee) {
    this.employeeList.update(employee.$key, 
      {
        fullName: employee.fullName,
        email: employee.email,
        mobile: employee.mobile,
        city: employee.city,
        gender: employee.gender,
        department: employee.department,
        hireDate: employee.hireDate,
        isPermanent: employee.isPermanent
      });
  }

  deleteEmployee($key: string) {
    this.employeeList.remove($key);
  }
}
