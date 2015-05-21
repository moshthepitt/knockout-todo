// what's a task? class declaration
function todoTask(task){
	var self = this;
	self.task = task;
	self.completion = ko.observable(false);	

	//task completion toggle
	self.completeTask = function(){
		if(self.completion() == false){
			self.completion(true);
		}
		else{
			self.completion(false);
		}
	};
}

function taskViewModel(){
	var self = this;

	self.tasks = ko.observableArray([
		new todoTask("Pickup Milk"),
		new todoTask("Call Bank")
	]);	

	// Input Data 
	self.newTask = ko.observable('');

	//Let's add some data
	self.addTask = function() {
        self.tasks.push(new todoTask(self.newTask()));
        self.newTask('');
    }

    //remove task
	self.removeTask = function() {
		self.tasks.remove(this);
	}

	self.markAllDone = function() {
		var i = 0;
		for (i; i < self.tasks().length; i++){
			self.tasks()[i].completion(true) 
		}
	}

	//COMPLETED TASKS
	self.completedTasksNumber = ko.computed(function(){
		var total = 0;
		var i = 0;
		for (i; i < self.tasks().length; i++){
			if(self.tasks()[i].completion() == false){
				total++;	
			}
		}
		return total;
	});

	// different views
	self.views = ['All', 'Active', 'Completed'];
	self.chosenViewId = ko.observable();

    self.chosenViewData = ko.computed(function () {
        if (self.chosenViewId() == "All") {
        	return self.tasks();
        } else if (self.chosenViewId() == "Active") {
        	return ko.utils.arrayFilter(self.tasks(), function (task) {
        	    return task.completion() == false;
        	});
        } else if (self.chosenViewId() == "Completed") {
        	return ko.utils.arrayFilter(self.tasks(), function (task) {
        	    return task.completion() == true;
        	});
        } 
    });

	self.goToView = function(view) {
		location.hash = view; 
	}

	// Client-side routes    
    Sammy(function() {
        this.get('#:view', function() {
            self.chosenViewId(this.params.view);
        });
        
        this.get('', function() { this.app.runRoute('get', '#All') });
    }).run();
}

ko.applyBindings(new taskViewModel());