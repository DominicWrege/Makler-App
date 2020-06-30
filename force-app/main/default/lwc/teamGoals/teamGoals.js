import { LightningElement, api } from "lwc";
import getServiceResource from "@salesforce/apex/InsurancePolicies.getServiceResource";
import getTeam from "@salesforce/apex/InsurancePolicies.getTeam";
import getTeamMembers from "@salesforce/apex/InsurancePolicies.getTeamMembers";
import getSummedGoalsForTeam from "@salesforce/apex/InsurancePolicies.getSummedGoalsForTeam";

export default class TeamGoals extends LightningElement {
    @api recordId; // genau die setzt sales force für dich gibt auch noch recordName
    summedPremiumAmounts;
    goal;
    percent;
    cardTitle;
    rowOffset = 0;
    team;
    //data;
    //columns;
    constructor() {
        super();
        this.team = null;
        this.team_name = "";
        this.cardTitle = "";
        this.data = [];
        this.summedPremiumAmounts = 0;
        this.goal = 10000;
        this.percent = 50;
        this.percentNormalized = 50;
        this.columns = [
            { label: "Vorname", fieldName: "RelatedRecord.FirstName" },
            { label: "Nachname", fieldName: "RelatedRecord.FirstName" },
            { label: "Ziel", fieldName: "target__c", type: "currency", editable: true }
        ];
    }
    async connectedCallback() {
        try {
            const serviceResource = await getServiceResource({
                accountID: this.recordId
            });
            this.team = await getTeam({
                accountID: serviceResource.teams__c
            });

            

            const summed = await getSummedGoalsForTeam({
                accountID: this.team.Id
            });
            console.log('TEAM ID' , this.team.id)

            console.log('TEAM SUMMED' , summed)
            this.goal = summed.expr0;

            this.cardTitle = "Zielerreichung für " + this.team.Name;
            this.data = await getTeamMembers({
                accountID: serviceResource.teams__c
            });
            console.log('Members', this.data)
            this.percent = this.summedPremiumAmounts / this.summed;
            this.percentNormalized = this.percent * 100;
        } catch (err) {
            console.error("error fetching ...", err);
        }
    }
}
