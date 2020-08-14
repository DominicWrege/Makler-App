import { LightningElement, api, track, wire } from "lwc";

export default class Kundenbriefing extends LightningElement {
    @api selectedRecordId;

    handleValueSelcted(event) {
        this.selectedRecordId = event.detail.id;
    }
}
