import { LightningElement, wire, track, api } from "lwc";
import getAccountList from "@salesforce/apex/TestAccountList.getAccountList";

export default class Dominic3 extends LightningElement {
    progress = 0;
    inc = 3;
    columns = [
        { label: "Account Name", fieldName: "Name" },
        { label: "Phone Number", fieldName: "Phone", type: "phone" },
        { label: "Rating", fieldName: "Rating", type: "rating" },
        {
            label: "RecordType Name",
            fieldName: "RecordTypeName"
        }
    ];
    //@wire(getAccountList)
    @track accounts = [];

    fixDataforTable(data) {
        const newfixedAccounst = [];
        for (let item of data) {
            console.log(item);
            const newdata = {
                Id: item["Id"],
                Name: item["Name"],
                Phone: item["Phone"],
                Rating: item["Rating"],
                RecordTypeName: item["RecordType"]["Name"]
            };
            newfixedAccounst.push(newdata);
        }
        this.accounts = newfixedAccounst;
    }
    connectedCallback() {
        getAccountList().then((data) => this.fixDataforTable(data));
        setInterval(this.updateProgress.bind(this), 500);
    }
    updateProgress() {
        if (this.progress >= 100) {
            this.progress = 0;
            this.inc = 3;
        } else {
            this.progress += this.inc;
            this.inc += 1;
        }
    }
}
