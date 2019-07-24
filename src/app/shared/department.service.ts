import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  //we get the departments collection from firebase into departmentList and convert it into an array and save it into the array property
  departementList: AngularFireList<any>;
  array = [];

  constructor(private firebase: AngularFireDatabase) { 
    this.departementList = this.firebase.list('departments');
    this.departementList.snapshotChanges().subscribe(
      list => {
        this.array = list.map(item => {
          return {
            $key: item.key,
            ...item.payload.val()
          }
        });
      }
    );
  }
}
