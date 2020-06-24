import { LightningElement, track, api } from "lwc";
import searchForAccount from "@salesforce/apex/Searcher.searchForAccount";

export default class SearchField extends LightningElement {
    initialized = false;
    @track suggestions = [];
    @api label = "Search";

    renderedCallback() {
        if (this.initialized) {
            return;
        }
        this.initialized = true;
        let listId = this.template.querySelector("datalist").id;
        this.template.querySelector("input").setAttribute("list", listId);
    }

    handleSelection(event) {
        event.preventDefault();
        let selectedId = "";
        for (let i of this.template.querySelectorAll(".valueList > option")) {
            if (i.value === event.target.value) {
                selectedId = i.id;
                break;
            }
        }
        const selectedEvent = new CustomEvent("selected", {
            detail: {
                id: selectedId
            }
        });
        console.log(selectedEvent);
        this.dispatchEvent(selectedEvent);
    }
    handleInput(event) {
        const value = event.target.value;
        this.fetchSuggestionsWithDelay(value);
    }
    fetchSuggestionsWithDelay(term) {
        setTimeout(
            () =>
                searchForAccount({ term: term }).then((v) => {
                    this.suggestions = v;
                }),
            300
        );
    }
    debounce(funOnce, delay) {
        setTimeout(funOnce, delay);
    }
}
