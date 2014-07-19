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
.run(['$rootScope', '$location',
	function ($rootScope, $location) {
    $rootScope.$on('$stateChangeSuccess', function(){
        ga('send', 'pageview', $location.path());
    });
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
angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("about.html","<div class=\"marketingWrap\">\n	<div class=\"ui page grid\">\n		<div class=\"ui center aligned column\">\n			<h1 class=\"ui black header\"\n				style=\"margin:40px 0;\">\n				關於我們\n			</h1>\n			<div class=\"ui horizontal bigMargin divider\">\n				<i class=\"fa fa-bolt fa-3x\"></i>\n			</div>\n			<p>\n				在 Qbox，我們喜歡讓事情簡單無比<br>\n				我們提供的物流服務讓您節省時間與金錢\n			</p>\n		</div>\n	</div>\n\n	<div class=\"ui three column bigMargin stackable page grid\">\n		<div class=\"center aligned column\">\n			<div>\n				<i class=\"fa fa-rocket big style\"></i>\n			</div>\n			<h2 class=\"ui black header\">快速取件</h2>\n			<p>您送出需求單後，我們會在數分鐘內抵達您的位置向您取件</p>\n		</div>\n		<div class=\"center aligned column\">\n			<div>\n				<i class=\"fa fa-check-square-o big style\"></i>\n			</div>\n			<h2 class=\"ui black header\">值得信賴</h2>\n			<p>我們有專業包裝技術，並且只和嚴格篩選的物流夥伴合作</p>\n		</div>\n		<div class=\"center aligned column\">\n			<div>\n				<i class=\"fa fa-btc big style\"></i>\n			</div>\n			<h2 class=\"ui black header\">降低成本</h2>\n			<p>我們的演算法會幫您找到最適合的運送方式，降低您的運送成本</p>\n		</div>\n	</div> <!-- END: three column -->\n\n	<div class=\"ui two column bigMargin grid\">\n		<div class=\"equal height row\">\n			<div class=\"right aligned color column\">\n				<h1 class=\"ui header\">個人</h1>\n					<p class=\"breakLine\">\n						我們提供您一個全新的寄送方式。您無需再花時間研究<br>\n						複雜的郵資費率與包裝規定，無論包裹大小、<br>\n						寄送地點，Qbox 都幫您搞定<br>\n					</p>\n			</div>\n			<div class=\"left aligned color column\">\n				<h1 class=\"ui header\">商家</h1>\n					<p class=\"breakLine\">\n						我們幫助您用全新的方式與顧客互動。把繁瑣的包裝與<br>\n						物流交給 Qbox，您可以節省時間、運費，更可以<br>\n						全心專注在銷售商品、創造價值<br>\n					</p>\n			</div>\n		</div>\n	</div>\n\n	<div class=\"ui page grid\">\n		<div class=\"ui center aligned column\">\n			<h1 class=\"ui black header\"\n				style=\"margin:40px 0;\">\n				回饋方案\n			</h1>\n			<div class=\"ui horizontal bigMargin divider\">\n				<i class=\"fa fa-bolt fa-3x\"></i>\n			</div>\n			<p>\n				我們相信只要能連結彼此，什麼事情都可能發生。以下是我們的常客回饋方案\n			</p>\n		</div>\n	</div>\n	<div class=\"ui page grid\">\n		<div class=\"row\">\n			<div class=\"five wide center aligned column\">\n				<div class=\"ui blue attached segment\">\n					<div class=\"ui horizontal divider\">\n						<i class=\"fa fa-bolt fa-2x\" style=\"color:#BEBEBE;\"></i>\n					</div>\n					<h3 class=\"ui black header\">尊榮用戶</h3>\n					（每月 1+ 次）\n					<div class=\"ui list\" style=\"margin-top:20px;\">\n						<div class=\"item\">隨時取件</div>\n						<div class=\"item\">免費專業包裝</div>\n						<div class=\"item\">優惠價格</div>\n					</div>\n					<div class=\"ui divider\"></div>\n					<div style=\"margin: 40px 0 20px 0;\">\n						-\n					</div>\n				</div>\n				<a class=\"bottom attached ui blue button\"\n					ui-sref=\"^.signup\">\n					下載 App\n				</a>\n			</div>\n			<div class=\"six wide center aligned column\">\n				<div class=\"ui blue inverted attached segment\">\n					<div class=\"ui horizontal divider\">\n						<i class=\"fa fa-bolt fa-2x\" style=\"color:#fff;\"></i>\n					</div>\n					<h2 class=\"ui header\">企業客戶</h2>\n					（每月 250+ 次）\n					<div class=\"ui list\" style=\"margin-top:20px;\">\n						<div class=\"item\">免費隨時取件</div>\n						<div class=\"item\">免費專業包裝</div>\n						<div class=\"item\">API 整合</div>\n						<div class=\"item\">進階分析</div>\n						<div class=\"item\">客製化服務</div>\n						<div class=\"item\">專屬客戶專員</div>\n						<div class=\"item\">優先支援</div>\n					</div>\n					<div class=\"ui divider\"></div>\n					<h3 class=\"ui header\" style=\"margin: 40px 0 20px 0;\">\n						9 折以上\n					</h3>\n				</div>\n				<a class=\"bottom attached ui massive button\"\n					style=\"background-color:#119DD3;color:#ffffff;\"\n					href=\"mailto:service@q-box.co\">\n					聯絡我們\n				</a>\n			</div>\n			<div class=\"five wide center aligned column\">\n				<div class=\"ui blue attached segment\">\n					<div class=\"ui horizontal divider\">\n						<i class=\"fa fa-bolt fa-2x\" style=\"color:#BEBEBE;\"></i>\n					</div>\n					<h3 class=\"ui black header\">精英用戶</h3>\n					（每月 25+ 次）\n					<div class=\"ui list\" style=\"margin-top:20px;\">\n						<div class=\"item\">免費隨時取件</div>\n						<div class=\"item\">免費專業包裝</div>\n						<div class=\"item\">優先支援</div>\n					</div>\n					<div class=\"ui divider\"></div>\n					<h3 class=\"ui header\" style=\"margin: 40px 0 20px 0;\">\n						9 折\n					</h3>\n				</div>\n				<a class=\"bottom attached ui blue button\"\n					ui-sref=\"^.signup\">\n					下載 App\n				</a>\n			</div>\n		</div>\n	</div>\n\n	<div class=\"ui page grid\" style=\"margin-top:100px;\">\n		<div class=\"ui center aligned column\">\n			<h1 class=\"ui black header\"\n				style=\"margin:40px 0;\">\n				寄送項目\n			</h1>\n			<div class=\"ui horizontal bigMargin divider\">\n				<i class=\"fa fa-bolt fa-3x\"></i>\n			</div>\n			<p>\n				無論大件小件，我們都幫您處理。\n			</p>\n		</div>\n	</div>\n\n	<div class=\"ui two column divided grid\">\n		<div class=\"equal height row\">\n			<div class=\"right aligned column\">\n				<h1 class=\"ui black header\">小件</h1>\n					<p class=\"breakLine\">\n						資料袋、小包裹、中包裹、大包裹，我們都<br>\n						可以為您到場取貨、包裝、運送，<br>\n						只要您拍照上傳<br>\n					</p>\n			</div>\n			<div class=\"left aligned column\">\n				<h1 class=\"ui black header\">大件</h1>\n					<p class=\"breakLine\">\n						我們也提供大件物品運送服務。如果您想寄送<br>\n						大型電器或傢俱，請聯繫我們<br>\n						了解更多細節<br>\n					</p>\n			</div>\n		</div>\n	</div>\n\n	<div class=\"ui page bigMargin grid\">\n		<div class=\"column\">\n			<h2 class=\"ui center aligned black header\"\n				style=\"margin:40px 0;\">\n			  	現在就註冊\n			</h2>\n			<div class=\"ui horizontal bigMargin divider\">\n				<i class=\"fa fa-bolt fa-3x\"></i>\n			</div>\n			<div class=\"ui three column doubling grid\">\n				<div class=\"column\"></div>\n				<div class=\"column\">\n					<div sign-up-form></div>\n				</div>\n				<div class=\"column\"></div>\n			</div>\n		</div>\n	</div>\n</div>");
$templateCache.put("agent.html","<div class=\"marketingWrap\">\n	<div class=\"ui page grid\">\n		<div class=\"ui center aligned column\">\n			<h1 class=\"ui black header\"\n				style=\"margin:40px 0;\">\n				成為<br>Qbox 夥伴\n			</h1>\n			<div class=\"ui horizontal bigMargin divider\">\n				<i class=\"fa fa-bolt fa-3x\"></i>\n			</div>\n			<p>\n				我們與物流公司、個人業者甚至通勤族合作。不論您的規模與形式，<br>\n				都歡迎您加入 Qbox 平台，接觸新市場，擴展您事業！\n			</p>\n		</div>\n	</div>\n\n	<div class=\"ui three column bigMargin stackable page grid\">\n		<div class=\"center aligned column\">\n			<div>\n				<i class=\"fa fa-file-text-o big style\"></i>\n			</div>\n			<h2 class=\"ui black header\">自訂條件</h2>\n			<p>您可以在任何時間接您想接的案子，條件由您決定</p>\n		</div>\n		<div class=\"center aligned column\">\n			<div>\n				<i class=\"fa fa-truck big style\"></i>\n			</div>\n			<h2 class=\"ui black header\">不限車種</h2>\n			<p>\n				只要能確保安全，您可以用單車、機車、轎車、貨車或其他任何交通工具\n			</p>\n		</div>\n		<div class=\"center aligned column\">\n			<div>\n				<i class=\"fa fa-dollar big style\"></i>\n			</div>\n			<h2 class=\"ui black header\">賺取收入</h2>\n			<p>加入 Qbox 讓您輕鬆、彈性地賺取額外收入</p>\n		</div>\n\n		<h1 class=\"ui center aligned black header\"\n			style=\"margin-top:80px;\">成為 Qbox 物流夥伴</h1>\n		<div class=\"ui horizontal divider\">\n			<i class=\"fa fa-bolt fa-3x\"></i>\n		</div>\n	</div> <!-- END: three column -->\n\n	<div class=\"ui three column doubling grid\">\n		<div class=\"column\"></div>\n		<div class=\"column\">\n			<div agent-sign-up-form></div>\n		</div>\n		<div class=\"column\"></div>\n	</div>\n</div>");
$templateCache.put("agentSignUpForm.html","<h3 class=\"ui center aligned disabled header\"\n  style=\"margin-bottom:30px;\">現在就填寫申請表，我們會儘速聯繫您。</h3>\n\n<div success-message\n   ng-show=\"\'success\' === formCtrl.state\"></div>\n\n<div class=\"ui form\" ng-form name=\"agentForm\"\n  ng-hide=\"\'success\' === formCtrl.state\"\n  ng-class=\"{\'loading\': \'updating\' === formCtrl.state }\">\n  <div class=\"field\"\n    ng-class=\"{\'error\': agentForm.email.$dirty && agentForm.email.$invalid}\">\n    <label>*Email</label>\n    <div class=\"ui input\">\n      <input type=\"email\" ng-model=\"data.email\" name=\"email\" required>\n      <div ng-show=\"agentForm.email.$dirty && agentForm.email.$invalid\"\n        class=\"ui red pointing above ui label\">請輸入 email</div>\n    </div>\n  </div>\n  <div class=\"field\"\n    ng-class=\"{\'error\': agentForm.zip.$dirty && agentForm.zip.$invalid}\">\n    <label>*郵遞區號</label>\n    <div class=\"ui input\">\n      <input type=\"text\" ng-model=\"data.zip\" name=\"zip\" required>\n      <div ng-show=\"agentForm.zip.$dirty && agentForm.zip.$invalid\"\n        class=\"ui red pointing above ui label\">請輸入郵遞區號</div>\n    </div>\n  </div>\n  <div class=\"field\"\n    ng-class=\"{\'error\': agentForm.phone.$dirty && agentForm.phone.$invalid}\">\n    <label>*手機號碼</label>\n    <div class=\"ui input\">\n      <input type=\"text\" ng-model=\"data.phone\" name=\"phone\" required>\n      <div ng-show=\"agentForm.phone.$dirty && agentForm.phone.$invalid\"\n        class=\"ui red pointing above ui label\">請輸入手機號碼</div>\n    </div>\n  </div>\n  <div class=\"field\">\n    <label>*您的交通工具是</label>\n    <dropdown class=\"dropdown\" ng-model=\"data.vehicle\" open=\"false\" required>\n      <dropdown-group>汽車</dropdown-group>\n      <dropdown-group>貨車</dropdown-group>\n      <dropdown-group>單車</dropdown-group>\n      <dropdown-group>機車</dropdown-group>\n      <dropdown-group>其他</dropdown-group>\n    </dropdown>\n  </div>\n  <div class=\"field\">\n    <label>留言（選填）</label>\n    <textarea ng-model=\"data.note\"></textarea>\n  </div>\n  <div class=\"field text-center\">\n    <div class=\"ui blue button\"\n      ng-click=\"submit(data, agentForm)\">送出</div>\n  </div>\n</div><!--  END: ui form -->\n\n<div error-message ng-show=\"\'error\' === formCtrl.state\"></div>");
$templateCache.put("errorMessage.html","\n<div class=\"ui huge red message\"\n  ng-show=\"\'error\' === formCtrl.state\"\n  style=\"text-align: center;\">\n  <div class=\"header\">無法送出</div>\n  請重新整理或稍後再試\n</div>");
$templateCache.put("hello.html","<div class=\"marketingWrap\">\n	<div class=\"ui page bigMargin grid\">\n		<div class=\"row\" style=\"margin:100px 0;\">\n			<div class=\"ui center aligned column\">\n				<h2 class=\"ui black header\">\n					Qbox\n				</h2>\n				<h3 class=\"ui black header\">\n					寄東西原來可以如此簡單\n				</h3>\n				<a ui-sref=\"^.signup\" class=\"ui large blue button\">下載 App</a>\n			</div>\n		</div>\n\n		<div class=\"row\">\n			<div class=\"center aligned column\">\n				<h2 class=\"ui black header\">\n					如何運作\n				</h2>\n				<div class=\"ui horizontal bigMargin divider\">\n					<i class=\"fa fa-bolt fa-3x\"></i>\n				</div>\n\n				<div class=\"ui three column bigMargin stackable grid\">\n					<div class=\"center aligned column\">\n						<div>\n							<i class=\"fa fa-mobile big style\"></i>\n						</div>\n						<h2 class=\"ui black header\">拍照上傳</h2>\n						<p>拍下任何你想要寄送的物品，上傳照片並且告訴我們您要寄到哪</p>\n					</div>\n					<div class=\"center aligned column\">\n						<div>\n							<i class=\"fa fa-truck big style\"></i>\n						</div>\n						<h2 class=\"ui black header\">放鬆等待</h2>\n						<p>喝杯水休息一下，Qbox 會在數分鐘後抵達您的位置向您取件</p>\n					</div>\n					<div class=\"center aligned column\">\n						<div>\n							<i class=\"fa fa-heart big style\"></i>\n						</div>\n						<h2 class=\"ui black header\">安心託付</h2>\n						<p>\n							專業包裝就交給我們，我們細心包裝您的物品，並幫您寄送到任何地方\n						</p>\n					</div>\n				</div> <!-- END: three column -->\n\n				<a ui-sref=\"^.signup\" class=\"ui large blue button\">下載 App</a>\n			</div>\n		</div>\n	</div>\n\n	<div class=\"ui two column bigMargin grid\">\n	  <div class=\"equal height row\">\n	    <div class=\"right aligned color column\">\n	    	<h1 class=\"ui header\">個人</h1>\n				<p class=\"breakLine\">\n					我們提供您一個全新的寄送方式。您無需再花時間研究<br>\n					複雜的郵資費率與包裝規定，無論包裹大小、<br>\n					寄送地點，Qbox 都幫您搞定<br>\n				</p>\n	    </div>\n	    <div class=\"left aligned color column\">\n	    	<h1 class=\"ui header\">商家</h1>\n				<p class=\"breakLine\">\n					我們幫助您用全新的方式與顧客互動。把繁瑣的包裝與<br>\n					物流交給 Qbox，您可以節省時間、運費，更可以<br>\n					全心專注在銷售商品、創造價值<br>\n				</p>\n	    </div>\n	  </div>\n	</div>\n\n	<div class=\"ui page grid\">\n		<div class=\"column\">\n			<h2 class=\"ui center aligned black header\">\n		      立即註冊\n		    </h2>\n			<div class=\"ui horizontal bigMargin divider\">\n				<i class=\"fa fa-bolt fa-3x\"></i>\n			</div>\n			<div class=\"ui three column doubling grid\">\n				<div class=\"column\"></div>\n				<div class=\"column\">\n					<div sign-up-form></div>\n				</div>\n				<div class=\"column\"></div>\n			</div>\n		</div>\n	</div>\n\n</div>\n");
$templateCache.put("signUpForm.html","<h3 class=\"ui center aligned disabled header\"\n  style=\"margin-bottom:30px;\">取得獨家 App 下載邀請</h3>\n\n<div success-message\n   ng-show=\"\'success\' === formCtrl.state\"></div>\n\n\n<div class=\"ui form\" ng-form name=\"customerForm\"\n  ng-hide=\"\'success\' === formCtrl.state\"\n  ng-class=\"{\'loading\': \'updating\' === formCtrl.state }\">\n  <div class=\"field\"\n    ng-class=\"{\'error\': customerForm.email.$dirty && customerForm.email.$invalid}\">\n    <label>*Email</label>\n    <div class=\"ui input\">\n      <input type=\"email\" ng-model=\"data.email\" name=\"email\" required>\n      <div ng-show=\"customerForm.email.$dirty && customerForm.email.$invalid\"\n        class=\"ui red pointing above ui label\">請輸入 email</div>\n    </div>\n  </div>\n  <div class=\"field\"\n    ng-class=\"{\'error\': customerForm.zip.$dirty && customerForm.zip.$invalid}\">\n    <label>*郵遞區號</label>\n    <div class=\"ui input\">\n      <input type=\"text\" ng-model=\"data.zip\" name=\"zip\" required>\n      <div ng-show=\"customerForm.zip.$dirty && customerForm.zip.$invalid\"\n        class=\"ui red pointing above ui label\">請輸入郵遞區號</div>\n    </div>\n  </div>\n  <div class=\"field\"\n    ng-class=\"{\'error\': customerForm.phone.$dirty && customerForm.phone.$invalid}\">\n    <label>*手機號碼</label>\n    <div class=\"ui input\">\n      <input type=\"text\" ng-model=\"data.phone\" name=\"phone\" required>\n      <div ng-show=\"customerForm.phone.$dirty && customerForm.phone.$invalid\"\n        class=\"ui red pointing above ui label\">請輸入手機號碼</div>\n    </div>\n  </div>\n  <!-- <div class=\"field\">\n    <label>*您的包裹類型</label>\n    <dropdown class=\"dropdown\" ng-model=\"data.boxType\" open=\"false\" required>\n      <dropdown-group>大</dropdown-group>\n      <dropdown-group>中</dropdown-group>\n      <dropdown-group>小</dropdown-group>\n    </dropdown>\n  </div> -->\n  <div class=\"field\">\n    <label>留言（選填）</label>\n    <textarea ng-model=\"data.note\"></textarea>\n  </div>\n  <div class=\"field text-center\">\n    <div class=\"ui blue button\"\n      ng-click=\"submit(data, customerForm)\">送出</div>\n  </div>\n</div><!--  END: ui form -->\n\n\n<div error-message ng-show=\"\'error\' === formCtrl.state\"></div>");
$templateCache.put("signup.html","<div class=\"three column doubling ui grid\">\n  <div class=\"column\"></div>\n  <div class=\"column\">\n    <h2 class=\"ui center aligned black header\">\n      現在就註冊\n    </h2>\n\n    <div class=\"ui horizontal divider\">\n      <i class=\"fa fa-bolt fa-3x\"></i>\n    </div>\n\n    <div sign-up-form></div>\n  </div>\n  <div class=\"column\"></div>\n</div>");
$templateCache.put("successMessage.html","\n<div class=\"ui huge green message\"\n  style=\"text-align: center;\">\n  <div class=\"header\"\n    style=\"margin:30px 0;\">謝謝您！</div>\n  把 Qbox 告訴您的朋友\n  <div style=\"text-align: center; margin:30px 0;\">\n    <a class=\"ui small button\"\n    href=\"mailto:?subject=你有聽過%20Qbox%20嗎？&amp;body=嗨%0A我剛看到了這個%20App，超酷的！%20http%3A%2F%2Fq-box.co\" target=\"_blank\"> <i class=\"fa fa-envelope\"></i> Email\n    </a>\n    <a class=\"ui twitter small button\"\n      href=\"https://twitter.com/intent/tweet?text=寄東西原來可以如此簡單+%40qboxapp+%23共享經濟\" target=\"_blank\">\n      <i class=\"fa fa-twitter\"></i> 推文\n    </a>\n    <a class=\"ui facebook small button\"\n      href=\"https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fq-box.co\" target=\"_blank\">\n      <i class=\"fa fa-facebook\"></i> 分享\n    </a>\n  </div>\n</div>");}]);