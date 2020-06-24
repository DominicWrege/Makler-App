import { LightningElement, api, track, wire } from "lwc";
import ACCOUNT_NAME_FIELD from "@salesforce/schema/Account.Name";
import ACCOUNT_PHONE_FIELD from "@salesforce/schema/Account.Phone";

export default class Test_recordform extends LightningElement {
    @api selectedRecordId;

    handleValueSelcted(event) {
        console.log("id", event.detail.id);
        this.selectedRecordId = event.detail.id;
    }
}
