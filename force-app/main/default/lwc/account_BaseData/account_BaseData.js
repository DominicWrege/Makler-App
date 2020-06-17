import { LightningElement, wire } from 'lwc';

import getBaseData from "@salesforce/apex/Account_BaseData.getBaseData"

export default class Account_BaseData extends LightningElement {
 
   
     constructor() {
        super(); 
    }
    
    @wire(getBaseData)
    getBaseData(dat){
        if(dat.data){
            this.accounts = dat.data; 
        } else if(dat.error){
            console.error(dat.error); 
        }

    }
 

}