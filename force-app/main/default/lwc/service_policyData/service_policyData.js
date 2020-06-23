import { LightningElement, api } from "lwc";
import getSummedGrossWrittenPremiumForServiceResource from "@salesforce/apex/InsurancePolicies.getSummedGrossWrittenPremiumForServiceResource";
import getTargetForServiceResource from "@salesforce/apex/InsurancePolicies.getTargetForServiceResource";

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
            const summed = await getSummedGrossWrittenPremiumForServiceResource(
                {
                    accountID: this.recordId
                }
            );

            this.summedPremiumAmounts = summed[0].expr0;
            this.target = await getTargetForServiceResource({
                accountID: this.recordId
            });
            this.percent = this.summedPremiumAmounts / this.target;
            this.percentNormalized = this.percent * 100;
        } catch (err) {
            console.error("error fetching ...", err);
        }
    }
}
