public with sharing class InsurancePolicies {

    @AuraEnabled(cacheable=false)
    public static Decimal getSummedGrossWrittenPremiumForServiceResource(ID accountID){
        return [SELECT  SUM(GrossWrittenPremium)
                FROM InsurancePolicy 
                WHERE Contact__c =: accountID
                ][0].expr0;
    }

    @AuraEnabled(cacheable=false)
    public static Decimal getTargetForServiceResource(ID accountID){
        return [SELECT id,Target__c
                FROM ServiceResource 
                WHERE ID =: accountID
                LIMIT 1
                ].Target__c;
    }

}