import { LightningElement, api } from "lwc";

export default class LifeEventItem extends LightningElement {
    @api item;
    @api first;
    @api last;

    constructor() {
        super();
        this.first = false;
        this.last = false;
    }

    handleClick(event) {
        console.log(this.item.icon);
        event.preventDefault();
        const selectedEvent = new CustomEvent("selected", {
            detail: this.item
        });
        this.dispatchEvent(selectedEvent);
    }
}
