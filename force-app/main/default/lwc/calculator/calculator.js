import { LightningElement, track, wire } from "lwc";
import { fireEvent } from "c/pubsub";
import { CurrentPageReference } from "lightning/navigation";
import { loadScript } from "lightning/platformResourceLoader";
import Chartjs from "@salesforce/resourceUrl/Chartjs";

class Expenses {
    constructor(label, value, key) {
        this.label = label;
        this.value = value;
        if (key) {
            this.key = key;
        } else {
            this.key = Expenses.genKey();
        }
    }
    static genKey() {
        return Math.floor(Math.random() * 100000 + 5, 2);
    }
}

export default class Calculator extends LightningElement {
    @wire(CurrentPageReference)
    pageRef;
    income = 0;
    rendered = false;
    @track expensesElements = [new Expenses("Miete/Haus", 0, 1)];
    @track verfuegbar = 0;
    chart = null;
    initChart() {
        try {
            Chart.defaults.global.defaultFontSize = 14;
            const crtx = this.template.querySelector("canvas.chart");

            if (window.innerWidth > 500) {
                crtx.height = 180;
            } else {
                crtx.height = 280;
            }
            this.chart = new Chart(crtx, Calculator.getBar());
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
            const expense = new Expenses("Weitere Ausgaben", input.value);
            this.expensesElements.push(expense);
            input.value = 0;

            this.verfuegbar = this.verfuegbar - number;
            if (this.verfuegbar > 0) {
                this.updateIncommingBar(this.verfuegbar);
            } else {
                this.updateIncommingBar(0);
            }

            this.unshiftDataSet(number, expense.key, "Ausgabe");
            this.chart.update();
        }
    }

    unshiftDataSet(value, key, label) {
        this.chart.data.datasets.unshift({
            label: label,
            backgroundColor: [Calculator.getRandomColor()],
            data: [value],
            key: key,
            maxBarThickness: 120
        });
    }

    updateExpenses(e) {
        if (e && e.target.value != "" && e.target.name) {
            const eventKey = e.target.name;
            const newNumber = parseInt(e.target.value, 10);
            for (let x of this.expensesElements) {
                if (x.key == eventKey) {
                    x.value = newNumber;
                    break;
                }
            }

            for (let i in this.chart.data.datasets) {
                if (this.chart.data.datasets[i].key == eventKey) {
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
        console.log("ss", this.verfuegbar);
        this.chart.update();
    }
    updateIncommingBar(value) {
        const end = this.chart.data.datasets.length - 1;
        this.chart.data.datasets[end].data[0] = value;
    }

    static getBar() {
        return {
            type: "bar",
            data: {
                labels: [""],
                datasets: [
                    {
                        key: 1,
                        label: "Miete/Haus",
                        maxBarThickness: 120,
                        backgroundColor: ["coral"],
                        data: [0]
                    },
                    {
                        key: -11,
                        label: "Nettoeinkommen",
                        maxBarThickness: 120,
                        backgroundColor: ["#5679C0"],
                        data: [0]
                    }
                ]
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
