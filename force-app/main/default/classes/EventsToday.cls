public with sharing class EventsToday {
    @AuraEnabled(cacheable=false)
    public static List<Event> getTodayEvents(Integer max) {
		return [
            Select Id, ActivityDate, StartDateTime, EndDateTime, subject, Location, CreatedById 
            FROM event 
            WHERE ActivityDate = TODAY AND OwnerId =: UserInfo.getUserID()
            Limit :max
		];
	}
}
