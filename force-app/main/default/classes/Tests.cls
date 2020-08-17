@isTest
public class Tests {
    
    // Seacher
    @isTest(SeeAllData=true) static void testAccountSearch() {
           
        List<Account> accounts = Searcher.searchForAccount('Timo');
        System.assertEquals('Timo Brechmann', accounts.get(0).name);
        System.assertEquals(1, accounts.size());
        System.assertEquals(true, Searcher.MAX_RESULT >= accounts.size());

    }

    @isTest(SeeAllData=true) static void testServiceSearch() {
           
        List<ServiceResource> services = Searcher.searchServiceResource('Verk');
        System.assertEquals('Verkäufer', services.get(0).name);
        System.assertEquals(1, services.size());
        System.assertEquals(true, Searcher.MAX_RESULT >= services.size());

    }
    // Seacher

    // LifeEvents

    @isTest(SeeAllData=true) static void TestGetContactIdForAccount() {
       ID id = LifeEvents.getContactIdForAccount('0015I000004EgUsQAK');
       System.assertEquals('0035I0000037zATQAY', id);
    }  

    @isTest (SeeAllData=true) static void testGetLifeEventsForContact() {
        List<PersonLifeEvent> events = LifeEvents.getLifeEventsForContact('0035I0000037zATQAY');
        System.assertEquals('Birth', events.get(0).eventType);
        System.assertEquals('Graduation', events.get(1).eventType);
        System.assertNotEquals('Test', events.get(3).eventType);
    }

    @isTest (SeeAllData=true) static void testGetLifeEventsTeamplates() {
        List<PersonLifeEventTemplate__c> templates = LifeEvents.getLifeEventsTemplates();
        System.assertEquals(true, 12 >= templates.size());
        System.assertEquals('Geburt', templates.get(0).name);
        System.assertEquals('Job', templates.get(2).name);
        System.assertEquals('Car', templates.get(5).name);
        System.assertEquals('Car', templates.get(5).Event_Type__C);

    } 
    // LifeEvents


    // InsurancePolicies

    @isTest (SeeAllData=true) static void testGetSummedInsurancePoliciesForProducer(){
        ID id = id.valueOf('0Yx5I000000PDw9SAG');
        AggregateResult sum = InsurancePolicies.getSummedInsurancePoliciesForProducer(id);
        System.assertNotEquals(sum.get('GrossWrittenPremium'), 4500);
    }
    @isTest (SeeAllData=true) static void testGetInsurancePoliciesForProducer(){
        ID id = id.valueOf('0Yx5I000000PDw9SAG');
        List<InsurancePolicy> insurances = InsurancePolicies.getInsurancePoliciesForProducer(id);
        System.assertEquals(true, insurances.size() > 0);
        InsurancePolicy insurance = insurances.get(0);
        System.assertEquals(8550, insurance.GrossWrittenPremium);
        System.assertEquals('Earthquake', insurance.policyType);
        System.assertEquals('SG-0211-550', insurance.Name);

    }

    @isTest (SeeAllData=true) static void testGetProducersForUser(){

        User user = [SELECT Id, name FROM User WHERE id = '0055I000001KUrxQAG'];

        System.runAs(user) {
            List<Producer> producers = InsurancePolicies.getProducersForUser();
            System.assertEquals(true, producers.size() > 0);
            Producer producer = producers.get(0);
            System.assertEquals(user.Name, producer.Name);
        } 
    
    }

    @isTest (SeeAllData=true) static void testGetCurrentUser(){
        User user = [SELECT Id, name FROM User WHERE id = '0055I000001KUrzQAG'];
        System.runAs(user) {
            User expUser = InsurancePolicies.getCurrentUser();
            System.assertEquals(70000, expUser.Yearly_goal__c);
            System.assertEquals(user.name, expUser.Name);
        } 
    }


    // InsurancePolicies


    // Tasks

    @isTest (SeeAllData=true) static void testGetTaskList(){
        User user = [SELECT Id, name FROM User WHERE id = '0055I000001B4fPQAS'];

        System.runAs(user) {
            List<Task> tasks = TaskList.getTaskList();
            System.assertEquals(true, tasks.size() >= 2);
            System.assertEquals(tasks.get(0).Subject, 'Kunde X Anrufen');
        }                   

    }     

    @isTest (SeeAllData=true) static void testupdateTask(){
        User user = [SELECT Id, name FROM User WHERE id = '0055I000001B4fPQAS'];

        System.runAs(user) {
            Test.startTest();
            ID id = Id.valueOf('00T5I000009AQdoUAG');
            TaskList.UpdateTask(id, 'Completed');
            Test.stopTest();
        }        
        
        Task testTask = [SELECT Status, isdeleted FROM Task WHERE Id =: '00T5I000009AQdoUAG' LIMIT 1 ];
        System.assertEquals('Completed', testTask.status);
        System.assertEquals(false, testTask.isdeleted);


    } 
    
    // Tasks

    // Events
    @isTest (SeeAllData=true) static void testGetTodayEvents(){
        String owner = '0055I000001B4fPQAS';
        User user = [SELECT Id, name FROM User WHERE id =: owner];
 
        System.runAs(user) {
            Test.startTest();
            Event event = new Event();
            event.Subject = 'Test Test Event 123457';
            event.OwnerId = owner;
            event.StartDateTime=datetime.now();
            event.EndDateTime=datetime.now();
            insert event;
            List<Event> testEvents = EventsToday.getTodayEvents(1);
            System.assertEquals(true, testEvents.size() == 1);
            System.assertEquals(testEvents.get(0).Subject, 'Test Test Event 123457');
            Test.stopTest();
        }     

        
    }    


    // Events
}
