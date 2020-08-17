import { LightningElement, track } from "lwc";
import getTeamUsers from "@salesforce/apex/TeamManagement.getTeamUsers";
import getCurrentUser from "@salesforce/apex/TeamManagement.getCurrentUser";
import getUserNameFromId from "@salesforce/apex/TeamManagement.getUserNameFromId";
import getStartOfYear from "@salesforce/apex/TeamManagement.getStartOfYear";
import getEndOfYear from "@salesforce/apex/TeamManagement.getEndOfYear";
import getProducersForUser from "@salesforce/apex/TeamManagement.getProducersForUser";
import getSummedInsurancePoliciesForProducer from "@salesforce/apex/TeamManagement.getSummedInsurancePoliciesForProducer";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { updateRecord } from "lightning/uiRecordApi";
import { refreshApex } from "@salesforce/apex";

import ID_FIELD from "@salesforce/schema/User.Id";

const COLS = [
    {
        label: "Vollständiger Name",
        fieldName: "linkName",
        type: "url",
        typeAttributes: { label: { fieldName: "Name" } }
    },
    {
        label: "Jährliches Ziel",
        fieldName: "Yearly_goal__c",
        type: "currency",
        editable: true
    }
];

export default class TeamManagement extends LightningElement {
    @track team;
    @track from;
    @track to;
    @track currentUser;
    @track summed;
    @track gotTeamMember;
    @track busy;
    @track editUser;
    @track draftValues = [];
    @track error;
    @track columns = COLS;

    constructor() {
        super();
        this.summed = [];
    }
    handleFromChanged(event) {
        this.from = event.detail.value;
        this.fetchData();
    }

    handleTileClicked(event) {
        console.log(event);
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
        this.team.forEach(function (record) {
            record.linkName = "/" + record.Id;
        });
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
        console.log(event.detail);
        await this.template
            .querySelector("lightning-record-edit-form")
            .submit(fields);

        this.currentUser = await getCurrentUser();
        this.team = await getTeamUsers();
        await this.fetchData();

        const evt = new ShowToastEvent({
            title: "Ziele aktualisiert",
            message: "Ziel für *User* erfolgreich angepasst",
            variant: "success",
            duration: 5000
        });

        this.dispatchEvent(evt);
    }
    async handleSave(event) {
        const fields = {};
        fields[ID_FIELD.fieldApiName] = event.detail.draftValues[0].Id;
        fields.Yearly_goal__c = event.detail.draftValues[0].Yearly_goal__c;

        const recordInput = { fields };
        const name = await getUserNameFromId({ accountID: fields.Id });

        try {
            await updateRecord(recordInput);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: "Zielaktualisierung erfolgreich!",
                    message: "Ziele für Benutzer " + name + " aktualisiert.",
                    variant: "success",
                    duration: 5000
                })
            );
            this.draftValues = [];
        } catch (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: "Zielaktualisierung nicht erfolgreich!",
                    message: error.body.message,
                    variant: "error",
                    duration: 5000
                })
            );
        }
        refreshApex(this.user);
        this.currentUser = await getCurrentUser();
        this.team = await getTeamUsers();
        this.team.forEach(function (record) {
            record.linkName = "/" + record.Id;
        });
        return this.fetchData();
    }
    handleMultipleSave(event) {
        const recordInputs = event.detail.draftValues.slice().map((draft) => {
            const fields = Object.assign({}, draft);
            return { fields };
        });

        const promises = recordInputs.map(function (recordInput) {
            return updateRecord(recordInput);
        });
        Promise.all(promises)
            .then(async (users) => {
                const names = users.map(function (user) {
                    return getUserNameFromId({
                        accountID: user.id
                    });
                });
                Promise.all(names).then(async (payload) => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: "Ziele erfolgreich aktualisiert",
                            message:
                                "Ziele für " +
                                payload.join(", ") +
                                " angepasst.",
                            variant: "success"
                        })
                    );
                });

                // Clear all draft values
                this.draftValues = [];

                // Display fresh data in the datatable
                refreshApex(this.user);
                this.currentUser = await getCurrentUser();
                this.team = await getTeamUsers();
                this.team.forEach(function (record) {
                    record.linkName = "/" + record.Id;
                });
                return this.fetchData();
            })
            .catch((error) => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: "Zielaktualisierung nicht erfolgreich!",
                        message: error.body.message,
                        variant: "error",
                        duration: 5000
                    })
                );
            });
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
            });

            this.busy = false;
            this.gotTeamMember = this.team.length > 0;
        } catch (err) {
            console.error("error fetching ...", err);
        }
    }
}
