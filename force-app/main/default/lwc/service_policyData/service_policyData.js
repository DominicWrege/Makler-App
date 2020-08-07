import { LightningElement, api, track } from "lwc";
import getSummedInsurancePoliciesForProducer from "@salesforce/apex/InsurancePolicies.getSummedInsurancePoliciesForProducer";
import getProducersForUser from "@salesforce/apex/InsurancePolicies.getProducersForUser";
import getInsurancePoliciesForProducer from "@salesforce/apex/InsurancePolicies.getInsurancePoliciesForProducer";
import getCurrentUser from "@salesforce/apex/InsurancePolicies.getCurrentUser";
import getStartOfYear from "@salesforce/apex/InsurancePolicies.getStartOfYear";
import getEndOfYear from "@salesforce/apex/InsurancePolicies.getEndOfYear";

export default class ServiceResource_policyData extends LightningElement {
    @api recordId; // genau die setzt sales force für dich gibt auch noch recordName
    @api selectedRecordId;

    @track  summedPremiumAmounts;
    @track  target;
    @track  percent;
    @track  currentUser;
    constructor() {
        super();
        this.summedPremiumAmounts = 0;
        this.target = 10000;
        this.percent = 50;
        this.summed = 0;
        this.percentNormalized = 50;
        this.insurancePolicies = [];
        this.columns = [
            { label: "Interner Bezeichner", fieldName: "Name" },
            { label: "Policentyp", fieldName: "PolicyType" },
            {
                label: "Gebuchte Bruttoprämie",
                fieldName: "GrossWrittenPremium",
                type: "currency"
            }
        ];
    }

    async asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    }

    async connectedCallback() {
        await this.fetchData();
    }

    async fetchData() {
        try {
            this.busy = true;
            const that = this;
            this.currentUser = await getCurrentUser();
            this.from = await getStartOfYear();
            this.end = await getEndOfYear();
            this.target = parseFloat(this.currentUser.Yearly_goal__c);
            const producers = await getProducersForUser();
            this.title = "Meine Zielerreichung";

            await this.asyncForEach(producers, async function (p) {
                const sum = await getSummedInsurancePoliciesForProducer({
                    accountID: p.Id
                });
                const policies = await getInsurancePoliciesForProducer({
                    accountID: p.Id
                });
                that.insurancePolicies = that.insurancePolicies.concat(
                    policies
                );

                if (sum && !isNaN(sum.expr0))
                    that.summed =
                        parseFloat(that.summed) + parseFloat(sum.expr0);
            });
            this.percentNormalized = this.summed / this.target;
            this.percent = this.percentNormalized * 100;

            console.log(
                this.insurancePolicies,
                this.percentNormalized,
                this.percent
            );
            this.busy = false;
        } catch (err) {
            console.error("error fetching ...", err);
        }
    }
}
