import { LightningElement, wire, api, track } from "lwc";

import getTaskList from "@salesforce/apex/TaskList.getTaskList";
import UpdateTask from "@salesforce/apex/TaskList.UpdateTask";
import { NavigationMixin } from "lightning/navigation";

export default class TaskList extends NavigationMixin( 
    LightningElement
 ) {
    tasks; //property
    @api IconName;

    constructor() {
        super();
        this.tasks = [];
    }


    @wire(getTaskList)
    
    getTasks(zeug) {
        if (zeug.data) {
            this.tasks = zeug.data; //prop beschreiben
        } else if (zeug.error) {
            console.error(zeug.error);
        }
    }

    handleCheck(event) {
        this.updateTask({ rid: event.detail.id, status: event.detail.status });
    }

    updateTask(payload) {
        console.log(payload);
        UpdateTask(payload)
            .then((x) => console.log("update done!"))
            .catch(console.error);
    }


    get isEmpty() {
        return this.tasks.length == 0;
    }

  


    //button 
    handleButtonClick(event) {
        console.log(event);
        event.preventDefault();
        event.stopPropagation();
        this[NavigationMixin.Navigate]({
            type: "standard__objectPage",
            attributes: {
                objectApiName: "Task", 
                actionName: "home"
            }
        });


}
navigateToHandler(e){
    const rid = e.detail; 
    e.event.preventDefault();
    e.event.stopPropagation();
    try{
        this[NavigationMixin.Navigate]({
            type: "standard__recordPage",
            attributes: {
                recordId: rid, 
                objectApiName: "Task",
                actionName: "view"
            }
        }); 
    }catch(er){
    console.error(er); 
    }
} 




 }