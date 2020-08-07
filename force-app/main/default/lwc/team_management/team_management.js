import { LightningElement, api, track } from "lwc";
import getTeamUsers from "@salesforce/apex/TeamManagement.getTeamUsers";
import getCurrentUser from "@salesforce/apex/TeamManagement.getCurrentUser";
import getStartOfYear from "@salesforce/apex/TeamManagement.getStartOfYear";
import getEndOfYear from "@salesforce/apex/TeamManagement.getEndOfYear";
import getProducersForUser from "@salesforce/apex/TeamManagement.getProducersForUser";
import getSummedInsurancePoliciesForProducer from "@salesforce/apex/TeamManagement.getSummedInsurancePoliciesForProducer";

export default class TeamManagement extends LightningElement {
    
    @track team;
    @track from;
    @track to;
    @track currentUser;
    @track summed;
    @track gotTeamMember;
    @track busy;

    constructor() {
        super();
        this.summed = [];
    }
    handleFromChanged(event) {
        this.from = event.detail.value;
        this.fetchData();
    }
    handleToChanged(event) {
        this.to = event.detail.value;
        this.fetchData();
    }
    async connectedCallback() {
        this.from = await getStartOfYear();
        this.to = await getEndOfYear();
        this.currentUser = await getCurrentUser();
        this.team = await getTeamUsers();
        await this.fetchData();
    }

    returnSummed(id) {
        return this.summed[id];
    }

    async asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    }
    async handleSubmit(event) {
        event.preventDefault(); // stop the form from submitting
        const fields = event.detail.fields;
        await this.template
            .querySelector("lightning-record-edit-form")
            .submit(fields);


            await this.fetchData();
            this.currentUser = await getCurrentUser();
            this.team = await getTeamUsers();
            await this.fetchData();
    }
    async fetchData() {
        try {
            this.busy = true;
            const that = this;
            await this.asyncForEach(this.team, async function (t) {
                t.summed = 0;
                const producers = await getProducersForUser({
                    accountID: t.Id
                });
                await that.asyncForEach(producers, async function (p) {
                    const sum = await getSummedInsurancePoliciesForProducer({
                        accountID: p.Id,
                        to: that.to,
                        from: that.from
                    });
                    if (sum && !isNaN(sum.expr0))
                        t.summed = parseFloat(t.summed) + parseFloat(sum.expr0);
                });
                t.percentageNormalized = t.summed / t.Yearly_goal__c;
                t.percentage = t.percentageNormalized * 100;
                console.log(t)
            });
       
            this.busy = false;
            this.gotTeamMember = this.team.length > 0;
        } catch (err) {
            console.error("error fetching ...", err);
        }
    }
}
