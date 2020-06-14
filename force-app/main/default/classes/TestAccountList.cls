public with sharing class TestAccountList {

	@AuraEnabled(cacheable=false)
	public static List<Account> getAccountList() {
		return [
			SELECT Id, Name, phone, rating, RecordType.name 
			FROM Account WHERE Name LIKE 'A%' 
			ORDER BY rating ASC NULLS LAST
		];
	}
}
