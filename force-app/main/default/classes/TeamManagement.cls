public with sharing class TeamManagement {

    @AuraEnabled(cacheable=false)
    public static AggregateResult getSummedInsurancePoliciesForProducer(ID accountID, Date fromDate, Date toDate){
        return [SELECT  SUM(GrossWrittenPremium)
                FROM InsurancePolicy 
                WHERE (ProducerId =: accountID AND EffectiveDate >: fromDate AND EffectiveDate <: toDate AND Status =: 'Aktiv')
                ][0];
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
    public static List<Producer> getProducersForUser(ID accountID){
        return [SELECT Id, Name
                FROM Producer 
                WHERE InternalUserId =: accountID
                ];
    }

    @AuraEnabled(cacheable=false)
    public static List<User> getTeamUsers(){
        return [SELECT Id, Name, Yearly_goal__c, MediumPhotoUrl
                FROM User 
                WHERE ManagerId =: UserInfo.getUserId()
                ];
    }

    @AuraEnabled(cacheable=false)
    public static User getCurrentUser(){
        return [SELECT Id, Name, MediumPhotoUrl
                FROM User 
                WHERE id =: UserInfo.getUserId()
                LIMIT 1
                ];
    }

    @AuraEnabled(cacheable=false)
    public static String getUserNameFromId(ID accountID){
        return [SELECT Name
                FROM User 
                WHERE Id =: accountID
                LIMIT 1
                ].Name;
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