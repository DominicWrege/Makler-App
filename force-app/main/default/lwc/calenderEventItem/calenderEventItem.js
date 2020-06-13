import { LightningElement, api } from "lwc";

export default class CalenderEventItem extends LightningElement {
    @api item;

    handleClick(e) {
        e.preventDefault();
        const selectedEvent = new CustomEvent("selected", {
            detail: this.item
        });
        this.dispatchEvent(selectedEvent);
    }
}
