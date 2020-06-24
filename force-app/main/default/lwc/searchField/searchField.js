import { LightningElement } from "lwc";

export default class SearchField extends LightningElement {
    initialized = false;

    renderedCallback() {
        if (this.initialized) {
            return;
        }
        this.initialized = true;
        let listId = this.template.querySelector("datalist").id;
        this.template.querySelector("input").setAttribute("list", listId);
    }
}
