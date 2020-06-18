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
        const textElement = this.template.querySelector(
            ".task-item-inner-subject"
        );
        const className = "crossed-text";
        if (this.isClosed) {
            textElement.classList.add(className);
            this.status = "Completed";
        } else {
            textElement.classList.remove(className);
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
