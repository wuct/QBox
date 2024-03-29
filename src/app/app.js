// app.js
// wuct @ 2014.7.14

'use strict';

angular.module('app', [
	'ui.router',
	'duScroll',
	'firebase',
	'angularify.semantic.dropdown',
	'templates'])
.config(function ($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/');
	$stateProvider
	// .state('about', {
	// 	url: "/about",
	// 	templateUrl: "about.html"
	// })
	.state('agent', {
		url: "/agent",
		templateUrl: "agent.html"
	})
	.state('main', {
		url: '/',
	})
	// 	.state('main.hello', {
	// 		url: "/hello",
	// 		// templateUrl: "hello.html"
	// 	})
	// .state('signup?type', {
	// 	url: "/signup",
	// 	templateUrl: "signup.html"
	// })

})
.run([
	'$rootScope', 
	'$location',
	'$document',
	'$timeout',
	function ($rootScope, $location, $document, $timeout) {

	$rootScope.$on('$stateChangeSuccess', function(event, toState) {
		// console.log(toState.url);
        ga('send', 'pageview', toState.url);
	});
    $rootScope.$on('duScrollspy:becameActive', function($event, $element){
		var hash = $element.prop('hash').substr(1);
		// console.log('spy:active', hash)
        ga('send', 'pageview', hash);
    });
    // $rootScope.$on('duScrollspy:becameInactive', function($event, $element){
    // 	console.log('inactice')
    // });
    // wait dom ready, for init route
	var initPath = $location.path();
    // $timeout(function() {
    // 	if (['agent', 'about'].indexOf(initPath.substr(1)) === -1) return; // only scroll to this 2 page
    // 	var someElement = angular.element(document.getElementById(initPath.substr(1)));
	   //  $document.scrollToElement(someElement[0], 0, 600);
    // }, 500); 

}])
.factory('UserService', ['$firebase', 
	function ($firebase) {
	return $firebase(new Firebase("https://q-box.firebaseio.com/anonymous_users"));
}])
.factory('AuthService', ['$firebaseSimpleLogin', 
	function ($firebaseSimpleLogin) {
	var auth = $firebaseSimpleLogin((new Firebase("https://q-box.firebaseio.com/")));
	return auth;
}])

// util directive
.directive('dynamicBackground', [function () {
	return {
		restrict: 'A',
		link: function (scope, iElement, iAttrs) {
			scope.$on('duScrollspy:becameInactive', function() {
				iElement.addClass('inactive');
				iElement.removeClass('hide');
			});
			scope.$on('duScrollspy:becameActive', function($event, $element) {
				iElement.removeClass('inactive');
				var hash = $element.prop('hash').substr(1);
				var needHide = ['signup', 'signupAgent'].indexOf(hash) !== -1;
				if (needHide) {
					iElement.addClass('hide');
				} else {
					iElement.removeClass('hide');
				}
			});
		}
	};
}])
.directive('setToScreenHeight', [function () {
	return {
		restrict: 'A',
		link: function (scope, iElement, iAttrs) {
			var w = window,
		    d = document,
		    e = d.documentElement,
		    g = d.getElementsByTagName('body')[0],
		    // x = w.innerWidth || e.clientWidth || g.clientWidth,
		    y = w.innerHeight|| e.clientHeight|| g.clientHeight;
		    y = y < 400
		    	? 400
		    	: y > 800
		    		? 800 * 0.9
		    		: y * 0.9;
		    iElement.css('height', y + 'px');
		    
		    // if user-agent is not mobile device
		    if(typeof window.orientation === 'undefined'){
		    	iElement.css('background-attachment', 'fixed');
		    }
		}
	};
}])
.directive('successMessage', [function () {
	return {
		restrict: 'A',
		templateUrl: 'successMessage.html'
	};
}])
.directive('errorMessage', [function () {
	return {
		restrict: 'A',
		templateUrl: 'errorMessage.html'
	};
}])
.directive('signUpForm', [function () {
	return {
		restrict: 'A',
		templateUrl: "signUpForm.html",
		controller: 'formCtrl as formCtrl',
		scope: {},
		link: function (scope, iElement, iAttrs) {
			// init data
			scope.data = {
				type: 'customer',
				createdAt: new Date()
			}	
		}
	};
}])
.directive('agentSignUpForm', [function (dropdown) {
	return {
		restrict: 'A',
		templateUrl: "agentSignUpForm.html",
		controller: 'formCtrl as formCtrl',
		scope: {},
		link: function (scope, iElement, iAttrs) {
			// init data
			scope.data = {
				type: 'agent',
				vehicle: '汽車',
				createdAt: new Date()
			}
		}
	};
}])
.controller('formCtrl', ['$scope', 'UserService', 'AuthService',
	function($scope, UserService, AuthService) {
	$scope.auth = AuthService;

	var self = this;
	this.state = 'normal'; // updating, success, error;

	$scope.submit = function(data, form) {
		// check form
		angular.forEach(form, function  (val) {
			if ('object' === typeof val) val.$dirty = true;	
		})
		if (form.$invalid) return;

		self.state = 'updating';

		AuthService.$login('anonymous')
		.then(function success (user) {
			return UserService.$child(user.uid).$update(data);
		}, function error (httpRes) {
			self.state = 'error';
			console.log(httpRes);
		})
		.then(function updateDataSuccess () {
			self.state = 'success';
			AuthService.$logout();
			ga('send', 'pageview', '/conversion/signup/' + data.type);
		}, function error (httpRes) {
			self.state = 'error';
			console.log(httpRes);
		});
	};
}])