import { LightningElement, api } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import formFactorName from "@salesforce/client/formFactor";

import { encodeDefaultFieldValues } from "lightning/pageReferenceUtils";

class LifeEvent {
    constructor(description, type, icon) {
        this.description = description;
        this.type = type;
        this.icon = icon;
        this.id = `${this.description} ${
            Math.floor(Math.random() * 500) + Math.floor(Math.random() * 500)
        }`;
    }
}

const allLifeEvents = [
    new LifeEvent("Geburt", "Birth", "custom:custom1"),
    new LifeEvent("Schule..", "Graduation", "custom:custom16"),
    new LifeEvent("Job", "Job", "custom:custom84"),
    new LifeEvent("Item", "Job", "utility:connected_apps"),
    new LifeEvent("Item1", "Job", "utility:connected_apps"),
    new LifeEvent("Item2", "Job", "utility:connected_apps"),
    new LifeEvent("Item3", "Job", "utility:connected_apps"),
    new LifeEvent("Item4", "Job", "utility:connected_apps"),
    new LifeEvent("Item5", "Job", "utility:connected_apps"),
    new LifeEvent("Item6", "Job", "utility:connected_apps")
];

export default class LifeEvents extends NavigationMixin(LightningElement) {
    @api recordId;
    events;
    constructor() {
        super();
        this.events = allLifeEvents;
        console.log("form", formFactorName);
    }

    handleSelection(event) {
        const eventData = event.detail;
        let pageRef = {
            type: "standard__objectPage",
            attributes: {
                objectApiName: "PersonLifeEvent",
                actionName: "new"
                // recordId: this.recordId
            },
            state: {
                defaultFieldValues: {}
            }
        };
        //TOD fix recordId pass for account
        const fields = {
            Name: `${eventData.description} Event`,
            EventType: eventData.type,
            PrimaryPersonId: this.recordId
        };
        if (formFactorName === "Large") {
            pageRef.state.defaultFieldValues = encodeDefaultFieldValues({
                Name: `${event.description} Event`,
                EventType: eventData.type,
                PrimaryPersonId: this.recordId
            });
        } else {
            pageRef.state.defaultFieldValues = fields;
        }
        this[NavigationMixin.Navigate](pageRef);
    }
}
