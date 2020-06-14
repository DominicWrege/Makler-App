import { LightningElement, api } from "lwc";

export default class LifeEventItem extends LightningElement {
    @api item;

    handleClick(event) {
        console.log(this.item.icon);
        event.preventDefault();
        const selectedEvent = new CustomEvent("selected", {
            detail: this.item
        });
        this.dispatchEvent(selectedEvent);
    }
}
