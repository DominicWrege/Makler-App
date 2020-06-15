import { LightningElement, api } from "lwc";

export default class TaskItem extends LightningElement {
    @api id;
    @api subject;
    @api status;
    @api activityDate;
    @api isClosed;

    get isComplete() {
        return this.status === "Complete";
    }
    handleCheckItem(e) {
        e.preventDefault();
        this.isClosed = !this.isClosed;
        if (this.isClosed) {
            this.status = "Complete";
        } else {
            this.status = "Open";
        }
        const selectedEvent = new CustomEvent("checked", {
            detail: {
                id: this.id.replace(/-12$/, ""),
                status: this.status
            }
        });
        this.dispatchEvent(selectedEvent);
    }
}
