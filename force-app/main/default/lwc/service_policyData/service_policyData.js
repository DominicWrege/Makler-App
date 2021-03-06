import { LightningElement, api, track } from "lwc";
import getSummedInsurancePoliciesForProducer from "@salesforce/apex/InsurancePolicies.getSummedInsurancePoliciesForProducer";
import getProducersForUser from "@salesforce/apex/InsurancePolicies.getProducersForUser";
import getInsurancePoliciesForProducer from "@salesforce/apex/InsurancePolicies.getInsurancePoliciesForProducer";
import getCurrentUser from "@salesforce/apex/InsurancePolicies.getCurrentUser";
import getStartOfYear from "@salesforce/apex/InsurancePolicies.getStartOfYear";
import getEndOfYear from "@salesforce/apex/InsurancePolicies.getEndOfYear";
import { loadScript } from "lightning/platformResourceLoader";
import Chartjs from "@salesforce/resourceUrl/Chartjs";
export default class ServiceResource_policyData extends LightningElement {
    @api recordId;
    @api selectedRecordId;

    @track summedPremiumAmounts;
    @track target;
    @track percent;
    @track currentUser;
    constructor() {
        super();
        this.summedPremiumAmounts = 0;
        this.target = 10000;
        this.percent = 50;
        this.summed = 0;
        this.percentNormalized = 50;
        this.insurancePolicies = [];
        this.columns = [
            {
                label: "Interner Bezeichner",
                fieldName: "linkName",
                type: "url",
                typeAttributes: { label: { fieldName: "Name" } }
            },
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

    initChart() {
        try {
            let canvas = this.template.querySelector("canvas.chart-policyData");

            if (window.innerWidth > 500) {
                canvas.height = 100;
            } else {
                canvas.height = 220;
            }
            this.chart = new Chart(canvas, {
                type: "pie",
                data: {
                    labels: ["Erreicht", "Noch zu erreichen"],
                    datasets: [
                        {
                            label: "Population (millions)",
                            backgroundColor: ["#49D603", "#ff0000e8"],
                            data: [this.summed, this.target - this.summed]
                        }
                    ]
                },
                options: {
                    legend: { display: true },
                    title: {
                        display: true,
                        text:
                            "Erreichung des Jahresziels von " +
                            this.target +
                            "€"
                    }
                }
            });
            //console.log("aa", this.chart);
        } catch (e) {
            // console.log("e", e);
        }
    }

    async connectedCallback() {
        await this.fetchData();
    }

    handleRowSelection(event) {
        console.log(event);
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
            this.title = "Ziel " + this.currentUser.Name;

            await this.asyncForEach(producers, async function (p) {
                const res = await getSummedInsurancePoliciesForProducer({
                    accountID: p.Id
                });
                const sum = res.GrossWrittenPremium;
                const policies = await getInsurancePoliciesForProducer({
                    accountID: p.Id
                });
                that.insurancePolicies = that.insurancePolicies.concat(
                    policies
                );

                if (sum && !isNaN(sum)) {
                    that.summed = parseFloat(that.summed) + parseFloat(sum);
                } else {
                    this.summed = 0;
                }
            });
            this.percentNormalized = this.summed / this.target;
            this.percent = this.percentNormalized * 100;
            that.insurancePolicies.forEach(function (record) {
                record.linkName = "/" + record.Id;
            });

            this.busy = false;

            try {
                if (!window.Chart) {
                    await loadScript(this, Chartjs);
                }
                if (!this.rendered) {
                    this.initChart();
                    this.initChart();
                    this.rendered = true;
                }
            } catch (err) {
                //console.log(err);
            }
        } catch (err) {
            console.error("error fetching ...", err);
        }
    }
}
