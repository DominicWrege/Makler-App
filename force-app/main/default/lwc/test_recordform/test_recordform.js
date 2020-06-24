import { LightningElement, api, track, wire } from "lwc";

export default class Test_recordform extends LightningElement {
    @api selectedRecordId;

    handleValueSelcted(event) {
        this.selectedRecordId = event.detail.id;
    }
}
