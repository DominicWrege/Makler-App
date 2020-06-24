import { LightningElement, api, track, wire } from 'lwc';
import ACCOUNT_NAME_FIELD from '@salesforce/schema/Account.Name';
import ACCOUNT_PHONE_FIELD from '@salesforce/schema/Account.Phone';
import { getRecord } from 'lightning/uiRecordApi';

// hier ---
const FIELDS = [
    ACCOUNT_NAME_FIELD,
    ACCOUNT_PHONE_FIELD
];


export default class Test_recordform extends LightningElement {
   /*  @api selectedRecordId = "0015I000004EgUsQAK"; //store the record id of the selected  */

   @wire(getRecord, { selectedRecordId: '$recordId', fields: FIELDS })
   getAccount(d){
       if(d.data){
           console.log("account");
           console.log(d.data);
       }
       if (d.error){
        console.log(d.error)
       }
   }
    @api selectedRecordId; 

    handleValueSelcted(event) {
        this.selectedRecordId = event.detail[0]; // so ja 
        console.log(event.detail[0]); 
    }  //sag mal kann das jetzt raus? was sagt console.log?
}