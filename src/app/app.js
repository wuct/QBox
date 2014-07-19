// app.js
// wuct @ 2014.7.14

'use strict';

angular.module('app', [
	'ui.router',
	'firebase',
	'angularify.semantic.dropdown',
	'templates'])
.config(function ($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/hello');
	$stateProvider
	.state('hello', {
		url: "/hello",
		templateUrl: "hello.html"
	})
	.state('about', {
		url: "/about",
		templateUrl: "about.html"
	})
	.state('agent', {
		url: "/agent",
		templateUrl: "agent.html"
	})
	.state('signup', {
		url: "/signup",
		templateUrl: "signup.html"
	})

})
.factory('UserService', ['$firebase', 
	function ($firebase) {
	return $firebase(new Firebase("https://q-box.firebaseio.com/anonymous_users"));
}])
.factory('AuthService', ['$firebaseSimpleLogin', 
	function ($firebaseSimpleLogin) {
	var auth = $firebaseSimpleLogin((new Firebase("https://q-box.firebaseio.com/")));
	return auth;
}])
.controller('layoutCtrl', ['$scope', function ($scope) {

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
		link: function (scope, iElement, iAttrs) {
			// init data
			scope.data = {
				type: 'customer',
			}	
		}
	};
}])
.directive('agentSignUpForm', [function (dropdown) {
	return {
		restrict: 'A',
		templateUrl: "agentSignUpForm.html",
		controller: 'formCtrl as formCtrl',
		link: function (scope, iElement, iAttrs) {
			// init data
			scope.data = {
				type: 'agent',
				vehicle: '汽車'
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
		}, function error (httpRes) {
			self.state = 'error';
			console.log(httpRes);
		});
	};
}])