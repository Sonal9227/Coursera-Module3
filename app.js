(function () {
'use strict';



angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
.directive('foundList', FoundItemsDirective);


function FoundItemsDirective() {
  var ddo = {
    templateUrl: 'foundList.html',
    scope: {
      founditems: '<',
      onRemove: '&',
      searchitem: '='
    },
    controller: FoundItemsDirectiveController,
    controllerAs: 'found',
    bindToController: true
  };

  return ddo;
}


function FoundItemsDirectiveController() {
  var foundItems = this;

  // console.log(foundItems);

  foundItems.searchResult = function() {
    if(foundItems.founditems.length == 0) {
      // console.log(foundItems.founditems);
      // console.log("empty");
      return true;
    }
    else {
      // console.log(foundItems.founditems.length);
      // console.log("not empty");
      return false;
    }
  }


}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var menu = this;
  // console.log(menu);


  menu.searchTerm = null;
  menu.found ="";
  var searchterm = menu.searchTerm;


  menu.searchTermInList = function(searchterm) {



    if (searchterm != null){
      menu.searchError = null;
      // console.log(searchterm.toLowerCase());

      MenuSearchService.getMatchedMenuItems(searchterm.toLowerCase());



    }
    // else if (searchterm == null) {
    //   menu.searchError = "No search term entered."
    // }


  };


  menu.found = MenuSearchService.getMenuList();
  // console.log("f", menu.found);

  menu.removeItem = function(itemIndex) {
    // console.log(itemIndex);
    MenuSearchService.removeItem(itemIndex);
  }

  menu.clear = function() {

    menu.found = MenuSearchService.clear();
    menu.searchTerm = null;
  }




}


MenuSearchService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService($http, ApiBasePath) {
  var service = this;
  var foundItems = [];
  service.getMatchedMenuItems = function(searchTerm) {

    var response = $http({
      method: "GET",
      url: (ApiBasePath + "/menu_items.json")
    });

    // console.log(response);

    var promise = response;

    promise.then(function(response) {
      // console.log(response.data.menu_items[0].description);
      // console.log(response.data.menu_items.length);

      for(var i = 0; i < response.data.menu_items.length; i++) {
        var responseDescription = response.data.menu_items[i].description;
        if(responseDescription.match(searchTerm)) {
          // console.log("yes");

          foundItems.push(response.data.menu_items[i]);

        }
        else {
          // console.log("no");
          continue;
        }
      }
      // console.log(foundItems);
      return foundItems;

    })
    .catch(function(error) {
      // console.log(error)
    });
  };



  service.getMenuList = function() {
    // console.log(foundItems);
    return foundItems;
  };

  service.removeItem = function(itemIndex) {
    // console.log(itemIndex);
    foundItems.splice(itemIndex, 1);
  };

  service.clear = function() {
    foundItems = [];

    // console.log(foundItems);
    return foundItems;

  };






}




})();
