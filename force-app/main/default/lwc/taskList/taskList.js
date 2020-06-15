import { LightningElement, wire, api } from "lwc";

import getTaskList from "@salesforce/apex/TaskList.getTaskList";
import UpdateTask from "@salesforce/apex/TaskList.UpdateTask";

export default class TaskList extends LightningElement {
    tasks; //property
    @api IconName;

    constructor() {
        super();
        this.tasks = [];
    }

    @wire(getTaskList)
    getTasks(zeug) {
        // getTaskList().then(console.log);
        if (zeug.data) {
            this.tasks = zeug.data; //prop beschreiben
            console.log(zeug.data);
        } else if (zeug.error) {
            console.error(zeug.error);
        }
        // console.log(zeug.error);
    }

    handleCheck(event) {
        // console.log(event.detail.status);
        console.log("id: ", event.detail.id);
        const payload = { rid: event.detail.id, status: event.detail.status };
        console.log(payload);
        UpdateTask(payload).then(console.log).catch(console.error);
    }
}
