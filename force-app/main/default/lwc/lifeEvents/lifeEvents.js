import { LightningElement, api } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import formFactorName from "@salesforce/client/formFactor";
import getContactIdForAccount from "@salesforce/apex/LifeEvents.getContactIdForAccount";

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
    contactId;
    events;
    constructor() {
        super();
        this.contactId = "";
        this.events = allLifeEvents;
        console.log("form 5", formFactorName);
    }
    connectedCallback() {
        this.fetchContact();
    }

    fetchContact() {
        getContactIdForAccount({ accountID: this.recordId })
            .then((id) => {
                this.contactId = id;
            })
            .catch(console.error);
    }
    // crate new Personal Life event
    handleSelection(event) {
        const eventData = event.detail;
        let pageRef = {
            type: "standard__objectPage",
            attributes: {
                objectApiName: "PersonLifeEvent",
                actionName: "new"
            },
            state: {
                defaultFieldValues: {}
            }
        };
        const fields = {
            Name: `${eventData.description} Event`,
            EventType: eventData.type,
            PrimaryPersonId: this.contactId
        };
        try {
            if (formFactorName === "Large") {
                pageRef.state.defaultFieldValues = encodeDefaultFieldValues(
                    fields
                );
            } else {
                pageRef.state.defaultFieldValues = fields;
            }
            this[NavigationMixin.Navigate](pageRef);
        } catch (e) {
            console.error("Navigation", e);
        }
    }
}
