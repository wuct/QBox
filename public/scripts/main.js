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

angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("about.html","<h1>\n	關於我們\n</h1>\n");
$templateCache.put("agent.html","<h1>加盟</h1>");
$templateCache.put("hello.html","<h1 class=\"cover-heading\">Cover your page.</h1>\n<p class=\"lead\">Cover is a one-page template for building simple and beautiful home pages. Download, edit the text, and add your own fullscreen background photo to make it your own.</p>\n<p class=\"lead\">\n  <a href=\"#\" class=\"btn btn-lg btn-default\">下載 App</a>\n</p>");}]);