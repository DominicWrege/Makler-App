import { LightningElement, api, track } from "lwc";
import templateActiveItem from "./templateActiveItem";

import templateInActiveItem from "./templateInActiveItem";
export default class LifeEventItem extends LightningElement {
    @api type;
    @api label;
    @api icon;
    @api hideLeftBar;
    @api hideRightBar;
    @api active;
    @api date;
    itemBox;
    @api eventId;
    @track hover;

    constructor() {
        super();
        this.hover = false;
        this.eventId = "";
        this.hideLeftbar = this.hideRightBar = this.active = false;
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

    handlerOpenEvent(event) {
        event.preventDefault();
        const selectedEvent = new CustomEvent("show", {
            detail: {
                eventId: this.eventId
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
    renderedCallback() {
        this.itemBox = this.template.querySelector(".item-box");
    }
    showNormalIcon(e) {
        this.itemBox.style.background = "#f4f6fe";
        this.hover = true;
    }
    showPlusIcon(e) {
        this.itemBox.style.background = "#e8e8e8";
        this.hover = false;
    }
}
