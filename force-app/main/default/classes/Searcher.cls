public with sharing class Searcher {
    @AuraEnabled
    public static List<Account> searchForAccount(String term){
        String wilcard = '%' + term + '%';
        return [SELECT id, name From Account WHERE name LIKE :wilcard AND isPersonAccount = TRUE LIMIT 8];
    }
    
    @AuraEnabled
    public static List<ServiceResource> searchServiceResource(String term){
        String wilcard = '%' + term + '%';
        return [SELECT id, name From ServiceResource WHERE name LIKE :wilcard];
    }
}
