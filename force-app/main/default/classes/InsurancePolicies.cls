public with sharing class InsurancePolicies {

    @AuraEnabled(cacheable=false)
    public static AggregateResult  getSummedInsurancePoliciesForProducer(ID accountID){
        return [SELECT  SUM(GrossWrittenPremium)
                FROM InsurancePolicy 
                WHERE ProducerId =: accountID
                ][0];
    }

    @AuraEnabled(cacheable=false)
    public static List<InsurancePolicy>  getInsurancePoliciesForProducer(ID accountID){
        return [SELECT  GrossWrittenPremium, Name, PolicyType
                FROM InsurancePolicy 
                WHERE ProducerId =: accountID
                ];
    }

    @AuraEnabled(cacheable=false)
    public static List<Producer> getProducersForUser(){
        return [SELECT Id, Name
                FROM Producer 
                WHERE InternalUserId =: UserInfo.getUserId()
                ];
    }

    @AuraEnabled(cacheable=false)
    public static User getCurrentUser(){
        return [SELECT Id, Name, Yearly_goal__c, MediumPhotoUrl
                FROM User 
                WHERE id =: UserInfo.getUserId()
                LIMIT 1
                ];
    }

    @AuraEnabled(cacheable=false)
    public static Date getStartOfYear(){
        return date.newInstance(2020,1,1);
    }

    @AuraEnabled(cacheable=false)
    public static Date getEndOfYear(){
        return date.newInstance(2020,12,31);
    }

}