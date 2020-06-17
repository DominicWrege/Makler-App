public with sharing class LifeEvents {

    @AuraEnabled
    public static ID getContactIdForAccount(ID accountID){
        return [SELECT id, accountid FROM contact WHERE accountid =: accountID LIMIT 1].id;
    }
    @AuraEnabled(cacheable=true)
    public static List<PersonLifeEventTemplate__c> getLifeEventsTemplates(){
        return [Select id, Name, Icon__c, Event_Type__c FROM PersonLifeEventTemplate__c];
    }
    @AuraEnabled(cacheable=false)
    public static List<PersonLifeEvent> getLifeEventsForContact(ID contactID){
        System.debug('iddd', contactID);
        return [SELECT id, Name, eventtype, primaryPersonId, eventdate 
                FROM PersonLifeEvent 
                WHERE PrimaryPersonId =: contactID
                ORDER BY eventdate ];
    }

}
