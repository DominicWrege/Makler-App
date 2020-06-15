import { LightningElement, api } from 'lwc';

export default class TaskItem extends LightningElement {
    @api id
    @api subject; 
    @api status; 
    @api activityDate; 
    @api isClosed;

    handleCheckItem(e){
        e.preventDefault();      
        this.isClosed = !this.isClosed;
        const selectedEvent = new CustomEvent("checked", { 
            detail: {
                id: this.id.replace(/-12$/, ""),
                status: this.isClosed
            }
        });
        this.dispatchEvent(selectedEvent);
    }

    

}