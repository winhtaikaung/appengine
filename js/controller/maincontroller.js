
function maincontroller($scope,$cacheFactory) {
     
    $scope.maptypes = [{"map":"chart"},{"map":"Graph chart"},{"map":"Pie Chart"}];
    $scope.test="this is test";

    $scope.cache=$cacheFactory("cacheid");
   //Cache factory testing



    $scope.addnewmap=function(){
    		$scope.maptypes.push({"map":$scope.m_type});
    		console.log($scope.maptypes);
    		$scope.m_type='';
    	}
};