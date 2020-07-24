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
    @track versorgungsluecke = 0;
    year = 1;
    @track possibleSaving = 0;
    @track versorgung = 0;
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
        this.calcVersoungsluecke();
    }

    moreIncomingChanged(e) {
        if (e.target.value !== "") {
            this.moreIncoming = parseInt(e.target.value, 10);
        } else {
            this.moreIncoming = 0;
        }
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
        this.calcVersorgung();
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
}
