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
        if (zeug.data) {
            this.tasks = zeug.data; //prop beschreiben
        } else if (zeug.error) {
            console.error(zeug.error);
        }
    }

    handleCheck(event) {
        const payload = { rid: event.detail.id, status: event.detail.status };
        console.log(payload);
        UpdateTask(payload)
            .then((d) => console.log("update done!"))
            .catch(console.error);
    }
}
