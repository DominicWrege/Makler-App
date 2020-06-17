import { LightningElement, api, track, wire } from "lwc";
import getTodayEvents from "@salesforce/apex/EventsToday.getTodayEvents";
import { NavigationMixin } from "lightning/navigation";

export default class CalenderTodayView extends NavigationMixin(
    LightningElement
) {
    @track allEvents;
    @api limit;

    constructor() {
        super();
        this.limit = 0;
        this.allEvents = [];
    }

    async connectedCallback() {
        try {
            let tmpEvents = [];
            for (let event of await getTodayEvents({ max: this.limit })) {
                tmpEvents.push({
                    LocaleStartDateTime: new Date(event.StartDateTime),
                    LocaleEndDateTime: new Date(event.EndDateTime),
                    ...event
                });
            }
            this.allEvents = tmpEvents;
        } catch (err) {
            console.error("getTodayEvents", err);
        }
    }
    navigateToHandler(e) {
        const rid = e.detail.Id;
        e.preventDefault();
        e.stopPropagation();
        try {
            this[NavigationMixin.Navigate]({
                type: "standard__recordPage",
                attributes: {
                    recordId: rid,
                    objectApiName: "Event",
                    actionName: "view"
                }
            });
        } catch (er) {
            console.error(er);
        }
    }
    get title() {
        return `Meine heutigen Termine (${this.allEvents.length})`;
    }
    get isEmpty() {
        return this.allEvents.length == 0;
    }

    //button
    handleButtonClick(event) {
        console.log(event);
        event.preventDefault();
        event.stopPropagation();
        this[NavigationMixin.Navigate]({
            type: "standard__objectPage",
            attributes: {
                objectApiName: "Event",
                actionName: "home"
            }
        });
    }
}
