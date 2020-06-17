import { LightningElement, api } from "lwc";
import templateActiveItem from "./templateActiveItem";

import templateInActiveItem from "./templateInActiveItem";
export default class LifeEventItem extends LightningElement {
    @api type;
    @api label;
    @api icon;
    @api showLeftBar;
    @api showRightBar;
    @api active;
    @api date;

    constructor() {
        super();
        this.showLeftbar = this.showRightBar = this.active = false;
        this.icon = "utility:connected_apps";
        this.label = "Label";
        this.type = "Birth";
        this.date = new Date().toISOString();
    }

    handleClick(event) {
        event.preventDefault();
        const selectedEvent = new CustomEvent("selected", {
            detail: {
                type: this.type,
                name: this.label
            }
        });
        this.dispatchEvent(selectedEvent);
    }

    render() {
        if (this.active) {
            return templateActiveItem;
        }
        return templateInActiveItem;
    }
}
