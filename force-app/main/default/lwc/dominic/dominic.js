import { LightningElement, api } from "lwc";

// https://developer.salesforce.com/docs/component-library/bundle/lightning-record-form/documentation

import TEXTFIELD from "@salesforce/schema/Test_Objekt__c.Text1__c";
import NAMEFIELD from "@salesforce/schema/Test_Objekt__c.Name";
import WEBSITEFIELD from "@salesforce/schema/Test_Objekt__c.website_test__c";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class Dominic extends LightningElement {
    @api recordId; // magic
    @api objectApiName; // magic
    @api prop1;
    fields = [NAMEFIELD, TEXTFIELD, WEBSITEFIELD];
    text = "Ich bin ein Custom Component";

    connectedCallback() {
        console.log(WEBSITEFIELD);
    }
    changeHandler(event) {
        this.text = event.target.value;
    }
    showToast(e, d) {
        console.log("toast?");
        const event = new ShowToastEvent({
            title: "Objekt Created!",
            message: "Very nice =)",
            variant: "success"
        });
        this.dispatchEvent(event);
    }
}
