import { LightningElement, api } from "lwc";

export default class TaskItem extends LightningElement {
    @api id;
    @api subject;
    @api status;
    @api activityDate;
    @api isClosed;
    @api item;

    get isComplete() {
        return this.status === "Completed";
    }
    fixId() {
        return this.id.replace(/-[0-9]{0,4}$/, "");
    }

    //Check checkbox
    handleCheckItem(e) {
        e.preventDefault();
        this.isClosed = !this.isClosed;
        // TODO maybe handle this differently
        if (this.isClosed) {
            this.status = "Completed";
        } else {
            this.status = "Open";
        }
        const selectedEvent = new CustomEvent("checked", {
            detail: {
                id: this.fixId(),
                status: this.status
            }
        });
        this.dispatchEvent(selectedEvent);
    }

    //click on task
    handleClick(event) {
        event.preventDefault();
        const selectedEvent = new CustomEvent("selected", {
            detail: {
                id: this.fixId()
            }
        });
        console.log(selectedEvent);
        this.dispatchEvent(selectedEvent);
    }
}
