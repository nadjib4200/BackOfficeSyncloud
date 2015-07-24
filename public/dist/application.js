'use strict';
// Init the application configuration module for AngularJS application
var ApplicationConfiguration = function () {
    // Init module configuration options
    var applicationModuleName = 'user-track';
    var applicationModuleVendorDependencies = [
        'ngResource',
        'ngCookies',
        'ngAnimate',
        'ngTouch',
        'ngSanitize',
        'ui.router',
        'ui.bootstrap',
        'ui.utils',
        'restangular'
      ];
    // Add a new vertical module
    var registerModule = function (moduleName) {
      // Create angular module
      angular.module(moduleName, []);
      // Add the module to the AngularJS configuration file
      angular.module(applicationModuleName).requires.push(moduleName);
    };
    return {
      applicationModuleName: applicationModuleName,
      applicationModuleVendorDependencies: applicationModuleVendorDependencies,
      registerModule: registerModule
    };
  }();'use strict';
//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);
// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config([
  '$locationProvider',
  function ($locationProvider) {
    $locationProvider.hashPrefix('!');
  }
]);
//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash === '#_=_')
    window.location.hash = '#!';
  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});Events = {
  LOADER_SHOW: 'loader_show',
  LOADER_HIDE: 'loader_hide'
};'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('events');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('metrics');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('projects');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('usersettings');'use strict';
// Setting up route
angular.module('core').config([
  '$stateProvider',
  '$urlRouterProvider',
  'RestangularProvider',
  function ($stateProvider, $urlRouterProvider, RestangularProvider) {
    RestangularProvider.setBaseUrl('/api');
    // Redirect to home view when route not found
    $urlRouterProvider.otherwise('/');
    // Home state routing
    $stateProvider.state('home', {
      url: '/',
      templateUrl: 'modules/core/views/home.client.view.html'
    });
  }
]);'use strict';
angular.module('core').controller('HeaderController', [
  '$scope',
  'Authentication',
  'Menus',
  function ($scope, Authentication, Menus) {
    $scope.authentication = Authentication;
    $scope.isCollapsed = false;
    $scope.menu = Menus.getMenu('topbar');
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };
    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });
    $scope.toggleCollapsibleMenu = function () {
      console.log('toggleCollapsibleMenu in HeaderController');
      //angular.element('.left-side').toggleClass("collapse-left");
      //angular.element(".right-side").toggleClass("strech");
      //If window is small enough, enable sidebar push menu
      if (angular.element(window).width() <= 992) {
        angular.element('.row-offcanvas').toggleClass('active');
        angular.element('.left-side').removeClass('collapse-left');
        angular.element('.right-side').removeClass('strech');
        angular.element('.row-offcanvas').toggleClass('relative');
      } else {
        //Else, enable content streching
        angular.element('.left-side').toggleClass('collapse-left');
        angular.element('.right-side').toggleClass('strech');
      }
    };
  }
]);'use strict';
angular.module('core').controller('HomeController', [
  '$scope',
  '$location',
  'Authentication',
  function ($scope, $location, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    if (!Authentication.user) {
      $location.path('/signin');
    }
    console.log('/home ', '$scope.authentication', $scope.authentication);
  }
]);'use strict';
var _ = window._;
var AlgoliaSearch = window.AlgoliaSearch;
var CodeMirror = window.CodeMirror;
angular.module('core').directive('at', function () {
  console.log('load AT directive');
  return {
    restrict: 'A',
    require: 'ngModel',
    controller: [
      '$scope',
      '$q',
      'Authentication',
      'Menus',
      function ($scope, $q, Authentication, Menus) {
        $scope.authentication = Authentication;
        // Replace the following values by your ApplicationID and ApiKey.
        var algolia = new AlgoliaSearch('L5WT7X7KKP', '09ec46f6119c8ad16dbe6969c6f8f07f');
        // replace YourIndexName by the name of the index you want to query.
        var index = algolia.initIndex('test');
        var previousPosition = 0;
        $scope.search = function (keyword) {
          var deferred = $q.defer();
          var startPosition = document.activeElement.selectionStart;
          var aKeyWord = '';
          var found = false;
          for (var i = startPosition - 1; i >= 0; i--) {
            var text = document.activeElement.value;
            var subText = text.substring(i, startPosition);
            if (subText.indexOf('@') >= 0 && !found) {
              found = true;
              aKeyWord = subText;
            }
          }
          previousPosition = document.activeElement.selectionEnd;
          index.search(aKeyWord, function (success, content) {
            var data = _.map(content.hits, function (hit) {
                hit.template = hit.value ? hit.action + ':"' + hit.value + '"' : hit.action;
                return hit;  //;
              });
            deferred.resolve({
              data: data,
              keyword: aKeyWord
            });
          });
          return deferred.promise;
        };
        $scope.makeSearch = function (keyword) {
          var deferred = $q.defer();
          index.search(keyword, function (success, content) {
            var data = _.map(content.hits, function (hit) {
                hit.template = hit.value ? hit.action + ':"' + hit.value + '"' : hit.action;
                return hit;  //;
              });
            deferred.resolve({
              data: data,
              keyword: keyword
            });
          });
          return deferred.promise;
        };
      }
    ],
    link: function (scope, element, attrs, ngModel) {
      var isFilter = attrs.atTpl === 'filter';
      var template = isFilter ? '<%=action %>  ==  "<%=value%>"' : '<%=action %>:"<%=value%>"';
      var editor = CodeMirror.fromTextArea(document.getElementById(attrs.id), {
          lineNumbers: true,
          styleActiveLine: true,
          matchBrackets: true,
          theme: 'monokai',
          mode: 'javascript'
        });
      editor.on('inputRead', function (cm) {
        var WORD = /[\w$]+/, RANGE = 500;
        var word = WORD;
        var range = RANGE;
        var cur = editor.getCursor(), curLine = editor.getLine(cur.line);
        var start = cur.ch, end = start;
        while (end < curLine.length && word.test(curLine.charAt(end)))
          ++end;
        while (start && word.test(curLine.charAt(start - 1)))
          --start;
        var curWord = start !== end && curLine.slice(start, end);
        //Algolia
        scope.makeSearch(curWord).then(function (result) {
          var data = result.data;
          if (!isFilter) {
            data.push({
              displayText: 'evolution',
              text: 'evolution ( some_action:\'some_value\' ) ',
              className: 'method'
            });
          }
          _.each(data, function (element) {
            //each element should have displayText
            element.displayText = element.displayText || element['field'];
            //at selection
            if (!element.text) {
              var compiled = _.template(template);
              var text = compiled(element);
              element.text = text;
            }
          });
          CodeMirror.showHint(cm, CodeMirror.hint.algolia, {
            completeSingle: false,
            list: data
          });
        });
      });
    }
  };
});'use strict';
angular.module('core').directive('loader', function () {
  return {
    restrict: 'A',
    templateUrl: 'modules/core/directives/loader.client.view.html',
    controller: [
      '$rootScope',
      '$scope',
      'Authentication',
      'Menus',
      function ($rootScope, $scope, Authentication, Menu) {
        $scope.authentication = Authentication;
        $rootScope.$on('loader_show', function (event) {
          console.log('show');
          $scope.showLoader = true;
        });
        $rootScope.$on('loader_hide', function (event) {
          console.log('hide');
          $scope.showLoader = false;
        });
      }
    ],
    link: function (scope, element, attrs) {
      //Par défaut on affiche pas le loader
      scope.showLoader = false;
    }
  };
});'use strict';
angular.module('core').directive('sidemenu', function () {
  return {
    restrict: 'A',
    templateUrl: 'modules/core/directives/sidemenu.client.view.html',
    controller: [
      '$scope',
      'Authentication',
      'Menus',
      function ($scope, Authentication, Menus) {
        $scope.authentication = Authentication;
      }
    ],
    link: function (scope, element, attrs) {
      console.log('sidemenu directive');
      scope.$on('toggleCollapsibleMenu', function () {
        angular.element('.left-side').toggleClass('collapse-left');
        angular.element('.right-side').toggleClass('strech');
      });
    }
  };
});'use strict';
//Menu service used for managing  menus
angular.module('core').service('Menus', [function () {
    // Define a set of default roles
    this.defaultRoles = ['user'];
    // Define the menus object
    this.menus = {};
    // A private function for rendering decision 
    var shouldRender = function (user) {
      if (user) {
        for (var userRoleIndex in user.roles) {
          for (var roleIndex in this.roles) {
            if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
              return true;
            }
          }
        }
      } else {
        return this.isPublic;
      }
      return false;
    };
    // Validate menu existance
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId]) {
          return true;
        } else {
          throw new Error('Menu does not exists');
        }
      } else {
        throw new Error('MenuId was not provided');
      }
      return false;
    };
    // Get the menu object by menu id
    this.getMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      return this.menus[menuId];
    };
    // Add new menu object by menu id
    this.addMenu = function (menuId, isPublic, roles) {
      // Create the new menu
      this.menus[menuId] = {
        isPublic: isPublic || false,
        roles: roles || this.defaultRoles,
        items: [],
        shouldRender: shouldRender
      };
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      delete this.menus[menuId];
    };
    // Add menu item object
    this.addMenuItem = function (menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Push new menu item
      this.menus[menuId].items.push({
        title: menuItemTitle,
        link: menuItemURL,
        menuItemType: menuItemType || 'item',
        menuItemClass: menuItemType,
        uiRoute: menuItemUIRoute || '/' + menuItemURL,
        isPublic: isPublic || this.menus[menuId].isPublic,
        roles: roles || this.defaultRoles,
        items: [],
        shouldRender: shouldRender
      });
      // Return the menu object
      return this.menus[menuId];
    };
    // Add submenu item object
    this.addSubMenuItem = function (menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
          // Push new submenu item
          this.menus[menuId].items[itemIndex].items.push({
            title: menuItemTitle,
            link: menuItemURL,
            uiRoute: menuItemUIRoute || '/' + menuItemURL,
            isPublic: isPublic || this.menus[menuId].isPublic,
            roles: roles || this.defaultRoles,
            shouldRender: shouldRender
          });
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
          this.menus[menuId].items.splice(itemIndex, 1);
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
          if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
            this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
          }
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    //Adding the topbar menu
    this.addMenu('topbar');
  }]);'use strict';
// Setting up route
angular.module('events').config([
  '$stateProvider',
  function ($stateProvider) {
    // Usersettings state routing
    $stateProvider.state('listOfEvents', {
      url: '/projects/:projectId/events/:identity',
      templateUrl: 'modules/events/views/list-events.client.view.html'
    });
  }
]);'use strict';
var _ = window._;
var dc = window.dc;
var d3 = window.d3;
var crossfilter = window.crossfilter;
var dagreD3 = window.dagreD3;
var Events = window.Events;
var PUBNUB = window.PUBNUB;
angular.module('events').controller('EventsController', [
  '$scope',
  '$rootScope',
  '$stateParams',
  '$location',
  'Authentication',
  'UsersettingService',
  'ProjectService',
  'EventService',
  function ($scope, $rootScope, $stateParams, $location, Authentication, UsersettingService, ProjectService, EventService) {
    $scope.timePath = function (sessions) {
      var time1 = new Date(sessions[0].date);
      var time2 = new Date(sessions[sessions.length - 1].date);
      return Math.abs(time1.secondsSince(time2));
    };
    $scope.getTimeAverage = function () {
      var sum = 0;
      _.forEach($scope.tableEvents, function (session) {
        sum = sum + $scope.timePath(session);
      });
      return sum / Object.keys($scope.tableEvents).length;
    };
    $scope.getListOfEvents = function () {
      $rootScope.$broadcast(Events.LOADER_SHOW);
      ProjectService.getProject($stateParams.projectId).then(function (project) {
        $scope.project = project;
        $scope.identity = $stateParams.identity.toLowerCase();
        EventService.getEvents($scope.identity).then(function (events) {
          $scope.events = events;
          $scope.settings = events[0].settings;
          $scope.tableEvents = EventService.getSessions(events);
          $scope.timeAverage = $scope.getTimeAverage();
          $rootScope.$broadcast(Events.LOADER_HIDE);
        });
      });
    };
    $scope.getColor = function (index) {
      var COLORS = [
          '',
          'green',
          'red',
          'purple'
        ];
      var colorSize = COLORS.length;
      return COLORS[index % colorSize];
    };
    $scope.sendURL = function (identity) {
      var pubnub = PUBNUB.init({
          publish_key: 'pub-c-ddc60605-57f5-4267-b32a-93af942c9438',
          subscribe_key: 'sub-c-e66141da-5a29-11e4-bd8e-02ee2ddab7fe'
        });
      var url = 'https://www.hipchat.com/gDdXAMpiV?anonymous=1&timezone=Paris%2C+Madrid&minimal=1&welcome_msg=Questions%3F+Come+chat+with+us!+We%27re+here%2C+send+us+a+message';
      pubnub.publish({
        channel: 'ninou-chat',
        message: url,
        callback: function (e) {
          console.log('SUCCESS!', e);
          if (!document.getElementById('liveChat') && !document.getElementById('barOfChat')) {
            //create chatbox bar
            var div = document.createElement('div');
            div.id = 'ChatBlackBox';
            div.setAttribute('style', 'width:300px;background-color:black;height:40px;position: fixed; bottom:0;cursor:pointer;border-radius: 8px 8px 0 0;margin-left:1050px;');
            div.setAttribute('onclick', 'document.getElementById(\'barOfChat\').style.display=\'\';document.getElementById(\'liveChat\').style.display=\'\';document.getElementById(\'ChatBlackBox\').style.display=\'none\';');
            div.style.display = 'none';
            //create message to show it in chatbox bar
            var div2 = document.createElement('div');
            div2.setAttribute('style', 'color:white;margin-left:20px;margin-top:10px;font-size:20px;');
            div2.innerHTML = 'click to display chat';
            div.appendChild(div2);
            document.body.appendChild(div);
            //create chatbox
            var chat = document.createElement('div');
            chat.id = 'liveChat';
            chat.setAttribute('style', 'box-shadow: 0px 0px 10px #888888;position: fixed; bottom:0;border:1px solid black;margin-left:1050px;margin-bottom:-3px;');
            //create iframe that contain a chat iframe from hipchat
            var iframe = document.createElement('iframe');
            iframe.id = 'frameOfChat';
            iframe.src = url;
            iframe.height = '300';
            iframe.setAttribute('style', 'border:none');
            chat.appendChild(iframe);
            document.body.appendChild(chat);
            //create a header for chatbox
            var bar = document.createElement('div');
            bar.id = 'barOfChat';
            bar.innerHTML = '<div style=\'margin-top:10px;margin-left:10px;\'>Welcome to Usertrack Chat</div>';
            bar.setAttribute('style', 'box-shadow: 0px 0px 10px #888888;width:302.5px;background-color:black;height:40px;position: fixed; bottom:303px;margin-left:1050px;color:white;');
            //create bouton to reduce a header for chatbox when a user would to reduce it
            var reduceButton = document.createElement('a');
            reduceButton.setAttribute('style', 'color:white;font-size:60px;cursor:pointer;');
            reduceButton.innerHTML = '<div style=\'margin-top:-50px;margin-left:275px;\'>-</div>';
            reduceButton.setAttribute('onclick', 'document.getElementById(\'barOfChat\').style.display=\'none\';document.getElementById(\'liveChat\').style.display=\'none\';document.getElementById(\'ChatBlackBox\').style.display=\'\';');
            bar.appendChild(reduceButton);
            document.body.appendChild(bar);
          } else {
            document.getElementById('barOfChat').style.display = '';
            document.getElementById('liveChat').style.display = '';
            document.getElementById('ChatBlackBox').style.display = 'none';
          }
        },
        error: function (e) {
          console.log('FAILED! RETRY PUBLISH!', e);
        }
      });
    };
  }
]);'use strict';
var _ = window._;
var dc = window.dc;
var d3 = window.d3;
var crossfilter = window.crossfilter;
var dagreD3 = window.dagreD3;
angular.module('events').directive('timelineofevents', function () {
  return {
    restrict: 'A',
    require: 'ngModel',
    templateUrl: 'modules/events/directives/timelineOfEvents.client.view.html',
    controller: [
      '$scope',
      'Authentication',
      'Menus',
      function ($scope, Authentication, Menus) {
        $scope.authentication = Authentication;
      }
    ],
    link: function (scope, element, attrs, ngModel) {
      console.log('timelineofevents directive');
      //récupère la coulor via l'attribu color
      scope.bgColor = attrs.color;
      ngModel.$render = function () {
        //on récupère le model
        scope.tableOfEvents = ngModel.$viewValue;
      };
    }
  };
}).directive('eventsgraph', function () {
  return {
    restrict: 'A',
    require: 'ngModel',
    templateUrl: 'modules/events/directives/eventsgraph.client.view.html',
    controller: [
      '$scope',
      'Authentication',
      'Menus',
      function ($scope, Authentication, Menus) {
        $scope.authentication = Authentication;
        $scope.S4 = function () {
          return ((1 + Math.random()) * 65536 | 0).toString(16).substring(1);
        };
        $scope.uuid = function () {
          return $scope.S4() + $scope.S4() + $scope.S4() + $scope.S4() + $scope.S4() + $scope.S4() + $scope.S4() + $scope.S4();
        };
      }
    ],
    link: function (scope, element, attrs, ngModel) {
      console.log('timelineofevents directive');
      //récupère la coulor via l'attribu color
      scope.bgColor = attrs.color;
      var time1, time2;
      scope._id = scope.uuid();
      ngModel.$render = function () {
        //on récupère le model
        var events = ngModel.$viewValue;
        scope.events = _.sortBy(events, function (event) {
          return event.date;
        });
        var workers = {};
        _.each(scope.events, function (event, index) {
          var aDate = Date.create(event.date).format('{yyyy}-{MM}-{dd} {hh}:{mm}:{ss}');
          if (index === 0) {
            //le premier element
            var key = event.key + ':' + event.value;
            workers[key] = {
              'consumers': 1,
              'date': aDate,
              'inputThroughput': 0
            };
          } else {
            var previousEvent = scope.events[index - 1];
            time1 = new Date(event.date);
            time2 = new Date(previousEvent.date);
            var deltaTime = Math.abs(time1.secondsSince(time2));
            var currentkey = event.key + ':' + event.value;
            var prevKey = previousEvent.key + ':' + previousEvent.value;
            workers[currentkey] = {
              'consumers': 1,
              'date': aDate,
              'inputQueue': prevKey,
              'inputThroughput': deltaTime
            };
          }
        });
        window.setTimeout(function () {
          scope.drawGraph(workers);
        }, 1000);
      };
      scope.draw = function (isUpdate, workers) {
        var zoom = d3.behavior.zoom();
        var nodes = [];
        var edges = [];
        for (var id in workers) {
          var worker = workers[id];
          var className = '';
          className += worker.consumers ? 'running' : 'stopped';
          if (worker.count > 10000) {
            className += ' warn';
          }
          var html = '<div>';
          html += '<span class="status"></span>';
          //html += '<div></div>';
          html += '<span class="name">' + id + '</span>';
          html += '<span class="queue"><span class="counter">' + worker.date + '</span></span>';
          html += '</div>';
          nodes.push({
            id: id,
            value: {
              label: html,
              className: className
            }
          });
          if (worker.inputQueue) {
            var label = worker.inputThroughput + '/s';
            edges.push({
              u: worker.inputQueue,
              v: id,
              value: { label: '<span>' + label + '</span>' }
            });
          }
        }
        var renderer = new dagreD3.Renderer();
        //var svg = d3.select( '#'+scope._id);
        var svg = d3.select('[id=\'' + scope._id + '\']');
        console.log('SVG ==>', svg);
        // Extend drawNodes function to set custom ID and class on nodes
        var oldDrawNodes = renderer.drawNodes();
        renderer.drawNodes(function (graph, root) {
          var svgNodes = oldDrawNodes(graph, root);
          svgNodes.attr('id', function (u) {
            return 'node-' + u;
          });
          svgNodes.attr('class', function (u) {
            return 'node ' + graph.node(u).className;
          });
          return svgNodes;
        });
        // Custom transition function
        function transition(selection) {
          return selection.transition().duration(500);
        }
        renderer.transition(transition);
        renderer.zoom(function (graph, svg) {
          return zoom.on('zoom', function () {
            svg.attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')');
          });
        });
        // Left-to-right layout
        var layout = dagreD3.layout().nodeSep(70).rankSep(120).rankDir('LR');
        var renderedLayout = renderer.layout(layout).run(dagreD3.json.decode(nodes, edges), d3.select('[id=\'' + scope._id + '\']').select('g'));
        // Zoom and scale to fit
        var zoomScale = zoom.scale();
        var graphWidth = renderedLayout.graph().width + 80;
        var graphHeight = renderedLayout.graph().height + 20;
        var width = parseInt(svg.style('width').replace(/px/, ''));
        var height = parseInt(svg.style('height').replace(/px/, ''));
        zoomScale = Math.min(width / graphWidth, height / graphHeight);
        var translate = [
            width / 2 - graphWidth * zoomScale / 2,
            height / 2 - graphHeight * zoomScale / 2
          ];
        zoom.translate(translate);
        zoom.scale(zoomScale);
        svg.transition().duration(500);
      };
      scope.drawGraph = function (workers) {
        scope.draw(false, workers);
      };
    }
  };
});'use strict';
var _ = window._;
var dc = window.dc;
var d3 = window.d3;
var crossfilter = window.crossfilter;
var dagreD3 = window.dagreD3;
//var minutesSince = window.minutesSince
// Users service used for communicating with the users REST endpoint
angular.module('events').service('EventService', [
  'Restangular',
  function (Restangular) {
    var sessionDuration = 15;
    //session de 15 mn ??
    return {
      getEvents: function (identity) {
        return Restangular.one('events', identity).get();
      },
      getSessions: function (events) {
        //1 trier par date
        var sortedEvents = _.sortBy(events, function (event) {
            return event.date;
          });
        //2 mapper events --> events avec delta date
        var deltaDateEvents = _.map(sortedEvents, function (event, index) {
            //le premier evenet
            if (index === 0) {
              event.deltaDate = 0;
            } else {
              var previousEvent = sortedEvents[index - 1];
              var deltaDateSd = new Date(event.date).getTime() - new Date(previousEvent.date).getTime();
              event.deltaDate = Date.create(event.date).minutesSince(Date.create(previousEvent.date));
            }
            return event;
          });
        //3 Itérer sur la liste
        var sessionNumber = 0;
        var sessionNumberEvents = _.each(deltaDateEvents, function (event, index) {
            //Si le delta est supérieure à la durée définie alors nouvelle session
            if (event.deltaDate >= sessionDuration) {
              sessionNumber++;
            }
            event.sessionNumber = sessionNumber;
          });
        //4 grouper par le numéro de session
        var sessions = _.groupBy(sessionNumberEvents, function (event) {
            return event.sessionNumber;
          });
        return sessions;
      }
    };
  }
]);'use strict';
// Setting up route
angular.module('metrics').config([
  '$stateProvider',
  function ($stateProvider) {
    // Projects state routing
    $stateProvider.state('listMetrics', {
      url: '/projects/:projectkey/metrics',
      templateUrl: 'modules/metrics/views/list-metrics.client.view.html'
    }).state('createMetric', {
      url: '/projects/:projectkey/metrics/create',
      templateUrl: 'modules/metrics/views/create-metric.client.view.html'
    });
  }
]);'use strict';
var PUBNUB = window.PUBNUB;
var Events = window.Events;
angular.module('metrics').controller('MetricsController', [
  '$scope',
  '$rootScope',
  '$stateParams',
  '$location',
  'Authentication',
  'MetricService',
  'UsersettingService',
  'ProjectService',
  function ($scope, $rootScope, $stateParams, $location, Authentication, MetricService, UsersettingService, ProjectService) {
    $scope.authentication = Authentication;
    var pubnub = PUBNUB.init({
        publish_key: 'pub-c-ddc60605-57f5-4267-b32a-93af942c9438',
        subscribe_key: 'sub-c-e66141da-5a29-11e4-bd8e-02ee2ddab7fe'
      });
    $scope.autocomplete = function () {
      ProjectService.getProject($stateParams.projectkey).then(function (project) {
        $scope.project = project;
        UsersettingService.getUserSettingsKey($scope.project.key).then(function (userkeys) {
          $scope.filters = $scope.select = $scope.charts = $scope.KeysUs = UsersettingService.mergeKey(userkeys);
        });
      });
    };
    $scope.create = function () {
      var metric = {
          title: this.title,
          projectkey: $stateParams.projectkey,
          selects: this.select,
          filters: this.filters,
          aggregations: this.charts
        };
      MetricService.saveMetric(metric, $stateParams.projectkey).then(function () {
        $location.path('projects/metrics');
      });
    };
    $scope.update = function () {
      var metric = $scope.metric;
      MetricService.updateMetric(metric).then(function () {
        $location.path('projects/metrics');
      });
    };
    $scope.find = function () {
      $rootScope.$broadcast(Events.LOADER_SHOW);
      $scope.projectId = $stateParams.projectkey;
      MetricService.getMetrics($stateParams.projectkey).then(function (metrics) {
        $scope.metrics = metrics;
        $rootScope.$broadcast(Events.LOADER_HIDE);
      });
    };
    $scope.analyse = function (KeysUs, select, filters, charts) {
      if (select === KeysUs)
        select = '';
      if (filters === KeysUs)
        filters = '';
      if (charts === KeysUs)
        charts = '';
      var aggregation = encodeURIComponent(charts).replace(/'/g, '%27').replace(/"/g, '%22');
      var aFilters = encodeURIComponent(filters).replace(/'/g, '%27').replace(/"/g, '%22');
      var data = {
          select: select,
          filters: aFilters,
          charts: aggregation,
          KeysUs: KeysUs
        };
      var projectkey = $stateParams.projectkey;
      MetricService.analyse(data, projectkey).then(function (response) {
        var jobId = response.result.jobId;
        console.log('jobId', jobId);
        pubnub.subscribe({
          channel: jobId,
          callback: function (message) {
            console.log('message subscribe jobId', jobId);
            $scope.getResultJob(jobId);
          }
        });
      });
    };
    $scope.getResultJob = function (jobId) {
      var projectkey = $stateParams.projectkey;
      MetricService.getResultJob(jobId, projectkey).then(function (response) {
        var results = JSON.parse(response.result);
        console.log('results', results);
        $scope.results = results;
      });
    };
  }
]);'use strict';
// Users service used for communicating with the users REST endpoint
angular.module('metrics').service('MetricService', [
  'Restangular',
  function (Restangular) {
    return {
      getMetrics: function (projectkey) {
        return Restangular.all('projects/' + projectkey + '/metrics').getList();
      },
      saveMetric: function (metric, projectkey) {
        return Restangular.all('projects/' + projectkey + '/metrics').post(metric);  //POST a new Metric
      },
      analyse: function (metric, projectkey) {
        return Restangular.all('projects/' + projectkey + '/analysis').post(metric);  //POST a new Metric
      },
      getResultJob: function (jobId, projectkey) {
        return Restangular.one('projects/' + projectkey + '/job', jobId).get();
      }
    };
  }
]);'use strict';
// Setting up route
angular.module('projects').config([
  '$stateProvider',
  function ($stateProvider) {
    // Projects state routing
    $stateProvider.state('listProjects', {
      url: '/projects',
      templateUrl: 'modules/projects/views/list-projects.client.view.html'
    }).state('createProject', {
      url: '/projects/create',
      templateUrl: 'modules/projects/views/create-project.client.view.html'
    }).state('Project', {
      url: '/:projectId/page',
      templateUrl: 'modules/projects/views/project-page.client.view.html'
    }).state('editProject', {
      url: '/projects/:projectId/edit',
      templateUrl: 'modules/projects/views/edit-project.client.view.html'
    });
  }
]);'use strict';
var Events = window.Events;
angular.module('projects').controller('ProjectsController', [
  '$scope',
  '$rootScope',
  '$stateParams',
  '$location',
  'Authentication',
  'ProjectService',
  function ($scope, $rootScope, $stateParams, $location, Authentication, ProjectService) {
    $scope.authentication = Authentication;
    $scope.projectId = $stateParams.projectId;
    $scope.create = function () {
      var project = {
          title: this.title,
          website: this.website,
          key: this.key
        };
      ProjectService.saveProject(project).then(function () {
        $location.path('projects');
      });
    };
    $scope.update = function () {
      var project = $scope.project;
      ProjectService.updateProject(project).then(function () {
        $location.path('projects');
      });
    };
    $scope.find = function () {
      $rootScope.$broadcast(Events.LOADER_SHOW);
      ProjectService.getProjects().then(function (projects) {
        $scope.projects = projects;
        $rootScope.$broadcast(Events.LOADER_HIDE);
      });
    };
    $scope.findOne = function () {
      ProjectService.getProject($stateParams.projectId).then(function (project) {
        $scope.project = project;
      });
    };
    $scope.edit = function (project) {
      $location.path('/projects/' + project._id + '/edit');
    };
    $scope.getColor = function (index) {
      console.log('getColor');
      var COLORS = [
          '#7761a7',
          '#19b698',
          '#3d566d',
          '#ea6153',
          '#001f3f',
          '#f012be'
        ];
      var colorSize = COLORS.length;
      return COLORS[index % colorSize];
    };
  }
]);'use strict';
angular.module('projects').directive('projectbox', function () {
  return {
    restrict: 'A',
    require: 'ngModel',
    templateUrl: 'modules/projects/directives/projectbox.client.view.html',
    controller: [
      '$scope',
      'Authentication',
      'Menus',
      function ($scope, Authentication, Menus) {
        $scope.authentication = Authentication;
      }
    ],
    link: function (scope, element, attrs, ngModel) {
      console.log('projectBox directive');
      //récupère la coulor via l'attribu color
      scope.bgColor = attrs.color;
      ngModel.$render = function () {
        //on récupère le model
        scope.project = ngModel.$viewValue;
      };
    }
  };
});'use strict';
// Users service used for communicating with the users REST endpoint
angular.module('projects').service('ProjectService', [
  'Restangular',
  function (Restangular) {
    return {
      getProjects: function () {
        return Restangular.all('projects').getList();  //GET api/projects
      },
      getProject: function (projectId) {
        // Just ONE GET to /api/projects/123
        return Restangular.one('projects', projectId).get();
      },
      saveProject: function (project) {
        return Restangular.all('projects').post(project);  //POST a new Project
      },
      updateProject: function (project) {
        return Restangular.one('projects').customPUT(project, project._id);
      }
    };
  }
]);'use strict';
// Config HTTP Error Handling
angular.module('users').config([
  '$httpProvider',
  function ($httpProvider) {
    // Set the httpProvider "not authorized" interceptor
    $httpProvider.interceptors.push([
      '$q',
      '$location',
      'Authentication',
      function ($q, $location, Authentication) {
        return {
          responseError: function (rejection) {
            switch (rejection.status) {
            case 401:
              // Deauthenticate the global user
              Authentication.user = null;
              // Redirect to signin page
              $location.path('signin');
              break;
            case 403:
              // Add unauthorized behaviour 
              break;
            }
            return $q.reject(rejection);
          }
        };
      }
    ]);
  }
]);'use strict';
// Setting up route
angular.module('users').config([
  '$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider.state('profile', {
      url: '/settings/profile',
      templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
    }).state('password', {
      url: '/settings/password',
      templateUrl: 'modules/users/views/settings/change-password.client.view.html'
    }).state('accounts', {
      url: '/settings/accounts',
      templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
    }).state('signup', {
      url: '/signup',
      templateUrl: 'modules/users/views/signup.client.view.html'
    }).state('signin', {
      url: '/signin',
      templateUrl: 'modules/users/views/signin.client.view.html'
    });
  }
]);'use strict';
angular.module('users').controller('AuthenticationController', [
  '$scope',
  '$http',
  '$location',
  'Authentication',
  function ($scope, $http, $location, Authentication) {
    $scope.authentication = Authentication;
    //If user is signed in then redirect back home
    if ($scope.authentication.user)
      $location.path('/');
    $scope.signup = function () {
      $http.post('/auth/signup', $scope.credentials).success(function (response) {
        //If successful we assign the response to the global user model
        $scope.authentication.user = response;
        //And redirect to the index page
        $location.path('/');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    $scope.signin = function () {
      $http.post('/auth/signin', $scope.credentials).success(function (response) {
        //If successful we assign the response to the global user model
        $scope.authentication.user = response;
        //And redirect to the index page
        $location.path('/');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
angular.module('users').controller('SettingsController', [
  '$scope',
  '$http',
  '$location',
  'Users',
  'Authentication',
  function ($scope, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user;
    // If user is not signed in then redirect back home
    if (!$scope.user)
      $location.path('/');
    // Check if there are additional accounts 
    $scope.hasConnectedAdditionalSocialAccounts = function (provider) {
      for (var i in $scope.user.additionalProvidersData) {
        return true;
      }
      return false;
    };
    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function (provider) {
      return $scope.user.provider === provider || $scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider];
    };
    // Remove a user social account
    $scope.removeUserSocialAccount = function (provider) {
      $scope.success = $scope.error = null;
      $http.delete('/users/accounts', { params: { provider: provider } }).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.user = Authentication.user = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    // Update a user profile
    $scope.updateUserProfile = function () {
      $scope.success = $scope.error = null;
      var user = new Users($scope.user);
      user.$update(function (response) {
        $scope.success = true;
        Authentication.user = response;
      }, function (response) {
        $scope.error = response.data.message;
      });
    };
    // Change user password
    $scope.changeUserPassword = function () {
      $scope.success = $scope.error = null;
      $http.post('/users/password', $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.passwordDetails = null;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
// Authentication service for user variables
angular.module('users').factory('Authentication', [function () {
    var _this = this;
    _this._data = { user: window.user };
    return _this._data;
  }]);'use strict';
// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', [
  '$resource',
  function ($resource) {
    return $resource('users', {}, { update: { method: 'PUT' } });
  }
]);'use strict';
// Setting up route
angular.module('usersettings').config([
  '$stateProvider',
  function ($stateProvider) {
    // Usersettings state routing
    $stateProvider.state('listUsersettings', {
      url: '/projects/:projectId/us',
      templateUrl: 'modules/usersettings/views/list-usersettings.client.view.html'
    });
  }
]);'use strict';
var _ = window._;
var dc = window.dc;
var d3 = window.d3;
var crossfilter = window.crossfilter;
var dagreD3 = window.dagreD3;
var Events = window.Events;
angular.module('usersettings').controller('UsersettingsController', [
  '$scope',
  '$rootScope',
  '$stateParams',
  '$location',
  'Authentication',
  'UsersettingService',
  'ProjectService',
  function ($scope, $rootScope, $stateParams, $location, Authentication, UsersettingService, ProjectService) {
    $scope.draw = function (data, keys) {
      var yearRingChart = dc.pieChart('#chart-ring-year'), spendHistChart = dc.barChart('#chart-hist-spend'), spenderRowChart = dc.rowChart('#chart-row-spenders');
      // use static or load via d3.csv("spendData.csv", function(error, spendData) {/* do stuff */});
      var spendData = data;
      var firstKey = keys[0];
      //DIM 1
      var secondKey = keys[1];
      //DIM 2
      var thirdKey = keys[2];
      //METRIC
      // normalize/parse data
      spendData.forEach(function (d) {
        d.Spent = d[thirdKey].match(/\d+/);
      });
      // set crossfilter
      var ndx = crossfilter(spendData), firstDim = ndx.dimension(function (d) {
          return d[firstKey];
        }), metricDim = ndx.dimension(function (d) {
          return Math.floor(d[thirdKey]);
        }), secondDim = ndx.dimension(function (d) {
          return d[secondKey];
        }), spendPerYear = firstDim.group().reduceSum(function (d) {
          return +d[thirdKey];
        }), spendPerName = secondDim.group().reduceSum(function (d) {
          return +d[thirdKey];
        }), spendHist = metricDim.group().reduceCount();
      yearRingChart.width(200).height(200).dimension(firstDim).group(spendPerYear).innerRadius(10);
      spendHistChart.width(300).height(200).dimension(metricDim).group(spendHist).x(d3.scale.linear().domain([
        0,
        20
      ])).elasticY(true);
      spendHistChart.xAxis().tickFormat(function (d) {
        return d;
      });
      // convert back to base unit
      spendHistChart.yAxis().ticks(2);
      spenderRowChart.width(350).height(200).dimension(secondDim).group(spendPerName).elasticX(true);
      dc.renderAll();
    };
    $scope.find = function () {
      $rootScope.$broadcast(Events.LOADER_SHOW);
      ProjectService.getProject($stateParams.projectId).then(function (project) {
        $scope.project = project;
        UsersettingService.getUserSettings(project.key).then(function (usersettings) {
          var service = UsersettingService, tableOfKeysUS = [];
          // on charge les service de usersetings
          $scope.usersettings = _.where(usersettings, { projectkey: $scope.project.key });
          //les usersetings du projet
          service.getUserSettingsKey($scope.project.key).then(function (userkeys) {
            console.log(userkeys);
            $scope.KeysUs = service.mergeKey(userkeys);
            $scope.keysintextarea = '';
            _.forEach($scope.KeysUs, function (key) {
              $scope.keysintextarea = $scope.keysintextarea + '@' + key + ' ';
              tableOfKeysUS.push(key);
            });
            $scope.keysintextarea2 = $scope.keysintextarea;  //$scope.draw(usersettings, ['identity', 'email', 'age'])
          });
          $scope.tableOfKeysUS = tableOfKeysUS;
          $scope.numberOfUsersettings = usersettings.length === 0;
          $scope.KeyOfThisProject = project.key;
          //$stateParams.projectId;
          $scope.projectId = $stateParams.projectId;
          $rootScope.$broadcast(Events.LOADER_HIDE);
        });
      });
    };
    $scope.extractkeysUS = function (keysInString, tableOfKeysUS) {
      var expReg = /@(\w*?)(?: |$)/gi;
      //je definis l'expression regulaire du textarea
      var resultat = keysInString.match(expReg);
      //je recupere les cle qui sont precedé de @
      resultat = _.map(resultat, function (keys) {
        return keys.slice(1);
      });
      //j'enleve les @ des cle recuperer
      resultat = _.map(resultat, function (keys) {
        return keys.trim();
      });
      //j'enleve les espace dans chaque element du tableau
      return _.intersection(resultat, tableOfKeysUS);  //je fais l'intersection entre le tableau extrait de textarea et le tableau de userkeys
    };
    $scope.gotoEvents = function (usersetting) {
      $location.path('/projects/' + $stateParams.projectId + '/events/' + usersetting.identity);
    };
  }
]);'use strict';
var _ = window._;
// Users service used for communicating with the users REST endpoint
angular.module('usersettings').service('UsersettingService', [
  'Restangular',
  function (Restangular) {
    return {
      getUserSettings: function (projectKey) {
        console.log('getUserSettings');
        return Restangular.one('projects', projectKey).all('usersettings').getList();  //return Restangular.all('usersettings').getList(); //GET api/usersettings
      },
      getUserSettingsKey: function (projectkey) {
        return Restangular.one('userkeys', projectkey).get();
      },
      getkeysOfObject: function (obj) {
        return Object.keys(obj);
      },
      notExisteInTwoTables: function (table1, table2, element) {
        return this.existeInTables(table1, element) === false && this.existeInTables(table2, element) === false;
      },
      existeInTables: function (table, element) {
        return _.indexOf(table, element) !== -1;
      },
      mergeKey: function (table) {
        var b = {};
        _.forEach(table, function (a) {
          b = _.union(b, a.keys);
        });
        return b;
      },
      convertStringOfUserKeysInTable: function (keystring) {
        /*convertire le string qui contient les userkeys en tableau de userkeys*/
        keystring = keystring.replace(/@/gi, '');
        //on eneleve les @
        var tableOfUserKeys = [],
          //c'est le tableau qui va contenire les userkeys
          tmp = '';
        //t est une chaine de caractere temporaire ou je vais stocké les userkeys avant de les pushé dans le tableau
        _.forEach(keystring, function (z) {
          //on parcour la chaine de caractere
          if (z === ' ') {
            // si le cractere courant est un whitespace alor on push le userkeys creer par la concatenation des caractere parcouru
            tableOfUserKeys.push(tmp);
            tmp = '';  // apre on le vide pour le prochain userkeys
          } else
            tmp = tmp + z;  //on fait la concatenation des caractere pour produire une chaine de caractere d'un userkeys
        });
      },
      delleteElementInTabelByIndex: function (table, index) {
        table.splice(index, 1);
      }
    };
  }
]);