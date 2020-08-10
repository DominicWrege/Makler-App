import { LightningElement, wire, track } from "lwc";
import { registerListener, unregisterAllListeners } from "c/pubsub";
import { CurrentPageReference } from "lightning/navigation";
import { loadScript } from "lightning/platformResourceLoader";
import Chartjs from "@salesforce/resourceUrl/Chartjs";
import configureBar from "c/shared";

const WUNSCH_RENTE_INDEX = 2;
const RENTE_INDEX = 0;
const MORE_INCOMING_INDEX = 1;
const VERSORGUNSLUECKE_INDEX = 3;

export default class Versorgungsluecke extends LightningElement {
    @wire(CurrentPageReference)
    pageRef;
    incoming = 0;
    @track rente = 0;
    wunschRente = 0;
    moreIncoming = 0;
    @track versorgungsluecke = 0;
    year = 1;
    possibleSaving = 0;
    @track versorgung = 0;

    initChart() {
        try {
            let canvas = this.template.querySelector("canvas.chart-versorg");

            if (window.innerWidth > 500) {
                canvas.height = 180;
            } else {
                canvas.height = 325;
            }
            this.chart = new Chart(
                canvas,
                configureBar(
                    [
                        {
                            label: "Rente",
                            backgroundColor: ["#49d603"],
                            data: [0],
                            maxBarThickness: 120
                        },
                        {
                            label: "Weiteres Einkommen im Alter",
                            backgroundColor: ["#ffce56"],
                            data: [0],
                            maxBarThickness: 120
                        },
                        {
                            label: "Wunsch Einkommen Rente",
                            backgroundColor: ["#5679C0"],
                            data: [0],
                            maxBarThickness: 120
                        },
                        {
                            label: "Versorgungslücke",
                            backgroundColor: ["#ff0000e8"],
                            data: [0],
                            maxBarThickness: 120
                        }
                    ],
                    "Versorgung"
                )
            );
            //console.log("aa", this.chart);
        } catch (e) {
            // console.log("e", e);
        }
    }
    async renderedCallback() {
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
    }

    connectedCallback() {
        registerListener("incomeChanged", this.handleChange, this);
    }
    disconnectedCallback() {
        unregisterAllListeners(this);
    }
    possibleSavingChanged(e) {
        if (e.target.value !== "") {
            this.possibleSaving = parseInt(e.target.value, 10);
        } else {
            this.possibleSaving = 0;
        }
        this.calcVersorgung();
    }
    yearChanged(e) {
        this.year = parseInt(e.target.value, 10);
        this.calcVersorgung();
    }
    wunschRenteChanged(e) {
        if (e.target.value !== "") {
            this.wunschRente = parseInt(e.target.value, 10);
        } else {
            this.wunschRente = 0;
        }
        this.changeChartValue(WUNSCH_RENTE_INDEX, this.wunschRente);
        this.calcVersoungsluecke();
    }

    moreIncomingChanged(e) {
        if (e.target.value !== "") {
            this.moreIncoming = parseInt(e.target.value, 10);
        } else {
            this.moreIncoming = 0;
        }
        this.changeChartValue(MORE_INCOMING_INDEX, this.moreIncoming);

        this.calcVersoungsluecke();
    }
    clearInput(e) {
        if (e.target.value == "0") {
            e.target.value = null;
        }
    }
    calcVersoungsluecke() {
        this.versorgungsluecke =
            this.wunschRente - this.moreIncoming - this.rente;
        //wr Wunschrente Chart
        const wr =
            this.wunschRente -
            (this.rente + this.moreIncoming + Math.abs(this.versorgungsluecke));
        this.changeChartValue(WUNSCH_RENTE_INDEX, Math.abs(wr));
        console.log(wr);
        this.changeChartValue(
            VERSORGUNSLUECKE_INDEX,
            Math.abs(this.versorgungsluecke)
        );

        this.calcVersorgung();
        this.chart.update();
    }

    changeChartValue(index, value) {
        if (value > 0) {
            this.chart.data.datasets[index].data[0] = value;
        } else {
            this.chart.data.datasets[index].data[0] = 0;
        }
    }

    colorNumber(selector, value) {
        const element = this.template.querySelector(selector);
        if (value > 0) {
            element.style = "green";
        } else if (value < 0) {
            element.style = "red";
        } else {
            element.style = "black";
        }
    }

    caclRente() {
        this.rente = this.incoming * 0.3781;
        this.changeChartValue(RENTE_INDEX, this.rente);
        this.calcVersoungsluecke();
    }
    handleChange(val) {
        this.incoming = val;
        this.caclRente();
        this.calcVersoungsluecke();
    }
    calcVersorgung() {
        const x = Math.pow(1.0019, this.year * 12 - 1);
        const k = (this.possibleSaving * 1.0019 * x) / 0.0019;
        this.versorgung = k / 12 / 25;
    }
    configureBar(data, titel) {
        if (!data) {
            data = {};
        }
        if (!titel) {
            titel = "";
        }
        return {
            type: "bar",
            data: {
                labels: [""],
                datasets: [...data]
            },
            options: {
                tooltips: false,
                title: {
                    display: false,
                    text: titel
                },
                responsive: true,
                scales: {
                    xAxes: [
                        {
                            stacked: true,
                            ticks: {
                                beginAtZero: true
                            }
                        }
                    ],
                    yAxes: [
                        {
                            ticks: {
                                display: false,
                                min: 0
                            },
                            stacked: true
                        }
                    ]
                }
            }
        };
    }
}
