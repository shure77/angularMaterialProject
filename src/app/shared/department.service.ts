import { Injectable } from "@angular/core";
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";

//lodash is an npm package which is installed via cli command: npm i --s lodash
import * as _ from "lodash";

@Injectable({
  providedIn: "root"
})
export class DepartmentService {
  //we get the departments collection from firebase into departmentList and convert it into an array and save it into the array property
  departementList: AngularFireList<any>;
  array = [];

  constructor(private firebase: AngularFireDatabase) {
    this.departementList = this.firebase.list("departments");
    this.departementList.snapshotChanges().subscribe(list => {
      this.array = list.map(item => {
        return {
          $key: item.key,
          ...item.payload.val()
        };
      });
    });
  }

  getDepartmentName($key) {
    if ($key == "0") {
      return "";
    } else {
      //this function will return all departments which match $key
      return _.find(this.array, (obj) => { return obj.$key == $key; })['name'];
    }
  }
}
