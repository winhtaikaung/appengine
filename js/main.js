


var app=angular.module('Myapp',['ngRoute','ui.bootstrap','angularLocalStorage']);

//Service & Factory Methods
  app.service('String_helper', function () {
        
           return{
                 trim_str:function(str){
                    var s=str.substring(1,str.length-1);
                    
                   return s;
              
            },
                replace_char:function(str){
                   var s=str.replace(/\"/g,'"');
                   
                    return s;
            }

        };
    });

  app.factory('Ajax_helper',function($http){
    
    var Ajax_helper= {
          async:function(url){

            var promise=$http.get(url).then(function(response){
                
                return response.data;

            });

            return promise;
          }
    };
    return Ajax_helper;
  });
  
  app.factory('Img_converter',function(){
      
      var Img_converter={
            encode:function(url, callback, outputFormat){
                                                    var canvas = document.createElement('CANVAS'),
                            ctx = canvas.getContext('2d'),
                            img = new Image;
                        img.crossOrigin = 'Anonymous';
                        img.onload = function(){
                            var dataURL;
                            canvas.height = img.height;
                            canvas.width = img.width;
                            ctx.drawImage(img, 0, 0);
                            dataURL = canvas.toDataURL(outputFormat);
                            callback.call(this, dataURL);
                            canvas = null; 
                        };
                        img.src = url;
                
            }
      };
      return Img_converter;
  });
  
  
  


  app.factory('File_Helper',function(){
      
      var File_Helper={
            read:function(evt){
                
                var f = evt.target.files[0]; 

                if (f) {
                var r = new FileReader();
                r.onload = function(e) { 
                        var contents = e.target.result;
                  alert( "Got the file.n" 
                        +"name: " + f.name + "n"
                        +"type: " + f.type + "n"
                        +"size: " + f.size + " bytesn"
                        + "starts with: " + contents.substr(1, contents.indexOf("n"))
                  );  
                }
                r.readAsText(f);
              } else { 
                alert("Failed to load file");
              }
                
                
            }
      };
      
  });

 //Service Regin Completed "|"|"|"|"|"|"|"|"" 


  

//Router

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

//Router Completed







//service Base64 DECODE ENCODE




















function maincontroller($scope,$cacheFactory) {
     
    $scope.maptypes = [{"map":"chart"},{"map":"Graph chart"},{"map":"Pie Chart"}];
    $scope.test="this is test";

    $scope.cache=$cacheFactory("cacheid");
    //Cache Factory



    $scope.addnewmap=function(){
    		$scope.maptypes.push({"map":$scope.m_type});
    		console.log($scope.maptypes);
    		$scope.m_type='';
    	}
};


var ModalDemoCtrl = function ($scope, $modal, $log) {

  $scope.items = ['item1', 'item2', 'item3'];

  $scope.open = function (size) {

    var modalInstance = $modal.open({
      templateUrl: 'templates/model_test.html',
      controller: ModalInstanceCtrl,
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
};

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

var ModalInstanceCtrl = function ($scope, $modalInstance, items) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};
     //calling two services
function mapgen_controller($scope,storage,String_helper,Ajax_helper,File_Helper,Img_converter){
    var page=new Object();
    var mapobj=new Object();
	   
      $scope.visible=false ;   


      //binding favourites & indicator from async service to localstorage
      var map_path=window.location.origin+"/api/maps.json?fields=id,name,access&_dc=1407394718013&start=0&sort=%5B%7B%22property%22%3A%22name%22%2C%22direction%22%3A%22ASC%22%7D%5D";

      Ajax_helper.async(map_path).then(function(d){
        
        storage.remove('fav_list');
      storage.bind($scope, 'fav_list',JSON.stringify(d));
      });
      
      

      var indicators_path=window.location.origin+"/api/indicators.json?fields=id,name,access&_dc=1407394718013&start=0&sort=%5B%7B%22property%22%3A%22name%22%2C%22direction%22%3A%22ASC%22%7D%5D";
      //grabbing indicator from REST
      Ajax_helper.async(indicators_path).then(function(d){
        
        storage.remove('indicators_List');
        storage.bind($scope,'indicators_List',JSON.stringify(d));
      });

      var tables_path=window.location.origin+"/api/reportTables.json?fields=id,name,access&_dc=1407394718013&start=0&sort=%5B%7B%22property%22%3A%22name%22%2C%22direction%22%3A%22ASC%22%7D%5D"

      Ajax_helper.async(tables_path).then(function(d){
      
        storage.remove('report_table_list');
        storage.bind($scope,'report_table_list',JSON.stringify(d));
      });
      
      
      var dashboard_path=window.location.origin+"/api/dashboards.json";
      
      Ajax_helper.async(dashboard_path).then(function(d){
          
          storage.remove('dashboard_list');
          storage.bind($scope,'dashboard_list',JSON.stringify(d));
      });
      //image converter testing
//       Img_converter.encode("http://localhost:8082/api/maps/Qf4QVXQ7irQ/data?width=405&height=294",function(base64Img){
//                console.log(base64Img);
//              });

      //finding indicator
   

      $scope.favourite=JSON.parse(storage.get('fav_list')).maps;

      $scope.indicators_list=JSON.parse(storage.get('indicators_List')).indicators;

      $scope.table_list=JSON.parse(storage.get('report_table_list')).reportTables;
      
     $scope.dashboards_list=JSON.parse(storage.get('dashboard_list')).dashboards;
     
     storage.remove('Web_page');
   
   $scope.temp_list=null;
     
     
     
                       
        $scope.select_val=true;
       $scope.get_favourite=function(item){
          //var selected_fav=$scope.selected_favourite;

                   console.log(item);
           //alert(JSON.stringify(selected_fav));
       } 

       $scope.get_selected_indicator=function(item){
            console.log(item);
       }

       $scope.get_selected_table=function(item){

            console.log(item);

       }
       
       
       //Making web page with JSON Object
       var web=new Array();      
       
       var page=new Array();
      
       var dashboard_item;
       
       
       $scope.get_selected_dashboard=function(item){
           storage.remove('selected_item');
           page=new Array();
           
           Ajax_helper.async(item.href+".json").then(function(d){
                    
                     //classifying dashboard elements  with their name 
                     
                     for(i=0;i<d.items.length;i++){
                                             
                         switch(d.items[i].type){
                                     
                                 
                                    case 'reportTable':
                                            
                                      // console.log(d.items[i].reportTable.href);
                                       Ajax_helper.async(d.items[i].reportTable.href+"/data.html").then(function(table_html){
                                          console.log();
                                          //console.log(d.items[i].reportTable.name);
                                           var dashboarditem=new Object();
                                           dashboarditem.table=table_html;
                                           dashboarditem.type="table";
                                           dashboarditem.name=d.name
                                           page.push(dashboarditem);
                                           
                                        storage.remove('selected_item');
                                        storage.bind($scope,'selected_item',JSON.stringify(page));                         
                                       
                                           
                                       });
                                       
                                        break;
                                    case 'chart':
                                         //console.log(d.items[i].chart);
                                         
                                         Img_converter.encode(d.items[i].chart.href+"/data?width=405&height=294",function(chartimg){
                                             //console.log(base64Img);
                                             var dashboarditem=new Object();
                                             dashboarditem.chart=chartimg;
                                              dashboarditem.type="chart";
                                              dashboarditem.name=d.name;
                                             page.push(dashboarditem);
                                             
                                             storage.remove('selected_item');
                                             storage.bind($scope,'selected_item',JSON.stringify(page));
                                             
                                             
                                         });
                                         
                                        break;
                                    case 'map':                                                                             
                                         
                                          Img_converter.encode(d.items[i].map.href+"/data?width=405&height=294",function(mapimg){
                                              var dashboarditem=new Object();
                                                dashboarditem.map=mapimg; 
                                                 dashboarditem.type="map";
                                                 dashboarditem.name=d.name;
                                                page.push(dashboarditem);
                                                
                                                storage.remove('selected_item');
                                                storage.bind($scope,'selected_item',JSON.stringify(page));
                                               
                                              
                                          });
                                         
                                        break;
                         }
                     }
           });
           
               
       }
       
       $scope.adddashboard=function(){
           
           var section=new Object();
           section.element= JSON.parse(storage.get('selected_item'));
           
           web.push(section);
           storage.remove('Web_page');
           storage.bind($scope,'Web_page',JSON.stringify(web));
           
           
       }
       
       $scope.make_alert=function(){
           File_Helper.read();
       }





    


        $scope.get_selection=function(){
        	//var msg=prompt("Please Fill the data parameter","");
            var mtype=$scope.maptype;

           mapobj.cnt_type=mtype;

           page.R1=mapobj;
            
            

           // $scope.visible=!$scope.visible;
        try{

                if(mtype.id===null){
                    $scope.visible=false;
                }else{
                    $scope.visible=true;
                }

            }catch(e){

        }
          

       
        
    };

    var site={
                    css:{
                        nav:"nav{position: fixed;width: 100%;background-color: #222B8F;height: 40px;color: white;}",
                        nav_a:"nav a{color: white;text-decoration: none;border-right: 1px solid white;display: inline-block;padding: 0.5em 1em;margin-top: 0.1em;}",
                        item:".item{border: 1px solid #ccc;width: 405px;height: 329px;padding: 6px;margin: 0 19px 19px 0;border-radius: 3px;cursor: pointer;box-shadow: #ddd 0 1px 2px 0;overflow: auto;}",
                        item_h3:"h3,h4{font-size: 12px;font-family: LiberationSansBold, sans-serif;color: #39547d;margin: 2px 5px;}",
                        li:"li{float: left;width: 400px;height: 325px;overflow: auto;margin: 1em 0.5em 0.5em 0.5em;border-radius: 10px;border: 1px solid gray;}",
                        listtable:".listTable {width: 100%;border-collapse: collapse;padding-top: 10px;cursor: pointer;}",
                        table:"th{font-family: LiberationSansBold, sans-serif;color: #39547d;margin: 2px 5px;}td{font-family: LiberationSansBold, sans-serif;margin: 2px 5px;}",
                        section:"section{display:inline-block;padding-top: 40px;}"                        
                    },
                    header:{
                        nav:""
                    }
                };

    $scope.save=function(){
        
        var web_page=JSON.parse(storage.get('Web_page'));
        console.log(web_page[0].element[0].name);
         angular.element("#G_json").append(document.createTextNode("<style>"));
         angular.element("#G_json").append(document.createTextNode(site.css.nav));
         angular.element("#G_json").append(document.createTextNode(site.css.nav_a));
         angular.element("#G_json").append(document.createTextNode(site.css.item));
         angular.element("#G_json").append(document.createTextNode(site.css.item_h3));
         angular.element("#G_json").append(document.createTextNode(site.css.li));
         angular.element("#G_json").append(document.createTextNode(site.css.listtable));
         angular.element("#G_json").append(document.createTextNode(site.css.table));
         angular.element("#G_json").append(document.createTextNode(site.css.section));
         
          angular.element("#G_json").append(document.createTextNode("</style>"));
       if(web_page.length>0){
           //Navigation bar
           angular.element("#G_json").append(document.createTextNode("<nav>"));
           for(i=0;i<web_page.length;i++){
               
               var loc= web_page[i].element[i].name;
           angular.element("#G_json").append(document.createTextNode("<a href=#"+loc+">"));
           angular.element("#G_json").append(document.createTextNode(loc));
           angular.element("#G_json").append(document.createTextNode("</a>"));  
               
               
               
           }
           angular.element("#G_json").append(document.createTextNode("</nav><br>"));
           
            for(outer_index=0;outer_index<web_page.length;outer_index++){
                
               angular.element("#G_json").append(document.createTextNode("<section id="+web_page[outer_index].element[outer_index].name+">\n\n"));   
               angular.element("#G_json").append(document.createTextNode("<br>")); 
               //binding 
                  angular.element("#G_json").append(document.createTextNode("<ul>")); 
                  
                    for(j=0;j<web_page[outer_index].element.length;j++){
                        angular.element("#G_json").append(document.createTextNode("<li class=liItem>"));  
                            
                            
                            
                            switch(web_page[outer_index].element[j].type){
                                case 'table':
                                     angular.element("#G_json").append(document.createTextNode(web_page[outer_index].element[j].table));
                                break;
                                case 'map':
                                     angular.element("#G_json").append(document.createTextNode("<img src='"+web_page[outer_index].element[j].map+"'/>"));
                                break;
                                case 'chart':
                                      angular.element("#G_json").append(document.createTextNode("<img src='"+web_page[outer_index].element[j].chart+"'/>"));
                                break;
                                
                                
                            }
                            
                            
                        angular.element("#G_json").append(document.createTextNode("</li>"));
                    }
                    
                  angular.element("#G_json").append(document.createTextNode("<ul>"));               
               //binding complete
               angular.element("#G_json").append(document.createTextNode("</section>"));
               
               
//               /angular.element("#G_json").append("<div id='G_json'/>","</section>");
                 
            }
       }else{
           alert("Invalid data");
       }
        
       
        
      
    };
    
    $scope.clear_db=function(){
          
        storage.remove('Web_page');
        
    }
}



    


    
 
 function routetwocontroller($scope) {
 
    $scope.indicators=[{"name":"NCIMCH"}];

    $scope.addnewindicators=function(){
    	$scope.indicators.push({"name":$scope.ind_name});
    	
    };


}



//var leaflet_lib={
//                    css:{
//                        legend_css:".item{border: 1px solid #ccc;width: 405px;height: 329px;padding: 6px;margin: 0 19px 19px 0;border-radius: 3px;cursor: pointer;box-shadow: #ddd 0 1px 2px 0;overflow: auto;}"                      
//                    },
//                    js:{
//                        mainjs:"\n\<script src=http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js\>\<\/script>"
//                    },
//                    geojson:{"bbox":[100.08727199999993,13.908281000000045,107.63454700000005,22.48590100000007],"type":"FeatureCollection","features":[{"type":"Feature","properties":{"ID_0":126,"ISO":"LAO","NAME_0":"Laos","ID_1":1605,"pv":"XKGgynPS1WZ","NAME_1":"Louang Namtha","VARNAME_1":"Haut-Mekong|Luangnamtha|Muong Luang Namtha|Namtha|Hiuakhong|Houa Kh","NL_NAME_1":"","HASC_1":"LA.LM","CC_1":"","TYPE_1":"Khoueng","ENGTYPE_1":"Province","VALIDFR_1":"~1976","VALIDTO_1":"Present","REMARKS_1":"formerly Houakhong","Shape_Leng":4.92214637022,"Shape_Area":0.850094196992},"geometry":{"type":"Polygon","coordinates":[[[101.78020500000014,21.141632999999956],[101.73089600000003,20.998707000000138],[101.52156100000013,20.85695800000002],[101.50308200000006,20.706598000000042],[101.57618699999995,20.58244300000007],[101.45594000000006,20.348467000000085],[101.22858399999996,20.308337999999992],[101.00072500000005,20.354692],[100.943604,20.499611000000073],[100.83274100000006,20.497387000000117],[100.81929799999995,20.603640000000155],[100.70722200000006,20.780109000000152],[100.60885600000012,20.83779100000004],[100.51583899999991,20.881281000000058],[100.550431,21.026081000000033],[100.6369630000001,21.064270000000022],[100.72710300000011,21.31212400000004],[100.84879300000006,21.30261100000007],[101.00538600000004,21.392231000000038],[101.19708300000002,21.416759000000013],[101.25984800000003,21.36416100000008],[101.29039799999998,21.178060000000016],[101.57991800000013,21.244950000000074],[101.78020500000014,21.141632999999956]]]}},{"type":"Feature","properties":{"ID_0":126,"ISO":"LAO","NAME_0":"Laos","ID_1":1606,"pv":"MBZYTqkEgwf","NAME_1":"Louangphrabang","VARNAME_1":"Loang Prabang|Louangphabang|Louang Prabang|Luang Phabang|Luangphrabang|Luang Prabang","NL_NAME_1":"","HASC_1":"LA.LP","CC_1":"","TYPE_1":"Khoueng","ENGTYPE_1":"Province","VALIDFR_1":"1904","VALIDTO_1":"Present","REMARKS_1":"","Shape_Leng":7.78958709258,"Shape_Area":1.7247921361},"geometry":{"type":"Polygon","coordinates":[[[102.94981500000011,21.142623000000015],[103.11315500000006,20.904663000000085],[103.38863100000009,20.78446700000012],[103.213524,20.697047999999995],[103.23441300000013,20.31020500000011],[103.10983299999998,20.16720000000015],[103.13821400000006,19.91510800000009],[102.95003500000001,19.817307000000028],[102.93700400000012,19.718851000000143],[102.65925600000003,19.500988000000007],[102.74219499999998,19.311945000000037],[102.57578999999998,19.224294999999984],[102.45962500000013,19.36814300000009],[102.17260000000005,19.408728000000053],[102.00051100000007,19.269688000000087],[101.96648399999998,19.16229600000014],[101.82009099999999,19.054892999999936],[101.82298300000002,19.285397000000103],[101.892448,19.42390800000004],[101.83018499999997,19.44859500000001],[101.75402799999995,19.64617200000015],[101.77716099999998,19.843218000000036],[101.71374500000007,19.91818600000005],[102.06636800000012,20.045496000000128],[102.20432300000004,20.162392000000068],[102.140083,20.37956600000001],[102.23570300000011,20.62983700000001],[102.33212300000014,20.657724000000087],[102.351158,20.875950000000046],[102.30948599999999,20.962559000000113],[102.51012400000008,20.86475400000006],[102.59948700000007,20.952844999999968],[102.78868900000003,21.029510000000073],[102.80352800000003,21.118574000000024],[102.94981500000011,21.142623000000015]]]}},{"type":"Feature","properties":{"ID_0":126,"ISO":"LAO","NAME_0":"Laos","ID_1":1607,"pv":"rO2RVJWHpCe","NAME_1":"Oudômxai","VARNAME_1":"Oudomsai|Oudomsay|Oudomxay|UdomXay","NL_NAME_1":"","HASC_1":"LA.OU","CC_1":"","TYPE_1":"Khoueng","ENGTYPE_1":"Province","VALIDFR_1":"~1976","VALIDTO_1":"Present","REMARKS_1":"split from Luangphrabang","Shape_Leng":5.75295959308,"Shape_Area":1.01880647492},"geometry":{"type":"Polygon","coordinates":[[[101.83986700000008,21.212029000000086],[102.03732299999996,21.120498999999995],[102.15878300000008,21.008936000000062],[102.30948599999999,20.962559000000113],[102.351158,20.875950000000046],[102.33212300000014,20.657724000000087],[102.23570300000011,20.62983700000001],[102.140083,20.37956600000001],[102.20432300000004,20.162392000000068],[102.06636800000012,20.045496000000128],[101.71374500000007,19.91818600000005],[101.62132999999994,19.827467000000127],[101.24858899999998,19.80837400000007],[101.13395699999995,19.88027000000011],[101.05629699999997,19.827526000000034],[100.76087200000012,19.873951000000034],[100.76206999999994,19.97904600000004],[100.90514400000012,19.98229200000003],[101.07379199999997,20.119297000000017],[101.16016400000012,20.07036600000015],[101.24418600000001,20.131726999999955],[101.22858399999996,20.308337999999992],[101.45594000000006,20.348467000000085],[101.57618699999995,20.58244300000007],[101.50308200000006,20.706598000000042],[101.52156100000013,20.85695800000002],[101.73089600000003,20.998707000000138],[101.78020500000014,21.141632999999956],[101.83986700000008,21.212029000000086]]]}},{"type":"Feature","properties":{"ID_0":126,"ISO":"LAO","NAME_0":"Laos","ID_1":1608,"pv":"YvLOmtTQD6b","NAME_1":"Phôngsali","VARNAME_1":"Fong Sali|Phongsaly","NL_NAME_1":"","HASC_1":"LA.PH","CC_1":"","TYPE_1":"Khoueng","ENGTYPE_1":"Province","VALIDFR_1":"Unknown",datarate:"40","VALIDTO_1":"Present","REMARKS_1":"","Shape_Leng":6.77216928187,"Shape_Area":1.33938623973},"geometry":{"type":"Polygon","coordinates":[[[102.94981500000011,21.142623000000015],[102.80352800000003,21.118574000000024],[102.78868900000003,21.029510000000073],[102.59948700000007,20.952844999999968],[102.51012400000008,20.86475400000006],[102.30948599999999,20.962559000000113],[102.15878300000008,21.008936000000062],[102.03732299999996,21.120498999999995],[101.83986700000008,21.212029000000086],[101.74030299999998,21.314831000000027],[101.82670600000006,21.60298000000006],[101.75277700000004,21.723619000000042],[101.78145600000005,21.83249100000006],[101.62166600000006,21.976160000000107],[101.54704299999997,22.250141000000042],[101.61871400000007,22.27435200000008],[101.68901900000009,22.471498999999994],[101.80689999999998,22.48590100000007],[101.86360900000005,22.390160000000037],[102.02439900000002,22.456890000000044],[102.12635000000012,22.435230000000047],[102.18207900000004,22.305903999999998],[102.437929,22.11604399999993],[102.5206760000001,21.965472000000034],[102.61314700000003,21.92150300000003],[102.66620699999999,21.682199000000082],[102.82769700000011,21.735039000000086],[102.98642200000012,21.726418000000024],[102.99662700000005,21.58829300000002],[102.87726900000013,21.42324100000002],[102.86276699999996,21.257041000000072],[102.94981500000011,21.142623000000015]]]}},{"type":"Feature","properties":{"ID_0":126,"ISO":"LAO","NAME_0":"Laos","ID_1":1609,"pv":"TOgZ99Jv0bN","NAME_1":"Saravan","VARNAME_1":"Salavan|Salavane|Saravane","NL_NAME_1":"","HASC_1":"LA.SL","CC_1":"","TYPE_1":"Khoueng","ENGTYPE_1":"Province","VALIDFR_1":"Unknown",datarate: "70","VALIDTO_1":"Present","REMARKS_1":"","Shape_Leng":6.5330286101,"Shape_Area":0.85825735701},"geometry":{"type":"Polygon","coordinates":[[[107.14479599999999,16.211414000000104],[107.06908400000003,16.077620000000024],[106.82,16.050377000000083],[106.80440500000003,15.962080000000014],[106.66947900000008,15.78659500000009],[106.68949900000007,15.546623000000125],[106.32996400000013,15.509919000000082],[106.373489,15.399991000000057],[106.17312599999997,15.28894900000006],[106.0757680000001,15.355739000000085],[106.07163200000002,15.461526000000106],[105.59570300000013,15.427504999999996],[105.63761200000005,15.658710000000042],[105.60333300000008,15.719081000000074],[105.40222899999998,15.793422000000078],[105.35444600000005,15.90451000000013],[105.42369000000002,16.005149000000017],[105.91502400000002,15.883853000000158],[105.98308600000007,15.959767000000113],[106.14455400000003,15.997731000000158],[106.16385700000006,16.17659199999997],[106.38728300000002,16.13615400000009],[106.63975500000004,16.194769000000065],[106.7577260000001,16.42391300000014],[106.83057200000007,16.549053999999956],[106.95970400000004,16.304242999999985],[107.0851760000001,16.312273999999945],[107.14479599999999,16.211414000000104]]]}},{"type":"Feature","properties":{"ID_0":126,"ISO":"LAO","NAME_0":"Laos","ID_1":1610,"pv":"pFCZqWnXtoU","NAME_1":"Savannakhét","VARNAME_1":"Svannakhet","NL_NAME_1":"","HASC_1":"LA.SV","CC_1":"","TYPE_1":"Khoueng","ENGTYPE_1":"Province","VALIDFR_1":"Unknown",datarate: "30","VALIDTO_1":"Present","REMARKS_1":"","Shape_Leng":6.94106153665,"Shape_Area":1.81356973075},"geometry":{"type":"Polygon","coordinates":[[[106.42480599999999,17.023708000000056],[106.5147520000001,16.97160300000013],[106.56421400000005,16.642989999999998],[106.67191700000001,16.560326000000032],[106.68632000000014,16.440248000000054],[106.7577260000001,16.42391300000014],[106.63975500000004,16.194769000000065],[106.38728300000002,16.13615400000009],[106.16385700000006,16.17659199999997],[106.14455400000003,15.997731000000158],[105.98308600000007,15.959767000000113],[105.91502400000002,15.883853000000158],[105.42369000000002,16.005149000000017],[105.043159,16.107430000000022],[105.01872200000008,16.239280000000008],[104.89466900000002,16.344401000000005],[104.73668600000013,16.570801000000074],[104.76579300000009,16.688129000000004],[104.73472800000013,16.954916000000026],[104.93109900000013,17.096823000000086],[105.16261300000002,17.112051000000065],[105.31561300000004,17.052927000000068],[105.48256700000007,17.102079000000117],[105.75731700000006,17.104242],[105.85098299999993,17.051695000000052],[106.08251199999995,17.051828000000057],[106.13370499999996,17.110157000000015],[106.23915100000005,17.035444000000155],[106.42480599999999,17.023708000000056]]]}},{"type":"Feature","properties":{"ID_0":126,"ISO":"LAO","NAME_0":"Laos","ID_1":1611,"pv":"W6sNfkJcXGC","NAME_1":"Vientiane","VARNAME_1":"Viangchan","NL_NAME_1":"","HASC_1":"LA.VI","CC_1":"","TYPE_1":"Khoueng","ENGTYPE_1":"Province","VALIDFR_1":"1989","VALIDTO_1":"199406","REMARKS_1":"","Shape_Leng":6.1036179224,"Shape_Area":1.0720019324},"geometry":{"type":"Polygon","coordinates":[[[102.57578999999998,19.224294999999984],[102.51832599999994,19.17109700000003],[102.63529999999997,18.89635800000002],[102.58360299999998,18.762692999999956],[102.73055300000004,18.483644000000083],[102.82171599999998,18.51071900000011],[102.90396900000002,18.293566000000112],[102.87429799999995,18.31289099999998],[102.594986,18.222227000000146],[102.49381299999999,18.29792000000009],[102.27195700000004,18.33776499999999],[102.224106,18.420999999999935],[102.06086000000005,18.360697000000073],[102.0507530000001,18.19747799999999],[101.90659399999998,18.027731000000017],[101.787239,18.069420000000036],[101.7363820000001,17.919178999999986],[101.55806000000007,17.808636000000092],[101.4143140000001,17.92335300000002],[101.4111860000001,18.213961000000097],[101.56458299999997,18.379923000000076],[101.70980800000012,18.480906000000004],[101.86134299999998,18.79038399999996],[101.8037950000001,18.863274000000047],[101.82009099999999,19.054892999999936],[101.96648399999998,19.16229600000014],[102.00051100000007,19.269688000000087],[102.17260000000005,19.408728000000053],[102.45962500000013,19.36814300000009],[102.57578999999998,19.224294999999984]]]}},{"type":"Feature","properties":{"ID_0":126,"ISO":"LAO","NAME_0":"Laos","ID_1":1612,"pv":"quFXhkOJGB4","NAME_1":"Vientiane [prefecture]","VARNAME_1":"Vientiane|Kamphaeng Nakhon Viang Chan","NL_NAME_1":"","HASC_1":"LA.VT","CC_1":"","TYPE_1":"Kampeng Nakhon","ENGTYPE_1":"Municipality|Prefecture","VALIDFR_1":"1989","VALIDTO_1":"Present","REMARKS_1":"","Shape_Leng":3.28542976395,"Shape_Area":0.309157776146},"geometry":{"type":"Polygon","coordinates":[[[102.90396900000002,18.293566000000112],[102.99364500000001,18.25847600000003],[103.00530199999997,18.154522000000156],[103.09757200000001,18.132868000000087],[103.01946200000009,17.969960000000015],[102.94036100000005,17.99963500000007],[102.68747600000012,17.866379999999992],[102.60395099999994,17.955551000000128],[102.45822900000007,17.97110900000007],[102.29054300000007,18.053221000000008],[102.16561100000013,18.201669000000038],[102.0507530000001,18.19747799999999],[102.06086000000005,18.360697000000073],[102.224106,18.420999999999935],[102.27195700000004,18.33776499999999],[102.49381299999999,18.29792000000009],[102.594986,18.222227000000146],[102.87429799999995,18.31289099999998],[102.90396900000002,18.293566000000112]]]}},{"type":"Feature","properties":{"ID_0":126,"ISO":"LAO","NAME_0":"Laos","ID_1":1613,"pv":"RdNV4tTRNEo","NAME_1":"Xaignabouri","VARNAME_1":"Sayabouri|Sayaboury|Xaignabouli|Xayabouri|Xayabury","NL_NAME_1":"","HASC_1":"LA.XA","CC_1":"","TYPE_1":"Khoueng","ENGTYPE_1":"Province","VALIDFR_1":"Unknown",datarate:"10","VALIDTO_1":"Present","REMARKS_1":"","Shape_Leng":9.94641059937,"Shape_Area":1.33870939592},"geometry":{"type":"Polygon","coordinates":[[[101.82009099999999,19.054892999999936],[101.8037950000001,18.863274000000047],[101.86134299999998,18.79038399999996],[101.70980800000012,18.480906000000004],[101.56458299999997,18.379923000000076],[101.4111860000001,18.213961000000097],[101.4143140000001,17.92335300000002],[101.55806000000007,17.808636000000092],[101.31578800000005,17.649299999999982],[101.16655700000007,17.466821000000095],[100.9685290000001,17.573550000000125],[101.02128699999992,17.890699000000097],[101.18527300000005,18.06191000000007],[101.18363900000003,18.337358999999992],[101.05628199999995,18.440540000000055],[101.27298000000002,18.6886310000001],[101.22567700000013,18.730681000000004],[101.24768899999998,18.886450000000025],[101.35890999999998,19.047470000000033],[101.25871300000011,19.122610000000066],[101.18930100000006,19.398459999999943],[101.28337099999999,19.579750000000047],[101.12458799999996,19.570630999999935],[101.02535300000011,19.627560000000074],[100.88497900000004,19.604931000000022],[100.76609000000002,19.499460000000056],[100.653572,19.5548],[100.58582400000012,19.481501000000037],[100.48172000000005,19.487640999999996],[100.4875790000001,19.596550000000093],[100.40856200000007,19.73393999999996],[100.43640900000003,19.796431000000098],[100.70593299999996,19.815525000000036],[100.76087200000012,19.873951000000034],[101.05629699999997,19.827526000000034],[101.13395699999995,19.88027000000011],[101.24858899999998,19.80837400000007],[101.62132999999994,19.827467000000127],[101.71374500000007,19.91818600000005],[101.77716099999998,19.843218000000036],[101.75402799999995,19.64617200000015],[101.83018499999997,19.44859500000001],[101.892448,19.42390800000004],[101.82298300000002,19.285397000000103],[101.82009099999999,19.054892999999936]]]}},{"type":"Feature","properties":{"ID_0":126,"ISO":"LAO","NAME_0":"Laos","ID_1":1614,"pv":"z1dTZFq99QZ","NAME_1":"Xaisômboun","VARNAME_1":"Saysomboune,|Xaysomboun","NL_NAME_1":"","HASC_1":"LA.XS","CC_1":"","TYPE_1":"Khetphiset","ENGTYPE_1":"Special Region|Zone","VALIDFR_1":"199406","VALIDTO_1":"Present","REMARKS_1":"","Shape_Leng":4.21175713095,"Shape_Area":0.663129492119},"geometry":{"type":"Polygon","coordinates":[[[103.88553600000006,18.87719300000009],[103.758331,18.828456999999958],[103.55954699999995,18.95250700000014],[103.48761699999994,18.939196000000095],[103.49572,18.63643100000013],[103.38246900000007,18.552280000000053],[103.09130900000014,18.51271399999996],[102.82171599999998,18.51071900000011],[102.73055300000004,18.483644000000083],[102.58360299999998,18.762692999999956],[102.63529999999997,18.89635800000002],[102.51832599999994,19.17109700000003],[102.57578999999998,19.224294999999984],[102.74219499999998,19.311945000000037],[102.92107400000009,19.194386000000122],[103.27986099999998,19.121330000000057],[103.50820199999998,19.152082000000007],[103.58152000000013,19.085962000000052],[103.88772600000004,19.004674999999963],[103.88553600000006,18.87719300000009]]]}},{"type":"Feature","properties":{"ID_0":126,"ISO":"LAO","NAME_0":"Laos","ID_1":1615,"pv":"dOhqCNenSjS","NAME_1":"Xékong","VARNAME_1":"Sekong","NL_NAME_1":"","HASC_1":"LA.XE","CC_1":"","TYPE_1":"Khoueng","ENGTYPE_1":"Province","VALIDFR_1":"1983","VALIDTO_1":"Present","REMARKS_1":"split from Saravan","Shape_Leng":6.01418114747,"Shape_Area":0.704005212268},"geometry":{"type":"Polygon","coordinates":[[[107.50448100000006,15.025408999999968],[107.445404,15.198486000000003],[107.36747700000012,15.159480999999971],[107.12623599999995,15.280838999999958],[106.91982300000006,15.221819000000039],[106.7976000000001,15.257373000000143],[106.68399000000005,15.138240000000053],[106.66241500000001,15.232623999999987],[106.373489,15.399991000000057],[106.32996400000013,15.509919000000082],[106.68949900000007,15.546623000000125],[106.66947900000008,15.78659500000009],[106.80440500000003,15.962080000000014],[106.82,16.050377000000083],[107.06908400000003,16.077620000000024],[107.14479599999999,16.211414000000104],[107.33787900000004,16.05558000000002],[107.44809400000003,16.091426000000126],[107.39265500000005,15.887240000000077],[107.21458999999999,15.824101000000041],[107.38176900000013,15.493601000000126],[107.4685,15.498627000000113],[107.63454700000005,15.319500000000119],[107.58719100000013,15.029108000000008],[107.50448100000006,15.025408999999968]]]}},{"type":"Feature","properties":{"ID_0":126,"ISO":"LAO","NAME_0":"Laos","ID_1":1616,"pv":"VWGSudnonm5","NAME_1":"Xiangkhoang","VARNAME_1":"Xiang Khouang|Xieng Khouang|Xiengkhuang|Xieng Khwang","NL_NAME_1":"","HASC_1":"LA.XI","CC_1":"","TYPE_1":"Khoueng","ENGTYPE_1":"Province","VALIDFR_1":"Unknown",datarate:"20","VALIDTO_1":"199406","REMARKS_1":"","Shape_Leng":6.1353563373,"Shape_Area":1.0864453255},"geometry":{"type":"Polygon","coordinates":[[[104.19980900000007,19.69683000000009],[104.07115800000008,19.682354000000146],[104.10467399999999,19.568044000000157],[104.0689680000001,19.416427000000112],[103.96278200000006,19.39064100000013],[103.91611100000011,19.30208799999997],[104.06749900000005,19.24812400000002],[104.256935,19.117320000000063],[104.25345600000009,18.980949000000123],[104.11791999999997,18.8148920000001],[103.88553600000006,18.87719300000009],[103.88772600000004,19.004674999999963],[103.58152000000013,19.085962000000052],[103.50820199999998,19.152082000000007],[103.27986099999998,19.121330000000057],[102.92107400000009,19.194386000000122],[102.74219499999998,19.311945000000037],[102.65925600000003,19.500988000000007],[102.93700400000012,19.718851000000143],[102.95003500000001,19.817307000000028],[103.13821400000006,19.91510800000009],[103.379974,19.879391],[103.68150300000008,19.922976000000062],[103.75647700000007,20.03112600000003],[103.8812640000001,19.966056999999978],[103.8734970000001,19.859224000000097],[103.97068000000002,19.782104000000004],[104.08269500000006,19.864315000000147],[104.20935800000007,19.84003300000012],[104.19980900000007,19.69683000000009]]]}},{"type":"Feature","properties":{"ID_0":126,"ISO":"LAO","NAME_0":"Laos","ID_1":1599,"pv":"hRQsZhmvqgS","NAME_1":"Attapu","VARNAME_1":"Attopu|Atpu|Attapeu|Attopeu|Muang Mai","NL_NAME_1":"","HASC_1":"LA.AT","CC_1":"","TYPE_1":"Khoueng","ENGTYPE_1":"Province","VALIDFR_1":"Unknown",datarate:"30","VALIDTO_1":"Present","REMARKS_1":"","Shape_Leng":5.83135636767,"Shape_Area":0.798233413741},"geometry":{"type":"Polygon","coordinates":[[[107.50448100000006,15.025408999999968],[107.47818899999999,14.957690999999954],[107.58891000000006,14.864032000000122],[107.50491799999998,14.785902000000135],[107.5476920000001,14.694111000000134],[107.43183899999997,14.520001000000093],[107.30459600000012,14.583132000000035],[107.26052099999998,14.485451000000126],[106.95923600000009,14.308902000000046],[106.854737,14.285512000000097],[106.71866599999998,14.419970000000092],[106.621802,14.45630200000005],[106.54441800000012,14.590971000000081],[106.41034000000013,14.448461000000009],[106.33728800000006,14.440520000000049],[106.345261,14.520944000000156],[106.1675800000001,14.777260999999953],[106.19185599999997,14.867452000000128],[106.32793400000003,15.004475000000014],[106.50416599999994,14.948733000000061],[106.48898300000013,14.820451999999932],[106.60506399999997,14.764001000000121],[106.821732,14.96128600000003],[106.766731,15.123754000000133],[106.68399000000005,15.138240000000053],[106.7976000000001,15.257373000000143],[106.91982300000006,15.221819000000039],[107.12623599999995,15.280838999999958],[107.36747700000012,15.159480999999971],[107.445404,15.198486000000003],[107.50448100000006,15.025408999999968]]]}},{"type":"Feature","properties":{"ID_0":126,"ISO":"LAO","NAME_0":"Laos","ID_1":1600,"pv":"FRmrFTE63D0","NAME_1":"Bokeo","VARNAME_1":"","NL_NAME_1":"","HASC_1":"LA.BK","CC_1":"","TYPE_1":"Khoueng","ENGTYPE_1":"Province","VALIDFR_1":"1983","VALIDTO_1":"Present","REMARKS_1":"split from Louang Namtha","Shape_Leng":4.45046134482,"Shape_Area":0.59337771628},"geometry":{"type":"Polygon","coordinates":[[[101.22858399999996,20.308337999999992],[101.24418600000001,20.131726999999955],[101.16016400000012,20.07036600000015],[101.07379199999997,20.119297000000017],[100.90514400000012,19.98229200000003],[100.76206999999994,19.97904600000004],[100.76087200000012,19.873951000000034],[100.70593299999996,19.815525000000036],[100.43640900000003,19.796431000000098],[100.50746199999998,19.88527099999999],[100.51528900000005,20.143909000000008],[100.33181900000011,20.396611000000064],[100.09414700000002,20.265911000000017],[100.08727199999993,20.35122199999995],[100.177818,20.62051000000008],[100.25948300000005,20.74696000000006],[100.40126800000002,20.832010000000082],[100.60885600000012,20.83779100000004],[100.70722200000006,20.780109000000152],[100.81929799999995,20.603640000000155],[100.83274100000006,20.497387000000117],[100.943604,20.499611000000073],[101.00072500000005,20.354692],[101.22858399999996,20.308337999999992]]]}},{"type":"Feature","properties":{"ID_0":126,"ISO":"LAO","NAME_0":"Laos","ID_1":1601,"pv":"vBWtCmNNnCG","NAME_1":"Bolikhamxai","VARNAME_1":"Bolikhamsai|Bolikhamxay|Borikhamzay|Borikane|Borikhan|Borikhane","NL_NAME_1":"","HASC_1":"LA.BL","CC_1":"","TYPE_1":"Khoueng","ENGTYPE_1":"Province","VALIDFR_1":"1983","VALIDTO_1":"Present","REMARKS_1":"","Shape_Leng":8.23309757525,"Shape_Area":1.35328870112},"geometry":{"type":"Polygon","coordinates":[[[105.2575010000001,18.26768999999996],[105.25722800000005,18.26630499999999],[105.25829799999997,18.257201000000066],[105.22502099999997,18.14041100000003],[105.06964099999999,17.93825700000008],[104.92665099999999,17.95209700000015],[104.81252300000011,18.058962000000008],[104.55254399999995,18.222567000000026],[104.4038700000001,18.153431000000126],[104.27948800000001,17.853373999999974],[103.97754000000009,18.33241200000009],[103.85343200000011,18.285521000000074],[103.6193310000001,18.398230000000126],[103.414917,18.446161000000075],[103.24716100000012,18.361169000000018],[103.09757200000001,18.132868000000087],[103.00530199999997,18.154522000000156],[102.99364500000001,18.25847600000003],[102.90396900000002,18.293566000000112],[102.82171599999998,18.51071900000011],[103.09130900000014,18.51271399999996],[103.38246900000007,18.552280000000053],[103.49572,18.63643100000013],[103.48761699999994,18.939196000000095],[103.55954699999995,18.95250700000014],[103.758331,18.828456999999958],[103.88553600000006,18.87719300000009],[104.11791999999997,18.8148920000001],[104.25345600000009,18.980949000000123],[104.256935,19.117320000000063],[104.49519700000008,19.004268000000025],[104.73923300000001,18.80049900000006],[104.91220500000003,18.786900000000003],[104.94151900000003,18.73851300000001],[105.1332230000001,18.716812000000004],[105.10280199999994,18.44773500000008],[105.2575010000001,18.26768999999996]]]}},{"type":"Feature","properties":{"ID_0":126,"ISO":"LAO","NAME_0":"Laos","ID_1":1602,"pv":"sv6c7CpPcrc","NAME_1":"Champasak","VARNAME_1":"Bassac|Champassack|Champassak|Champassac|Khong|Pakse","NL_NAME_1":"","HASC_1":"LA.CH","CC_1":"","TYPE_1":"Khoueng","ENGTYPE_1":"Province","VALIDFR_1":"Unknown",datarate:"10","VALIDTO_1":"Present","REMARKS_1":"","Shape_Leng":8.32709761783,"Shape_Area":1.25151277993},"geometry":{"type":"Polygon","coordinates":[[[106.373489,15.399991000000057],[106.66241500000001,15.232623999999987],[106.68399000000005,15.138240000000053],[106.766731,15.123754000000133],[106.821732,14.96128600000003],[106.60506399999997,14.764001000000121],[106.48898300000013,14.820451999999932],[106.50416599999994,14.948733000000061],[106.32793400000003,15.004475000000014],[106.19185599999997,14.867452000000128],[106.1675800000001,14.777260999999953],[106.345261,14.520944000000156],[106.33728800000006,14.440520000000049],[106.26052100000004,14.484581000000048],[106.22100100000006,14.360030000000052],[106.02944100000002,14.342860000000087],[106.03592700000002,14.23112100000003],[106.10869600000001,14.18552000000011],[106.1764300000001,14.024020000000007],[106.10769699999997,13.908281000000045],[105.912621,13.926250000000039],[105.788071,14.080660000000023],[105.56044800000006,14.158250000000123],[105.36444200000005,14.101911000000143],[105.20819100000011,14.309980999999993],[105.4314730000001,14.412991000000147],[105.54164100000003,14.582071000000155],[105.52443699999998,14.823461000000066],[105.57882000000012,14.995070999999996],[105.46698799999996,15.112990000000025],[105.59400200000005,15.271126000000152],[105.49517100000003,15.383980000000122],[105.59570300000013,15.427504999999996],[106.07163200000002,15.461526000000106],[106.0757680000001,15.355739000000085],[106.17312599999997,15.28894900000006],[106.373489,15.399991000000057]]]}},{"type":"Feature","properties":{"ID_0":126,"ISO":"LAO","NAME_0":"Laos","ID_1":1603,"pv":"hdeC7uX9Cko","NAME_1":"Houaphan","VARNAME_1":"Hua Phan|Huaphanh|Sam Neua|Xam Nua","NL_NAME_1":"","HASC_1":"LA.HO","CC_1":"","TYPE_1":"Khoueng","ENGTYPE_1":"Province","VALIDFR_1":"Unknown",datarate:"20","VALIDTO_1":"Present","REMARKS_1":"","Shape_Leng":8.09078177521,"Shape_Area":1.49594081743},"geometry":{"type":"Polygon","coordinates":[[[104.19980900000007,19.69683000000009],[104.20935800000007,19.84003300000012],[104.08269500000006,19.864315000000147],[103.97068000000002,19.782104000000004],[103.8734970000001,19.859224000000097],[103.8812640000001,19.966056999999978],[103.75647700000007,20.03112600000003],[103.68150300000008,19.922976000000062],[103.379974,19.879391],[103.13821400000006,19.91510800000009],[103.10983299999998,20.16720000000015],[103.23441300000013,20.31020500000011],[103.213524,20.697047999999995],[103.38863100000009,20.78446700000012],[103.46766400000001,20.825606000000107],[103.68188100000009,20.660286000000156],[103.79014799999999,20.746748000000082],[103.80084500000004,20.848133000000075],[104.03105800000009,20.90202700000009],[104.12084199999993,20.970527000000004],[104.280484,20.925080000000037],[104.60313900000006,20.67050400000005],[104.60035200000004,20.605791000000124],[104.375178,20.46727400000003],[104.42019500000009,20.376465999999994],[104.59821099999999,20.41678100000007],[104.62908299999992,20.22968700000007],[104.92103500000002,20.144909000000155],[104.97115300000007,20.061702000000025],[104.83895300000006,19.917620000000113],[104.83430500000009,19.80207900000005],[104.67536000000001,19.71172200000001],[104.64536299999997,19.62491800000015],[104.50519600000013,19.625924999999995],[104.41196500000001,19.70505100000014],[104.19980900000007,19.69683000000009]]]}},{"type":"Feature","properties":{"ID_0":126,"ISO":"LAO","NAME_0":"Laos","ID_1":1604,"pv":"c4HrGRJoarj","NAME_1":"Khammouan","VARNAME_1":"Khammouane|Khammuan","NL_NAME_1":"","HASC_1":"LA.KH","CC_1":"","TYPE_1":"Khoueng","ENGTYPE_1":"Province","VALIDFR_1":"1983","VALIDTO_1":"Present","REMARKS_1":"","Shape_Leng":7.62320859521,"Shape_Area":1.40824642557},"geometry":{"type":"Polygon","coordinates":[[[106.42303400000009,17.031885000000045],[106.42303600000008,17.03187500000007],[106.42480599999999,17.023708000000056],[106.23915100000005,17.035444000000155],[106.13370499999996,17.110157000000015],[106.08251199999995,17.051828000000057],[105.85098299999993,17.051695000000052],[105.75731700000006,17.104242],[105.48256700000007,17.102079000000117],[105.31561300000004,17.052927000000068],[105.16261300000002,17.112051000000065],[104.93109900000013,17.096823000000086],[104.73472800000013,16.954916000000026],[104.80621300000007,17.22509100000002],[104.80303199999997,17.372700000000066],[104.69773900000013,17.525410000000136],[104.457359,17.657990000000098],[104.3494270000001,17.820780000000013],[104.27948800000001,17.853373999999974],[104.4038700000001,18.153431000000126],[104.55254399999995,18.222567000000026],[104.81252300000011,18.058962000000008],[104.92665099999999,17.95209700000015],[105.06964099999999,17.93825700000008],[105.22502099999997,18.14041100000003],[105.25829799999997,18.257201000000066],[105.408324,18.154158000000052],[105.45914099999999,18.205866000000015],[105.64287900000011,17.992550999999935],[105.60729899999995,17.87710400000003],[105.77926700000006,17.675023000000067],[105.86122799999993,17.62744000000015],[106.09090199999997,17.36183100000011],[106.23512299999999,17.250288999999952],[106.30418300000008,17.25799399999994],[106.42303400000009,17.031885000000045]]]}}]},
//                    mgrscript:"\n<script type=\"text/javascript\">var map=L.map('map').setView([37.8,-96],4);L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png',{maxZoom:18,attribution:'Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, '+'<a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, '+'Imagery © <a href=\"http://mapbox.com\">Mapbox</a>',id:'examples.map-20v6611k'}).addTo(map);var info=L.control();info.onAdd=function(map){this._div=L.DomUtil.create('div','info');this.update();return this._div;};info.update=function(props){this._div.innerHTML='<h4>US Population Density</h4>'+(props?'<b>'+props.name+'</b><br/>'+props.density+' people / mi<sup>2</sup>':'Hover over a state');};info.addTo(map);function getColor(d){return d>1000?'#800026':d>500?'#BD0026':d>200?'#E31A1C':d>100?'#FC4E2A':d>50?'#FD8D3C':d>20?'#FEB24C':d>10?'#FED976':'#FFEDA0';}function style(feature){return{weight:2,opacity:1,color:'white',dashArray:'3',fillOpacity:0.7,fillColor:getColor(feature.properties.density)};}function highlightFeature(e){var layer=e.target;layer.setStyle({weight:5,color:'#666',dashArray:'',fillOpacity:0.7});if(!L.Browser.ie&&!L.Browser.opera){layer.bringToFront();}info.update(layer.feature.properties);}var geojson;function resetHighlight(e){geojson.resetStyle(e.target);info.update();}function zoomToFeature(e){map.fitBounds(e.target.getBounds());}function onEachFeature(feature,layer){layer.on({mouseover:highlightFeature,mouseout:resetHighlight,click:zoomToFeature});}geojson=L.geoJson(statesData,{style:style,onEachFeature:onEachFeature}).addTo(map);map.attributionControl.addAttribution('Population data &copy; <a href=\"http://census.gov/\">US Census Bureau</a>');var legend=L.control({position:'bottomright'});legend.onAdd=function(map){var div=L.DomUtil.create('div','info legend'),grades=[0,10,20,50,100,200,500,1000],labels=[],from,to;for(var i=0;i<grades.length;i++){from=grades[i];to=grades[i+1];labels.push('<i style=\"background:'+getColor(from+1)+'\"></i> '+from+(to?'&ndash;'+to:'+'));}div.innerHTML=labels.join('<br>');return div;};legend.addTo(map);</script>",
//                    process:"window.onload=function(){function n(e){return e>1e3?\"#800026\":e>500?\"#BD0026\":e>200?\"#E31A1C\":e>100?\"#FC4E2A\":e>50?\"#FD8D3C\":e>20?\"#FEB24C\":e>10?\"#FED976\":\"#FFEDA0\"}function r(e){return{weight:2,opacity:1,color:\"white\",dashArray:\"3\",fillOpacity:.7,fillColor:n(e.properties.datarate)}}function i(e){var n=e.target;n.setStyle({weight:5,color:\"#666\",dashArray:\"\",fillOpacity:.7});if(!L.Browser.ie&&!L.Browser.opera){n.bringToFront()}t.update(n.feature.properties)}function o(e){s.resetStyle(e.target);t.update()}function u(t){e.fitBounds(t.target.getBounds())}function a(e,t){t.on({mouseover:i,mouseout:o,click:u})}var e=L.map(\"map\").setView([18,105],6);L.tileLayer(\"https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png\",{maxZoom:18,attribution:'Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, '+'<a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, '+'Imagery © <a href=\"http://mapbox.com\">Mapbox</a>',id:\"examples.map-20v6611k\"}).addTo(e);var t=L.control();t.onAdd=function(e){this._div=L.DomUtil.create(\"div\",\"info\");this.update();return this._div};t.update=function(e){this._div.innerHTML=\"<h4>US Population Density</h4>\"+(e?\"<b>\"+e.name+\"</b><br />\"+e.datarate+\" people / mi<sup>2</sup>\":\"Hover over a state\")};t.addTo(e);var s;s=L.geoJson(statesData,{style:r,onEachFeature:a}).addTo(e);e.attributionControl.addAttribution('Population data &copy; <a href=\"http://census.gov/\">US Census Bureau</a>');var f=L.control({position:\"bottomright\"});f.onAdd=function(e){var t=L.DomUtil.create(\"div\",\"info legend\"),r=[0,5,10,15,25],i=[],s,o;for(var u=0;u<r.length;u++){s=r[u];o=r[u+1];i.push('<i style=\"background:'+n(s+1)+'\"></i> '+s+(o?\"&ndash;\"+o:\"+\"))}t.innerHTML=i.join(\"<br>\");return t};f.addTo(e)}"                  
//
//        };


