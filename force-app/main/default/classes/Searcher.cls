public with sharing class Searcher  {
    public static final Integer MAX_RESULT = 8;
    
    @AuraEnabled
    public static List<Account> searchForAccount(String term){
        String wildcard = '%' + term + '%';
        return [SELECT id, name From Account WHERE name LIKE :wildcard AND isPersonAccount = TRUE LIMIT :MAX_RESULT];
    }

    
    @AuraEnabled
    public static List<ServiceResource> searchServiceResource(String term){
        String wildcard = '%' + term + '%';
        return [SELECT id, name From ServiceResource WHERE name LIKE :wildcard LIMIT :MAX_RESULT];
    }
}
