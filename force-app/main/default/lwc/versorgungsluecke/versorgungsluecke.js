import { LightningElement, wire, track } from "lwc";
import { registerListener, unregisterAllListeners } from "c/pubsub";
import { CurrentPageReference } from "lightning/navigation";
import { loadScript } from "lightning/platformResourceLoader";
import Chartjs from "@salesforce/resourceUrl/Chartjs";
import configureBar from "c/shared";
export default class Versorgungsluecke extends LightningElement {
    @wire(CurrentPageReference)
    pageRef;
    incoming = 0;
    @track rente = 0;
    @track wunschRente = 0;
    @track moreIncoming = 0;
    @track versorgungsluecke = 0;
    year = 1;
    @track possibleSaving = 0;
    @track versorgung = 0;

    initChart() {
        try {
            Chart.defaults.global.defaultFontSize = 14;
            const crtx = this.template
                .querySelector("canvas.chart-versorg")
                .getContext("2d");
            if (window.innerWidth > 500) {
                crtx.height = 180;
            } else {
                crtx.height = 280;
            }
            this.chart = new Chart(
                crtx,
                configureBar(
                    [
                        {
                            label: "Versorgungslücke",
                            backgroundColor: ["#5679C0"],
                            data: [0],
                            maxBarThickness: 120
                        },
                        {
                            label: "Wunsch Einkommen Rente",
                            backgroundColor: ["#ff0000e8"],
                            data: [0],
                            maxBarThickness: 120
                        },
                        {
                            label: "Weiteres Einkommen im Alter",
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
        this.chnageChartValue(1, this.wunschRente);
        this.calcVersoungsluecke();
    }

    moreIncomingChanged(e) {
        if (e.target.value !== "") {
            this.moreIncoming = parseInt(e.target.value, 10);
        } else {
            this.moreIncoming = 0;
        }
        this.chnageChartValue(2, this.wunschRente);
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
        if (this.versorgungsluecke < 0) {
            this.chnageChartValue(0, Math.abs(this.versorgungsluecke));
        } else {
            this.chnageChartValue(0, 0);
        }
        this.calcVersorgung();
        this.chart.update();
    }

    chnageChartValue(index, value) {
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
        this.calcVersoungsluecke();
    }
    handleChange(val) {
        this.incoming = val;
        this.caclRente();
        this.calcVersoungsluecke();
    }
    calcVersorgung() {
        const x =
            this.possibleSaving *
            1.0237 *
            (Math.pow(1.0237, this.year) - 1 / 0.0237);
        this.versorgung = this.versorgungsluecke - x;
        this.colorNumber(".versorgung", this.versorgung);
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
