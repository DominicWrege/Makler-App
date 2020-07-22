import { LightningElement, wire, track } from "lwc";
import { registerListener, unregisterAllListeners } from "c/pubsub";
import { CurrentPageReference } from "lightning/navigation";

export default class Versorgungsluecke extends LightningElement {
    @wire(CurrentPageReference)
    pageRef;
    incoming = 0;
    @track rente = 0;
    @track wunschRente = 0;
    @track moreIncoming = 0;
    @track difference = 0;
    year = 1;
    @track possibleSaving = 0;
    @track outNumber = 0;
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
        this.calcOut();
    }
    yearChanged(e) {
        this.year = parseInt(e.target.value, 10);
        this.calcOut();
    }
    wunschRenteChanged(e) {
        if (e.target.value !== "") {
            this.wunschRente = parseInt(e.target.value, 10);
        } else {
            this.wunschRente = 0;
        }
        this.calcDifference();
    }

    moreIncomingChanged(e) {
        if (e.target.value !== "") {
            this.moreIncoming = parseInt(e.target.value, 10);
        } else {
            this.moreIncoming = 0;
        }
        this.calcDifference();
    }
    clearInput(e) {
        if (e.target.value == "0") {
            e.target.value = null;
        }
    }
    calcDifference() {
        this.difference = -this.moreIncoming - this.rente - this.wunschRente;
        this.calcOut();
    }
    caclRente() {
        this.rente = this.incoming * 0.3781;
        this.calcDifference();
    }
    handleChange(val) {
        this.incoming = val;
        this.caclRente();
        this.calcDifference();
    }
    calcOut() {
        const v1 = 1.0237;
        const v2 = 0.0237;
        this.outNumber =
            this.difference +
            (this.possibleSaving + v1 * (Math.pow(v1, this.year - 1) / v2));

        const outNumberElement = this.template.querySelector(".out-number");

        if (this.outNumber >= 0) {
            outNumberElement.style.color = "green";
        } else {
            outNumberElement.style.color = "red";
        }
    }
}
