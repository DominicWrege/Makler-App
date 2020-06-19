public with sharing class TaskList {

	@AuraEnabled(cacheable=false)
	public static List<Task> getTaskList() {
		return [
			SELECT Id, Subject, Status, ActivityDate, isClosed 
			FROM Task 
			WHERE OwnerId =: UserInfo.getUserID() And isClosed = FALSE
		];
	}

	@AuraEnabled(cacheable=false)
	public static void UpdateTask(ID rid, String status){
		// Update Status for Id rid.
		Task taskToUpdate = [ SELECT Status FROM Task 
							  WHERE Id =: rid  
							  LIMIT 1 ];
		
		taskToUpdate.status = status;
		// Make the update call.
		update taskToUpdate;
	}
}
