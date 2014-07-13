// app.js
// wuct @ 2014.7.14

'use strict';

angular.module('app', [
	'ui.router',
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

})
.controller('layoutCtrl', ['$scope', function ($scope) {
	$scope.hi = 'world';
}])
