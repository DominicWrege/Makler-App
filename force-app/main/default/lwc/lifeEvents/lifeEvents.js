import { LightningElement, api, wire } from "lwc";
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
    poll;
    interval;
    accountLifeEvents;
    constructor() {
        super();
        this.interval = 3500;
        this.poll = false;
        this.contactId = "";
        this.templates = [];
        this.accountLifeEvents = [];
    }
    async connectedCallback() {
        this.fetchAllData();
    }
    async fetchAllData() {
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
            this.accountLifeEvents = aEvents.slice();
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
        this.pollEverySec(this.interval);
        const fields = {
            Name: "Neues Event",
            PrimaryPersonId: this.contactId
        };
        this.showNewLifeEventPage(fields, "new");
    }

    pollEverySec(sec) {
        if (!this.poll) {
            setInterval(async () => {
                console.log("tick");
                await this.fetchAllData();
            }, sec);
            this.poll = true;
        }
    }

    // crate new Personal Life event
    handleSelection(event) {
        this.pollEverySec(this.interval);
        const eventData = event.detail;
        const fields = {
            Name: eventData.name,
            EventType: eventData.type,
            PrimaryPersonId: this.contactId,
            EventDate: new Date().toISOString()
        };
        this.showNewLifeEventPage(fields, "new");
    }
    showNewLifeEventPage(fields, actionName) {
        let pageRef = {
            type: "standard__objectPage",
            attributes: {
                objectApiName: "PersonLifeEvent",
                actionName: actionName
            },
            state: {
                nooverride: 1,
                useRecordTypeCheck: 1,
                defaultFieldValues: {}
            }
        };
        try {
            if (fields) {
                if (formFactorName === "Large") {
                    pageRef.state.defaultFieldValues = encodeDefaultFieldValues(
                        fields
                    );
                } else {
                    pageRef.state.defaultFieldValues = fields;
                }
                this[NavigationMixin.Navigate](pageRef);
            }
        } catch (e) {
            console.error("Error while Navigation", e);
        }
    }
    handleShowEvent(event) {
        try {
            let pageRef = {
                type: "standard__recordPage",
                attributes: {
                    objectApiName: "PersonLifeEvent",
                    actionName: "view",
                    recordId: event.detail.eventId
                }
            };
            this[NavigationMixin.Navigate](pageRef);
        } catch (err) {
            console.error("Error while show Life Event ", err);
        }
    }
}
