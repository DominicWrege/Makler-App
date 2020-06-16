import { LightningElement, api } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import formFactorName from "@salesforce/client/formFactor";
import getContactIdForAccount from "@salesforce/apex/LifeEvents.getContactIdForAccount";
import getLifeEventsTemplates from "@salesforce/apex/LifeEvents.getLifeEventsTemplates";

import { encodeDefaultFieldValues } from "lightning/pageReferenceUtils";

// class LifeEvent {
//     constructor(description, type, icon) {
//         this.description = description;
//         this.type = type;
//         this.icon = icon;
//  }
export default class LifeEvents extends NavigationMixin(LightningElement) {
    @api recordId;
    contactId;
    events;

    constructor() {
        super();
        this.contactId = "";
        this.events = [];
        console.log("form 15", formFactorName);
    }
    connectedCallback() {
        this.fetchFeventTemplates();
        this.fetchContact();
    }

    fetchFeventTemplates() {
        getLifeEventsTemplates()
            .then((x) => (this.events = x))
            .catch(console.log);
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
            Name: `${eventData.Name} Event`,
            EventType: eventData.Event_Type__c,
            PrimaryPersonId: this.contactId,
            EventDate: new Date().toISOString()
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
