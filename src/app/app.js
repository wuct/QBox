// app.js
// wuct @ 2014.7.14

'use strict';

angular.module('app', [])
.controller('indexCtrl', ['$scope', function ($scope) {
	$scope.hi = 'world';
}])