import { LightningElement, api } from "lwc";
import getTodayEvents from "@salesforce/apex/EventsToday.getTodayEvents";
import { NavigationMixin } from "lightning/navigation";

export default class CalenderTodayView extends NavigationMixin(
    LightningElement
) {
    @api allEvents = [];
    @api limit;

    async connectedCallback() {
        let tmpEvents = [];
        for (let event of await getTodayEvents({ max: this.limit })) {
            tmpEvents.push({
                LocaleStartDateTime: new Date(
                    event.StartDateTime
                ).toLocaleString(),
                LocaleEndDateTime: new Date(event.EndDateTime).toLocaleString(),
                ...event
            });
        }
        this.allEvents = tmpEvents;
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
    @api
    get title() {
        let lmt = 0;
        if (!this.isEmpty) {
            lmt = this.limit;
        }
        return `Meine heutigen Termine (${lmt})`;
    }
    @api
    get isEmpty() {
        return this.allEvents.length == 0;
    }
}
