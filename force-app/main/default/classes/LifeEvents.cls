public with sharing class LifeEvents {

    @AuraEnabled
    public static ID getContactIdForAccount(ID accountID){
        return [SELECT id, accountid FROM contact WHERE accountid =: accountID LIMIT 1].id;
    }
}
