import { LightningElement, api, track } from "lwc";
import getTaskList from "@salesforce/apex/TaskList.getTaskList";
import UpdateTask from "@salesforce/apex/TaskList.UpdateTask";
import { NavigationMixin } from "lightning/navigation";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

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
        UpdateTask(payload)
            .then((x) => {
                this.showToast();
            })
            .catch(console.error);
    }

    showToast() {
        const event = new ShowToastEvent({
            title: "Aufgabe wurde aktualisiert",
            variant: "success"
        });
        this.dispatchEvent(event);
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
        console.log(e.detail.id);
        try {
            let pageRef = {
                type: "standard__recordPage",
                attributes: {
                    objectApiName: "Task",
                    actionName: "view",
                    recordId: e.detail.id
                }
            };
            this[NavigationMixin.Navigate](pageRef);
        } catch (er) {
            console.error(er);
        }
    }
    handleNewTask() {
        try {
            let pageRef = {
                type: "standard__objectPage",
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
