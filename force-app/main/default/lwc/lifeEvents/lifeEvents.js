import { LightningElement, api, track } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import formFactorName from "@salesforce/client/formFactor";
import getContactIdForAccount from "@salesforce/apex/LifeEvents.getContactIdForAccount";
import getLifeEventsTemplates from "@salesforce/apex/LifeEvents.getLifeEventsTemplates";
import getLifeEventsForContact from "@salesforce/apex/LifeEvents.getLifeEventsForContact";

import { encodeDefaultFieldValues } from "lightning/pageReferenceUtils";

export default class LifeEvents extends NavigationMixin(LightningElement) {
    @api recordId;
    contactId;
    templates;
    accountLifeEvents;
    constructor() {
        super();
        this.contactId = "";
        this.templates = [];
        this.accountLifeEvents = [];
    }
    async connectedCallback() {
        try {
            this.contactId = await getContactIdForAccount({
                accountID: this.recordId
            });
            const tmpTemplates = await getLifeEventsTemplates();
            const icons = this.mapIconsToEventType(tmpTemplates);
            const aEvents = await getLifeEventsForContact({
                contactID: this.contactId
            });
            this.setIconForLifeEvents(icons, aEvents);
            this.accountLifeEvents = aEvents;
            this.templates = this.filterActiveEvents(
                tmpTemplates,
                this.accountLifeEvents
            );
        } catch (err) {
            console.error("error fetching ...", err);
        }
    }

    setIconForLifeEvents(icons, accountLifeEvents) {
        for (let e of accountLifeEvents) {
            e.Icon = icons.get(e.EventType);
        }
    }
    filterActiveEvents(templateEvents, accountLifeEvents) {
        const newTemplates = [];
        for (let te of templateEvents) {
            const found = accountLifeEvents.find((item) => {
                return item.EventType === te.Event_Type__c;
            });
            if (!found) {
                newTemplates.push(te);
            }
        }
        return newTemplates;
    }

    mapIconsToEventType(templates) {
        let iconsMap = new Map();
        if (templates) {
            for (let e of templates) {
                iconsMap.set(e.Event_Type__c, e.Icon__c);
            }
        }
        return iconsMap;
    }

    handleNewEvent(event) {
        event.preventDefault();
        event.stopPropagation();
        const fields = {
            Name: "Neues Event",
            PrimaryPersonId: this.contactId
        };
        this.showNewLifeEventPage(fields);
    }

    // crate new Personal Life event
    handleSelection(event) {
        const eventData = event.detail;
        const fields = {
            Name: `${eventData.name} Event`,
            EventType: eventData.type,
            PrimaryPersonId: this.contactId,
            EventDate: new Date().toISOString()
        };
        this.showNewLifeEventPage(fields);
    }

    showNewLifeEventPage(fields) {
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
            console.error("Eroro while Navigation", e);
        }
    }
}
