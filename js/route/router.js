function router($routeProvider){
		$routeProvider.
		when('/route1',{
			templateUrl:'templates/route1.html',
			controller:maincontroller
		}).
		when('/mapgen',{
			templateUrl:'templates/mapgen.html',
			controller:mapgen_controller
		}).
        when('/model',{
            templateUrl:'templates/model_test.html'
            
        }).   
		when('/route2',{
			templateUrl:'templates/route2.html',
			controller:routetwocontroller
		}).        
		otherwise({
			redirectTo:''
		});

	


}
app.config(router);