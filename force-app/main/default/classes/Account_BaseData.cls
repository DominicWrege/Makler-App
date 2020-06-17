public with sharing class EventsToday {
      @AuraEnabled(cacheable=false)
      public static List<Event> getBaseData(Integer max) {
              return [
                  SELECT Id, Name, Phone, FinServ__MailingAddress__pc,PersonEmail, PersonLastCURequestDate 
                  From Account where recordtype.name = 'Household'
                  Limit :max
              Limit :max
              ];
        }
  }
  