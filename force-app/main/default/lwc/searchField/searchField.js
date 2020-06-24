import { LightningElement, track, api } from "lwc";
import searchForAccount from "@salesforce/apex/Searcher.searchForAccount";

export default class SearchField extends LightningElement {
    initialized = false;
    @track suggestions = [];
    @track showSuggestions = false;
    @api label = "Search";
    @api placholder = "";
    @api foundValue = "";
    @api foundId = "";
    @api required = false;

    handleInput(event) {
        this.showSuggestions = true;
        const value = event.target.value;
        this.fetchSuggestionsWithDelay(value);
    }
    async fetchSuggestionsWithDelay(term) {
        try {
            this.suggestions = await searchForAccount({ term: term });
            this.loading = false;
        } catch (err) {
            console.error(err);
        }
    }
    debounce(funOnce, delay) {
        setTimeout(funOnce, delay);
    }
    handleItemClick(event) {
        event.preventDefault();
        this.showSuggestions = false;
        this.foundId = event.target.id.replace(/-[0-9]{0,4}$/, "");
        this.foundValue = event.target.textContent;
        const selectedEvent = new CustomEvent("selected", {
            detail: {
                id: this.foundId
            }
        });
        this.template.querySelector("lightning-input").value = this.foundValue;
        this.dispatchEvent(selectedEvent);
    }
    clearIinput() {
        this.template.querySelector("lightning-input").value = "";
        this.showSuggestions = false;
    }
}
