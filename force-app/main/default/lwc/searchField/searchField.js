import { LightningElement, track, api } from "lwc";
import searchForAccount from "@salesforce/apex/Searcher.searchForAccount";
import searchServiceResource from "@salesforce/apex/Searcher.searchServiceResource";
const SEARCHTYPE_ACCOUNT = "Account";
const SEARCHTYPE_SERVICE = "Service";

export default class SearchField extends LightningElement {
    initialized = false;
    @track suggestions = [];
    @track showSuggestions = false;
    @api label = "Search";
    @api placholder = "";
    @api foundValue = "";
    @api itemIcon = "standard:account";
    @api foundId = "";
    @api required = false;
    @api field = SEARCHTYPE_ACCOUNT;

    handleInput(event) {
        this.showSuggestions = true;
        const value = event.target.value;
        this.fetchSuggestionsWithDelay(value);
    }
    async fetchSuggestionsWithDelay(term) {
        try {
            if (this.field === SEARCHTYPE_ACCOUNT) {
                this.suggestions = await searchForAccount({ term: term });
            } else if (this.field === SEARCHTYPE_SERVICE) {
                this.suggestions = await searchServiceResource({ term: term });
            }
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
        this.template.querySelector("input").value = this.foundValue;
        this.dispatchEvent(selectedEvent);
    }
    clearIinput() {
        this.template.querySelector("input").value = "";
        this.showSuggestions = false;
    }
}
