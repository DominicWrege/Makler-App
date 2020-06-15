import { LightningElement, api } from "lwc";

export default class TaskItem extends LightningElement {
    @api id;
    @api subject;
    @api status;
    @api activityDate;
    @api isClosed;

    get isComplete() {
        return this.status === "Completed";
    }
    handleCheckItem(e) {
        e.preventDefault();
        this.isClosed = !this.isClosed;
        if (this.isClosed) {
            this.status = "Completed";
        } else {
            this.status = "Open";
        }
        const selectedEvent = new CustomEvent("checked", {
            detail: {
                id: this.id.replace(/-[0-9]{1,2}$/, ""),
                status: this.status
            }
        });
        this.dispatchEvent(selectedEvent);
    }
}
