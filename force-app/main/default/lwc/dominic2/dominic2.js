import { LightningElement, api } from "lwc";

import { NavigationMixin } from "lightning/navigation";

export default class Dominic2 extends NavigationMixin(LightningElement) {
    @api janein = false;
    @api text = "Wie gehts?";
    @api title = "Default";
    @api body = "Ich bin ein Body Text";

    handleClick(event) {
        console.log(event);
        event.preventDefault();
        event.stopPropagation();
        this[NavigationMixin.Navigate]({
            type: "standard__objectPage",
            attributes: {
                objectApiName: "Test_Objekt__c",
                actionName: "home"
            }
        });
    }
}
