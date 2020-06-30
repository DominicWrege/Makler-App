import { LightningElement, api } from "lwc";
import getSummedGrossWrittenPremiumForServiceResource from "@salesforce/apex/InsurancePolicies.getSummedGrossWrittenPremiumForServiceResource";
import getServiceResource from "@salesforce/apex/InsurancePolicies.getServiceResource";

export default class ServiceResource_policyData extends LightningElement {
    @api recordId; // genau die setzt sales force für dich gibt auch noch recordName
    summedPremiumAmounts;
    target;
    percent;
    constructor() {
        super();

        this.summedPremiumAmounts = 0;
        this.target = 10000;
        this.percent = 50;
        this.percentNormalized = 50;
    }
    async connectedCallback() {
        try {
            const serviceResource = await getServiceResource({
                accountID: this.recordId
            });

            const summed = await getSummedGrossWrittenPremiumForServiceResource(
                {
                    accountID: this.recordId
                }
            );

            console.log('SUMMED', summed)

            this.summedPremiumAmounts = summed.expr0;
            this.target = serviceResource.target__c
            console.log('TARGET', serviceResource.target__c)
            this.percent = this.summedPremiumAmounts / this.target;
            this.percentNormalized = this.percent * 100;
            console.log(
                "WICHTIGE INFORMATIONEN",
                summed,
                this.target
            );
        } catch (err) {
            console.error("error fetching ...", err);
        }
    }
}
