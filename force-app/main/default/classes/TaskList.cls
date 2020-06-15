public with sharing class TaskList {

	@AuraEnabled(cacheable=true)
	public static List<Task> getTaskList() {
		return [
			SELECT Id, Subject, Status, ActivityDate, isClosed from Task 
		];
	}

	@AuraEnabled(cacheable=false)
	public static void UpdateTask(String rid, String status){
		// Update Status for Id rid.
		Id newId = Id.valueOf(rid);

		Task taskToUpdate = [ SELECT Status FROM Task 
							  WHERE Id =: newId  
							  LIMIT 1 ];
		
		taskToUpdate.status = status;
		// Make the update call.
		update taskToUpdate;
	}
}
