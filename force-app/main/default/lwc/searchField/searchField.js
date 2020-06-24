import { LightningElement, track, api } from "lwc";
import searchForAccount from "@salesforce/apex/Searcher.searchForAccount";

export default class SearchField extends LightningElement {
    initialized = false;
    @track suggestions = [];
    @api label = "Search";
    @api placholder = "";
    @api foundValue = "";
    @api foundId = "";
    @api required = false;
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
                selectedId = i.id.replace(/-[0-9]{0,4}$/, "");
                break;
            }
        }
        const selectedEvent = new CustomEvent("selected", {
            detail: {
                id: selectedId
            }
        });
        this.foundId = selectedId;
        this.foundValue = event.target.value;
        this.dispatchEvent(selectedEvent);
    }
    handleInput(event) {
        const value = event.target.value;
        this.fetchSuggestionsWithDelay(value);
    }
    fetchSuggestionsWithDelay(term) {
        setTimeout(
            () =>
                searchForAccount({ term: term })
                    .then((v) => {
                        this.suggestions = v;
                    })
                    .catch(console.log),
            300
        );
    }
    debounce(funOnce, delay) {
        setTimeout(funOnce, delay);
    }
}
