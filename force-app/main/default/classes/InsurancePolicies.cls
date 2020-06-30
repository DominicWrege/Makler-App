public with sharing class InsurancePolicies {

    @AuraEnabled(cacheable=false)
    public static AggregateResult  getSummedGrossWrittenPremiumForServiceResource(ID accountID){
        return [SELECT  SUM(GrossWrittenPremium)
                FROM InsurancePolicy 
                WHERE Contact__c =: accountID
                ][0];
    }

    @AuraEnabled(cacheable=false)
    public static ServiceResource getServiceResource(ID accountID){
        return [SELECT id,target__c,teams__c
                FROM ServiceResource 
                WHERE id =: accountID
                LIMIT 1
                ];
    }
    @AuraEnabled(cacheable=false)
    public static Team__c getTeam(ID accountID){
        return [SELECT id, name
                FROM Team__c 
                WHERE id =: accountID
                LIMIT 1
                ];
    }

    @AuraEnabled(cacheable=false)
    public static AggregateResult  getSummedGoalsForTeam(ID accountID){
        return [SELECT  SUM(target__c)
                FROM ServiceResource 
                WHERE teams__c =: accountID
                ][0];
    }

    @AuraEnabled(cacheable=false)
    public static List<ServiceResource> getTeamMembers(ID accountID){
        return [SELECT id, RelatedRecord.id, RelatedRecord.FirstName, RelatedRecord.LastName, target__c, ( SELECT Id FROM Contacts )
                FROM ServiceResource 
                WHERE teams__c =: accountID
                ];
    }

}