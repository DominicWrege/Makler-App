import { LightningElement, wire, api } from "lwc";
import getTodayEvents from "@salesforce/apex/EventsToday.getTodayEvents";

export default class CalenderTodayView extends LightningElement {
    @api allEvents = [];

    async connectedCallback() {
        let tmpEvents = [];
        for (let event of await getTodayEvents()) {
            console.log(new Date(event.StartDateTime).toLocaleString());
            tmpEvents.push({
                LocaleStartDateTime: new Date(
                    event.StartDateTime
                ).toLocaleString(),
                LocaleEndDateTime: new Date(event.EndDateTime).toLocaleString(),
                ...event
            });
        }
        this.allEvents = tmpEvents;
        console.log(this.allEvents);
    }
}
