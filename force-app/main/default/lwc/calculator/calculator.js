import { LightningElement, track, wire } from "lwc";
import { fireEvent } from "c/pubsub";
import { CurrentPageReference } from "lightning/navigation";
import { loadScript } from "lightning/platformResourceLoader";
import Chartjs from "@salesforce/resourceUrl/Chartjs";

class Expenses {
    static _id = 1;
    constructor(label, value) {
        this.label = label;
        this.value = value;
        Expenses._id = Expenses._id + 1;
        this.key = Expenses._id;
    }
}

export default class Calculator extends LightningElement {
    @wire(CurrentPageReference)
    pageRef;
    income = 0;
    rendered = false;
    legendSuffix = 97;
    @track expensesElements = [new Expenses("Miete/Haus", 0)];
    @track verfuegbar = 0;
    chart = null;
    initChart() {
        try {
            Chart.defaults.global.defaultFontSize = 14;
            const crtx = this.template.querySelector("canvas.chart");
            const miete = this.expensesElements[0];
            if (window.innerWidth > 500) {
                crtx.height = 180;
            } else {
                crtx.height = 280;
            }
            this.chart = new Chart(
                crtx,
                Calculator.configureBar([
                    this.newDataset(
                        miete.value,
                        miete.key,
                        miete.label,
                        "coral"
                    ),
                    this.newDataset(0, -1, "Nettoeinkommen", "#5679C0")
                ])
            );
        } catch (e) {
            //console.log(e);
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
            console.log(err);
        }
    }
    clearInput(e) {
        if (e.target.value == "0") {
            e.target.value = null;
        }
    }
    incomeChanged(e) {
        if (e.target.value !== "" && e.target.value != NaN) {
            this.income = parseInt(e.target.value, 10);
        } else {
            this.income = 0;
        }
        fireEvent(this.pageRef, "incomeChanged", this.income);
        this.calcValues();
    }
    addNewExpenseField() {
        const input = this.template.querySelector(
            "lightning-input.add-new-expense"
        );
        if (input.value && input.value > 0) {
            const number = parseInt(input.value, 10);
            const label = `Ausgabe ${String.fromCharCode(this.legendSuffix)}`;
            input.value = 0;

            this.verfuegbar = this.verfuegbar - number;
            if (this.verfuegbar > 0) {
                this.updateIncommingBar(this.verfuegbar);
            } else {
                this.updateIncommingBar(0);
            }
            const expense = new Expenses(label, number);
            this.expensesElements.push(expense);
            const data = this.newDataset(number, expense.key, label);
            this.legendSuffix += 1;
            if (this.legendSuffix > 122) {
                this.legendSuffix = 65;
            }
            this.chart.data.datasets.unshift(data);
            this.chart.update();
        }
    }
    newDataset(value, key, label, color) {
        let c = Calculator.getRandomColor();
        if (color) {
            c = color;
        }
        return {
            label: label,
            backgroundColor: [c],
            data: [value],
            key: key,
            maxBarThickness: 120
        };
    }

    updateExpenses(e) {
        if (e.target.value != "" && e.target.name) {
            const eventKey = e.target.name;
            const newNumber = parseInt(e.target.value, 10);
            for (let x of this.expensesElements) {
                if (x.key === eventKey) {
                    x.value = newNumber;
                    break;
                }
            }

            for (let i in this.chart.data.datasets) {
                if (this.chart.data.datasets[i].key === eventKey) {
                    this.chart.data.datasets[i].data[0] = newNumber;
                    break;
                }
            }
        }
        this.calcValues();
    }
    calcValues() {
        let sumExpenses = 0;
        for (let item of this.expensesElements) {
            try {
                sumExpenses += parseInt(item.value, 10);
            } catch (eee) {}
        }
        this.verfuegbar = this.income - sumExpenses;
        if (this.verfuegbar > 0) {
            this.updateIncommingBar(this.verfuegbar);
        } else {
            this.updateIncommingBar(0);
        }
        this.chart.update();
    }
    updateIncommingBar(value) {
        const end = this.chart.data.datasets.length - 1;
        this.chart.data.datasets[end].data[0] = value;
    }

    static configureBar(data) {
        if (!data) {
            data = {};
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
                    text: "Ausgaben"
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

    static getRandomColor() {
        let letters = "0123456789ABCDEF";
        let color = "#";
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
}
