import { LightningElement } from 'lwc';

export default class Charlotte1 extends LightningElement {

    name = "Timon"
    blaa

    handleClick(){
        console.log("orangensaft");
        
    }

    get blaa(){
        return "blaa";
    }

    set blaa(value){
        this.blaa = value;
    }


}