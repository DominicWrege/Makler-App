import { LightningElement, api, track } from "lwc";
import getTaskList from "@salesforce/apex/TaskList.getTaskList";
import UpdateTask from "@salesforce/apex/TaskList.UpdateTask";
import { NavigationMixin } from "lightning/navigation";

export default class TaskList extends NavigationMixin(LightningElement) {
    @api IconName;
    @track tasks;

    constructor() {
        super();
        this.tasks = [];
    }

    handleCheck(event) {
        this.updateTask({ rid: event.detail.id, status: event.detail.status });
    }

    connectedCallback() {
        getTaskList()
            .then((list) => (this.tasks = list))
            .catch((e) => console.error("error", e));
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

    get title() {
        const t = "Meine Aufgaben";
        return this.isEmpty ? `${t} (-)` : `${t} (${this.tasks.length})`;
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
    navigateToHandler(e) {
        const rid = e.detail;
        e.event.preventDefault();
        e.event.stopPropagation();
        try {
            this[NavigationMixin.Navigate]({
                type: "standard__recordPage",
                attributes: {
                    recordId: rid,
                    objectApiName: "Task",
                    actionName: "view"
                }
            });
        } catch (er) {
            console.error(er);
        }
    }
    handleNewTask() {
        try {
            let pageRef = {
                type: "standard__recordPage",
                attributes: {
                    objectApiName: "Task",
                    actionName: "new"
                }
            };
            this[NavigationMixin.Navigate](pageRef);
        } catch (err) {
            console.error("Error while show Life Event ", err);
        }
    }
}
