// app.js
// wuct @ 2014.7.14

'use strict';

angular.module('app', [
	// 'ui.router',
	'duScroll',
	'firebase',
	'angularify.semantic.dropdown',
	'templates'])
// .config(function ($stateProvider, $urlRouterProvider) {
	// $urlRouterProvider.otherwise('/');
	// $stateProvider
	// .state('about', {
	// 	url: "/about",
	// 	templateUrl: "about.html"
	// })
	// .state('agent', {
	// 	url: "/agent",
	// 	templateUrl: "agent.html"
	// })
	// .state('main', {
	// 	url: '',
	// 	templateUrl: "main.html"
	// })
	// 	.state('main.hello', {
	// 		url: "/hello",
	// 		// templateUrl: "hello.html"
	// 	})
	// .state('signup?type', {
	// 	url: "/signup",
	// 	templateUrl: "signup.html"
	// })

// })
.run([
	'$rootScope', 
	'$location',
	'$document',
	'$timeout',
	function ($rootScope, $location, $document, $timeout) {
    $rootScope.$on('duScrollspy:becameActive', function($event, $element){
		var hash = $element.prop('hash').substr(1);
		$location.path(hash);
        ga('send', 'pageview', hash);
    });
    $rootScope.$on('duScrollspy:becameInactive', function($event, $element){
    	// console.log('inactice')
    });
    // wait dom ready, for init route
	var initPath = $location.path();
    $timeout(function() {
    	if (['agent', 'about'].indexOf(initPath.substr(1)) === -1) return; // only scroll to this 2 page
    	var someElement = angular.element(document.getElementById(initPath.substr(1)));
	    $document.scrollToElement(someElement[0], 0, 600);
    }, 500); 

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
angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("agentSignUpForm.html","<h3 class=\"ui center aligned disabled header\"\n  style=\"margin-bottom:30px;\">現在就填寫申請表，我們會儘速聯繫您。</h3>\n<p class=\"text-center privacy\" >\n  您的資料將僅供 <span class=\"logo\">QBox</span> 使用，不會對外散播。\n  <a href=\"http://goo.gl/nMvosg\">\n    隱私政策\n  </a>\n</p> \n\n<div success-message\n   ng-show=\"\'success\' === formCtrl.state\"></div>\n\n<div class=\"ui form\" ng-form name=\"agentForm\"\n  ng-hide=\"\'success\' === formCtrl.state\"\n  ng-class=\"{\'loading\': \'updating\' === formCtrl.state }\">\n  <div class=\"field\"\n    ng-class=\"{\'error\': agentForm.email.$dirty && agentForm.email.$invalid}\">\n    <label>*Email</label>\n    <div class=\"ui input\">\n      <input type=\"email\" ng-model=\"data.email\" name=\"email\" required>\n      <div ng-show=\"agentForm.email.$dirty && agentForm.email.$invalid\"\n        class=\"ui red pointing above ui label\">請輸入 email</div>\n    </div>\n  </div>\n  <div class=\"field\"\n    ng-class=\"{\'error\': agentForm.zip.$dirty && agentForm.zip.$invalid}\">\n    <label>*郵遞區號</label>\n    <div class=\"ui input\">\n      <input type=\"text\" ng-model=\"data.zip\" name=\"zip\" required>\n      <div ng-show=\"agentForm.zip.$dirty && agentForm.zip.$invalid\"\n        class=\"ui red pointing above ui label\">請輸入郵遞區號</div>\n    </div>\n  </div>\n  <div class=\"field\"\n    ng-class=\"{\'error\': agentForm.phone.$dirty && agentForm.phone.$invalid}\">\n    <label>*手機號碼</label>\n    <div class=\"ui input\">\n      <input type=\"text\" ng-model=\"data.phone\" name=\"phone\" required>\n      <div ng-show=\"agentForm.phone.$dirty && agentForm.phone.$invalid\"\n        class=\"ui red pointing above ui label\">請輸入手機號碼</div>\n    </div>\n  </div>\n  <div class=\"field\">\n    <label>*您的交通工具是</label>\n    <dropdown class=\"dropdown\" ng-model=\"data.vehicle\" open=\"false\" required>\n      <dropdown-group>汽車</dropdown-group>\n      <dropdown-group>貨車</dropdown-group>\n      <dropdown-group>單車</dropdown-group>\n      <dropdown-group>機車</dropdown-group>\n      <dropdown-group>其他</dropdown-group>\n    </dropdown>\n  </div>\n  <div class=\"field\">\n    <label>留言（選填）</label>\n    <textarea ng-model=\"data.note\"></textarea>\n  </div>\n  <div class=\"field text-center\">\n    <div class=\"ui blue huge button\"\n      ng-click=\"submit(data, agentForm)\">成為 QBox 物流士</div>\n  </div>\n</div><!--  END: ui form -->\n\n<div error-message ng-show=\"\'error\' === formCtrl.state\"></div>");
$templateCache.put("errorMessage.html","\n<div class=\"ui huge red message\"\n  ng-show=\"\'error\' === formCtrl.state\"\n  style=\"text-align: center;\">\n  <div class=\"header\">無法送出</div>\n  請重新整理或稍後再試\n</div>");
$templateCache.put("signUpForm.html","<h2 class=\"text-center\" \n  style=\"margin-bottom:30px;\">取得獨家 App 下載邀請</h2>\n\n<p class=\"text-center privacy\" >\n  您的資料將僅供 <span class=\"logo\">QBox</span> 使用，不會對外散播。\n  <a href=\"http://goo.gl/nMvosg\">\n    隱私政策\n  </a>\n</p> \n\n<div success-message\n   ng-show=\"\'success\' === formCtrl.state\"></div>\n\n\n<div class=\"ui form\" ng-form name=\"customerForm\"\n  ng-hide=\"\'success\' === formCtrl.state\"\n  ng-class=\"{\'loading\': \'updating\' === formCtrl.state }\">\n  <div class=\"field\"\n    ng-class=\"{\'error\': customerForm.email.$dirty && customerForm.email.$invalid}\">\n    <label>*Email</label>\n    <div class=\"ui input\">\n      <input type=\"email\" ng-model=\"data.email\" name=\"email\" required>\n      <div ng-show=\"customerForm.email.$dirty && customerForm.email.$invalid\"\n        class=\"ui red pointing above ui label\">請輸入 email</div>\n    </div>\n  </div>\n  <div class=\"field\"\n    ng-class=\"{\'error\': customerForm.zip.$dirty && customerForm.zip.$invalid}\">\n    <label>*郵遞區號</label>\n    <div class=\"ui input\">\n      <input type=\"text\" ng-model=\"data.zip\" name=\"zip\" required>\n      <div ng-show=\"customerForm.zip.$dirty && customerForm.zip.$invalid\"\n        class=\"ui red pointing above ui label\">請輸入郵遞區號</div>\n    </div>\n  </div>\n  <div class=\"field\"\n    ng-class=\"{\'error\': customerForm.phone.$dirty && customerForm.phone.$invalid}\">\n    <label>*手機號碼</label>\n    <div class=\"ui input\">\n      <input type=\"text\" ng-model=\"data.phone\" name=\"phone\" required>\n      <div ng-show=\"customerForm.phone.$dirty && customerForm.phone.$invalid\"\n        class=\"ui red pointing above ui label\">請輸入手機號碼</div>\n    </div>\n  </div>\n  <!-- <div class=\"field\">\n    <label>*您的包裹類型</label>\n    <dropdown class=\"dropdown\" ng-model=\"data.boxType\" open=\"false\" required>\n      <dropdown-group>大</dropdown-group>\n      <dropdown-group>中</dropdown-group>\n      <dropdown-group>小</dropdown-group>\n    </dropdown>\n  </div> -->\n  <div class=\"field\">\n    <label>留言（選填）</label>\n    <textarea ng-model=\"data.note\"></textarea>\n  </div>\n  <div class=\"field text-center\">\n    <div class=\"ui blue huge button\"\n      ng-click=\"submit(data, customerForm)\">送出</div>\n  </div>\n</div><!--  END: ui form -->\n\n\n<div error-message ng-show=\"\'error\' === formCtrl.state\"></div>");
$templateCache.put("signup.html","<div class=\"three column doubling ui grid\">\n  <div class=\"column\"></div>\n  <div class=\"column\">\n    <h2 class=\"ui center aligned black header\">\n      現在就註冊\n    </h2>\n\n    <div class=\"ui horizontal divider\">\n      <i class=\"fa fa-bolt fa-3x\"></i>\n    </div>\n\n    <div sign-up-form></div>\n  </div>\n  <div class=\"column\"></div>\n</div>");
$templateCache.put("successMessage.html","\n<div class=\"ui huge green message\"\n  style=\"text-align: center;\">\n  <div class=\"header\"\n    style=\"margin:30px 0;\">謝謝您！</div>\n  把 Qbox 告訴您的朋友\n  <div style=\"text-align: center; margin:30px 0;\">\n    <a class=\"ui small button\"\n    href=\"mailto:?subject=你有聽過%20Qbox%20嗎？&amp;body=嗨%0A我剛看到了這個%20App，超酷的！%20http%3A%2F%2Fq-box.co\" target=\"_blank\"> <i class=\"fa fa-envelope\"></i> Email\n    </a>\n    <a class=\"ui twitter small button\"\n      href=\"https://twitter.com/intent/tweet?text=寄東西原來可以如此簡單+%40qboxapp+%23共享經濟\" target=\"_blank\">\n      <i class=\"fa fa-twitter\"></i> 推文\n    </a>\n    <a class=\"ui facebook small button\"\n      href=\"https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fq-box.co\" target=\"_blank\">\n      <i class=\"fa fa-facebook\"></i> 分享\n    </a>\n  </div>\n</div>");}]);