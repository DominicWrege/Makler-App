public with sharing class Searcher {
    @AuraEnabled
    public static List<Account> searchForAccount(String term){
        String wilcard = '%' + term + '%';
        return [SELECT id, name From Account WHERE name LIKE :wilcard];
    }
}
