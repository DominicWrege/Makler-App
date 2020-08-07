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

    // @isTest (SeeAllData=true) static void testGetServiceResource(){
    //     ID id = ID.valueOf('0Hn5I000000CoiFSAS');
    //     ServiceResource serv = InsurancePolicies.getServiceResource(id);
    //     System.assertEquals('0Hn5I000000CoiFSAS', serv.id);
    //     System.assertEquals(true, serv.target__c >= 10);
    // }



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

    @isTest (SeeAllData=true) static void testGetTodayEvents(){

        User user = [SELECT Id, name FROM User WHERE id = '0055I000001B4fPQAS'];

        System.runAs(user) {
            Test.startTest();
            Event e = new Event();
            e.Subject = 'Test Test Event';
            e.OwnerId='0055I000001B4fPQAS';
            e.StartDateTime=datetime.now();
            e.EndDateTime=datetime.now();
            Test.stopTest();
        }     

    }    

    // Events



    // Events
}
