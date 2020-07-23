import { LightningElement, track, wire } from "lwc";
import { loadScript } from "lightning/platformResourceLoader";
import Chartjs from "@salesforce/resourceUrl/Chartjs";
import { fireEvent } from "c/pubsub";
import { CurrentPageReference } from "lightning/navigation";

const CHART_CONFIG = {
    type: "pie",
    data: {
        datasets: [
            {
                data: [25, 100],
                backgroundColor: ["#ff6384", "#ffcd56"]
            }
        ],
        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: ["a", "b"],
        options: {}
    }
};

class Expenses {
    constructor(label, value) {
        this.label = label;
        this.value = value;
        this.key = Math.random() * Math.random() * 1000;
    }
}

export default class Calculator extends LightningElement {
    chart = null;
    @wire(CurrentPageReference)
    pageRef;
    income = 0;
    @track expensesElements = [new Expenses("Miete/Haus", 0)];
    @track outNumber = 0;

    // initChart() {
    //     try {
    //         // console.log(CHART_CONFIG);
    //         // CHART_CONFIG.data.datasets[0].data[0] = this.einkommen;
    //         // CHART_CONFIG.data.datasets[0].data[1] = this.ausgaben;
    //         // const crtx = this.template
    //         //     .querySelector("canvas.chart")
    //         //     .getContext("2d");
    //         // this.chart = new Chart(crtx, CHART_CONFIG);
    //         // console.log(this.chart);
    //     } catch (e) {
    //         console.log(e);
    //     }
    // }
    // async renderedCallback() {
    //     // await loadScript(this, Chartjs);
    //     // try {
    //     //     this.initChart();
    //     //     this.initChart();
    //     // } catch (err) {
    //     //     console.log(err);
    //     // }
    // }

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
        this.calc();
    }
    addNewExpenseField() {
        const input = this.template.querySelector(
            "lightning-input.add-new-expense"
        );
        if (input.value && input.value > 0) {
            this.expensesElements.push(
                new Expenses("Weitere Ausgaben", input.value)
            );
            input.value = 0;
        }
    }
    calc() {
        let sumExpenses = 0;
        for (const input of this.template.querySelectorAll(".expenses")) {
            if (input.value !== "") {
                sumExpenses += parseInt(input.value, 10);
            }
        }
        this.outNumber = this.income - sumExpenses;

        const outNumberElement = this.template.querySelector(".out-number");
        if (this.outNumber >= 0) {
            outNumberElement.style.color = "green";
        } else {
            outNumberElement.style.color = "red";
        }
    }
}
