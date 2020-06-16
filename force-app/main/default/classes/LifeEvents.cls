public with sharing class LifeEvents {

    @AuraEnabled
    public static ID getContactIdForAccount(ID accountID){
        return [SELECT id, accountid FROM contact WHERE accountid =: accountID LIMIT 1].id;
    }
    @AuraEnabled
    public static List<PersonLifeEventTemplate__c> getLifeEventsTemplates(){
        return [Select id, Name, Icon__c, Event_Type__c FROM PersonLifeEventTemplate__c];
    }

}
