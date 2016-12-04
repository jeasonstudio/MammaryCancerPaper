//启动入口
var app = angular.module('myApp', ["ngRoute", "ui.router", "angular-md5", "ngSanitize"])

app.config(function ($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.when("", "/personal");
	$stateProvider
		.state('personal', {
			url: "/personal",
			templateUrl: "../../html/personal.html",
			controller: "personalCtrl"
		})
		.state('basicSituation', {
			url: "/basicSituation",
			templateUrl: "../../html/basicSituation.html",
			controller: "basicSituationCtrl"
		})
		.state('medicalHistory', {
			url: "/medicalHistory",
			templateUrl: "../../html/medicalHistory.html",
			controller: "medicalHistoryCtrl"
		})
		.state('habitsCustoms', {
			url: "/habitsCustoms",
			templateUrl: "../../html/habitsCustoms.html",
			controller: "habitsCustomsCtrl"
		})
		.state('medication', {
			url: "/medication",
			templateUrl: "../../html/medication.html",
			controller: "medicationCtrl"
		})
		.state('breast', {
			url: "/breast",
			templateUrl: "../../html/breast.html",
			controller: "breastCtrl"
		})
		.state('login', {
			url: "/login",
			templateUrl: "../../html/login.html",
			controller: "loginCtrl"
		})
});

var allFactory = {
	"userId": "",
	"password": "",
	"HASHPASSWD": "",
	"postRegister": "http://120.27.49.154:8080/BreastCancer/register", //测试用注册
	"postLogin": "http://120.27.49.154:8080/BreastCancer/login", //测试用注册
	"ipAddress": "http://120.27.49.154:8080/BreastCancer/getQuestion", //测试用请求题目
	"setAnwserAddress": "http://120.27.49.154:8080/BreastCancer/getInsertInfo", //测试用提交答案
	"reqAdd": "http://120.27.49.154:8080/BreastCancer/getQuestion", //生产请求题目
	"isLogin": false,
	"isRemember": true
}

// 用于全局答题函数
var httpAnswer;

//挂载到任意一个angular.module下，用于 ng-bind-html
app.filter('to_trusted', ['$sce', function ($sce) {
	return function (text) {
		return $sce.trustAsHtml(text);
	};
}]);

// 监听 ng-reapeat 完成
app.directive('repeatFinish', function () {
	return {
		link: function (scope, element, attr) {
			if (scope.$last == true) {
				scope.rootSwiper = makeSwiper()
				console.log('ng-repeat render finish')
			}
		}
	}
})

// 初始化 swiper
function makeSwiper() {
	var swiperObj = {
		direction: 'horizontal',
		touchMoveStopPropagation: true, //阻止冒泡
		paginationClickable: true,
		pagination: '.swiper-pagination',
		iOSEdgeSwipeDetection: true,
		flip: {
			slideShadows: false
		},
		onTransitionEnd: function (swiper, event) {
			console.log("slide")
			httpAnswer(); //TODO:后期可以做一些模块化处理
		}
	};
	return new Swiper('.swiper-container', swiperObj);
}

// 计算权重的函数
var sumWeight = function (tagArr) {
	var tagArrResult = [];
	for (var secQue in tagArr) {
		if (tagArr[secQue].options && (tagArr[secQue].questionAnswerType == '0' || tagArr[secQue].questionAnswerType == '1' || tagArr[secQue].questionAnswerType == '2' || tagArr[secQue].questionAnswerType == '4' || tagArr[secQue].questionAnswerType == '5' || tagArr[secQue].questionAnswerType == '7')) {
			tagArrResult[secQue] = tagArr[secQue].options.length + 1;
		} else if (tagArr[secQue].questionAnswerType == '3' || tagArr[secQue].questionAnswerType == '6') {
			tagArrResult[secQue] = 2;
		} else {
			tagArrResult[secQue] = 2;
		}
	}
	console.log(tagArrResult)
	return splitWeight(tagArrResult, tagArr);
}

// 计算切割位置并切割
var splitWeight = function (tagArr, origionArr) {
	var i = 0,
		sum = 0,
		tagArrResult = [];
	for (var item in tagArr) {
		if (tagArr[item] + sum <= 13) {
			sum += tagArr[item];
		} else {
			sum = 0;
			tagArrResult[i] = item;
			i += 1;
		}
	}
	console.log(tagArrResult)

	var finalSplitedArr = [];
	for (var itemTwo in tagArrResult) {
		if (itemTwo == 0) {
			finalSplitedArr[itemTwo] = origionArr.slice(0, tagArrResult[itemTwo]);
		} else {
			finalSplitedArr[itemTwo] = origionArr.slice(tagArrResult[itemTwo - 1], tagArrResult[itemTwo]);
		}
		finalSplitedArr[tagArrResult.length] = origionArr.slice(tagArrResult[tagArrResult.length - 1], tagArrResult[tagArrResult.length]);
	}
	return finalSplitedArr
}

// 计算页数并显示TODO
var takePagesNum = function (tagArr) {
	var $pagin = $(".swiper-pagination")
	for (var i in tagArr) {
		$pagin.append('<span class="swiper-pagination-bullet"></span>')
	}
}

// 1个人信息
app.controller('personalCtrl', function ($scope, $rootScope, $http) {

	// 进入页面一些初始化配置
	console.log("personalCtrl  p1");
	$(".icon-gerenxinxi").addClass("active")
	$rootScope.swiper = makeSwiper()
	$(".swiper-slide").height($(window).height() - 50);

	$scope.setModOneQue = function (tagArr) {
		console.log(tagArr);
		// takePagesNum(tagArr)
	}



	$scope.aa = '足月妊娠次数<input class="insertPut shortInput" type="text" placeholder="请输入">次'
		// $scope.aa = '您在奥斯卡级等哈看书的啊啊？<input class="insertPut longInput" type="text" placeholder="请输入">'
	$scope.testDou = [{
		"questionAnswerType": 1,
		"questionId": "0.10",
		"questionContent": "居住地区：",
		"questionType": 1,
		"options": [{
			"anwserContent": "城市",
			"anwserId": "1"
		}, {
			"anwserContent": "农村",
			"anwserId": "2"
		}]
	}, {
		"questionAnswerType": 1,
		"questionId": "0.15",
		"questionContent": "用户类别：",
		"questionType": 1,
		"options": [{
			"anwserContent": "病例组",
			"anwserId": "1"
		}, {
			"anwserContent": "对照组",
			"anwserId": "2"
		}]
	}, {
		"questionAnswerType": 1,
		"questionId": "0.16",
		"questionContent": "填写方式：",
		"questionType": 1,
		"options": [{
			"anwserContent": "线上",
			"anwserId": "1"
		}, {
			"anwserContent": "线下",
			"anwserId": "2"
		}]
	}]

	$scope.testSin = [{
		"questionAnswerType": 1,
		"questionId": "0.10",
		"questionContent": "居住地区：",
		"questionType": 1,
		"options": [{
			"anwserContent": "城市",
			"anwserId": "1"
		}, {
			"anwserContent": "农村",
			"anwserId": "2"
		}]
	}, {
		"questionAnswerType": 1,
		"questionId": "0.15",
		"questionContent": "用户类别：",
		"questionType": 1,
		"options": [{
			"anwserContent": "病例组",
			"anwserId": "1"
		}, {
			"anwserContent": "对照组",
			"anwserId": "2"
		}]
	}, {
		"questionAnswerType": 1,
		"questionId": "0.16",
		"questionContent": "填写方式：",
		"questionType": 1,
		"options": [{
			"anwserContent": "线上",
			"anwserId": "1"
		}, {
			"anwserContent": "线下",
			"anwserId": "2"
		}]
	}]


	$http.post(allFactory.reqAdd, {
			'userId': allFactory.userId,
			'paperModule': '1'
		})
		.success(function (resp) {
			console.log(resp)
			if (resp.msg == 'success') {
				$scope.modOne = sumWeight(_.flatten(resp.body.questions));
				// console.log(sumWeight($scope.modOne))
				$scope.setModOneQue($scope.modOne);
			}
		});
});

// 2基本情况
app.controller('basicSituationCtrl', function ($scope, $rootScope, $http, $state, md5) {
	// if(!allFactory.isLogin) $state.go('personal',{})

	// 这里是一个 md5加密的例子
	// console.log(md5.createHash('444444').length)

	console.log("basicSituationCtrl  p2");
	$(".icon-xinyongqingkuang-copy").addClass("active")
	$(".swiper-slide").height($(window).height() - 50);

	// 登录弹窗
	$scope.alertLogin = function () {
		swal({
			title: '登录',
			// type: 'warning',
			allowOutsideClick: false,
			showCloseButton: false,
			animation: false,
			input: 'password',
			inputPlaceholder: '密码(6-10位)',
			html: '<input class="swal2-input" id="teleNum" placeholder="手机号/用户名" type="text" style="display: block;" autofocus>' +
				'<label class="weui-cell weui-check__label" for="s11"><div class="weui-cell__hd"><input type="checkbox" class="weui-check" name="checkbox1" id="s11" checked="checked"><i class="weui-icon-checked"></i></div><div class="weui-cell__bd"><p>standard is dealt for u.</p></div></label>',

			inputValidator: function (value) {
				return new Promise(function (resolve, reject) {
					// console.log(value)
					$teleNum = $('#teleNum').val();
					if ($teleNum != '' && (value.length >= 6 && value.length <= 10)) {
						resolve()
					} else if ($teleNum == '') {
						reject('请正确填写手机号!')
					} else {
						reject('请正确填写密码!')
					}
				})
			},
			showCancelButton: true,
			confirmButtonText: '登录',
			cancelButtonText: '去注册'
		}).then(function (result) {
			allFactory.userId = $('#teleNum').val();
			allFactory.password = result;
			allFactory.HASHPASSWD = md5.createHash(result);

			$http.post(allFactory.postLogin, {
					"teleNum": allFactory.userId,
					"password": allFactory.HASHPASSWD,
					"roleName": "patient",
					"isRemember": allFactory.isRemember
				})
				.success(function (resp) {
					if (resp.msg) {
						console.log(resp.body)
						allFactory.isLogin = true;
						$scope.getPage();
						swal.resetDefaults()
						swal({
							title: '登录成功',
							type: 'success',
							showCancelButton: false,
							showConfirmButton: false,
							text: '请开始填写问卷，2秒后关闭',
							timer: 2000
						}).then(
							function () {},
							// handling the promise rejection
							function (dismiss) {
								if (dismiss === 'timer') {
									console.log('I was closed by the timer')
								}
							}
						)
					} else {
						swal('错误', resp.errorText, 'error').then(function () {
							$scope.alertLogin()
						})
					}
				});

		}, function (dismiss) {
			if (dismiss === 'cancel') {
				$scope.alertRegister()
			}
		}).catch(swal.noop)
	}

	// 注册弹窗
	$scope.alertRegister = function () {
		swal.setDefaults({
			input: 'text',
			confirmButtonText: '下一步&rarr;',
			allowOutsideClick: false,
			showCloseButton: false,
			showCancelButton: true,
			animation: false,
			cancelButtonText: '去登录',
			progressSteps: ['1', '2', '3', '4']
		})

		var yourPassWord;

		var steps = [{
			title: '手机号码',
			input: 'text',
			inputPlaceholder: '请输入您的真实手机号码',
			confirmButtonText: '发送验证码',
			inputValidator: function (value) {
				return new Promise(function (resolve, reject) {
					if (value != '') { // TODO：验证手机号
						allFactory.userId = value
							// $http.post(allFactory.postRegister, {
							// 		"userId": "13220101996",//allFactory.userId,
							// 		"password": thisModule,
							// 		"answer": $scope.userAnswer
							// 	})
							// 	.success(function (resp) {
							// 		if (resp.msg) {
							// 			console.log(resp.body)
							// 		} else {
							// 			swal('网络错误，请重试', '', 'error')
							// 		}
							// 	});
						resolve()
					} else {
						reject('请输入正确的手机号')
					}
				})
			}
		}, {
			title: '验证码',
			input: 'text',
			inputPlaceholder: '请填入刚刚收到的验证码'
		}, {
			title: '密码',
			input: 'password',
			inputPlaceholder: '密码(6-10位)',
			inputValidator: function (value) {
				return new Promise(function (resolve, reject) {
					if (value.length >= 6 && value.length <= 10) {
						yourPassWord = value;
						resolve()
					} else {
						reject('请按格式正确输入密码')
					}
				})
			}
		}, {
			title: '重复输入密码',
			input: 'password',
			inputPlaceholder: '重复输入密码(6-10位)',
			inputValidator: function (value) {
				return new Promise(function (resolve, reject) {
					if (value.length >= 6 && value.length <= 10 && value == yourPassWord) {
						allFactory.password = yourPassWord;
						allFactory.HASHPASSWD = md5.createHash(yourPassWord);

						$http.post(allFactory.postRegister, {
								"teleNum": allFactory.userId,
								"password": allFactory.HASHPASSWD,
								"roleName": "patient"
							})
							.success(function (resp) {
								if (resp.msg) {
									console.log(resp.body)
									resolve()
									allFactory.isLogin = true;
									$scope.getPage()
								} else {
									swal.resetDefaults()
									swal('错误', resp.errorText, 'error').then(function () {
										$scope.alertRegister()
									})
								}
							});

					} else if (value != yourPassWord) {
						reject('密码输入不符')
					} else {
						reject('请按格式正确输入密码')
					}
				})
			}
		}]

		swal.queue(steps).then(function (result) {
			swal.resetDefaults()
			swal({
				title: '注册成功',
				type: 'success',
				showCancelButton: false,
				showConfirmButton: false,
				text: '请开始填写问卷，2秒后关闭',
				timer: 2000
			}).then(
				function () {},
				// handling the promise rejection
				function (dismiss) {
					if (dismiss === 'timer') {
						console.log('I was closed by the timer')
					}
				}
			)
		}, function (dismiss) {
			if (dismiss === 'cancel') {
				swal.resetDefaults()
				$scope.alertLogin()
			}
		})
	}


	// 当前模块号
	var thisModule = '2';

	// 答案数组
	$scope.userAnswer = []

	// 填空答题
	$scope.fillBlank = function (uuid, value) {
		var thisQues = {
			"UUID": uuid,
			"answerId": [value]
		}

		// 若答过就不添加只修改
		if ($scope.userAnswer.length != 0) {
			var judgeHaveAnswered = false;
			_.each($scope.userAnswer, function (b) {
				if (b.UUID == uuid) {
					b.answerId = [value];
					judgeHaveAnswered = true;
				}
			})
			if (!judgeHaveAnswered) {
				$scope.userAnswer.push(thisQues)
			}
		} else {
			$scope.userAnswer.push(thisQues)
		}
		console.log($scope.userAnswer)
	}

	// 单选题选择事件
	$scope.chooseSin = function (uuid, option) {
		var thisQues = {
			"UUID": uuid,
			"answerId": [option]
		}

		// 若答过就不添加只修改
		if ($scope.userAnswer.length != 0) {
			var judgeHaveAnswered = false;
			_.each($scope.userAnswer, function (b) {
				if (b.UUID == uuid) {
					b.answerId = [option];
					judgeHaveAnswered = true;
				}
			})
			if (!judgeHaveAnswered) {
				$scope.userAnswer.push(thisQues)
			}
		} else {
			$scope.userAnswer.push(thisQues)
		}
		console.log($scope.userAnswer)
	}

	// 多选题答题事件
	$scope.chooseDou = function (uuid, option) {
		var thisQues = {
			"UUID": uuid,
			"answerId": [option]
		}

		// 若答过就不添加只修改
		if ($scope.userAnswer.length != 0) {
			var judgeHaveAnswered = false;
			_.each($scope.userAnswer, function (b) {
				if (b.UUID == uuid) {
					var judgeOption = false;
					_.each(b.answerId, function (ans, k) {
						if (ans == option) {
							b.answerId.splice(k, 1)
								// 若已选过，则删除这个 option
							judgeOption = true;
						}
					})
					if (!judgeOption) {
						b.answerId.push(option)
					}
					judgeHaveAnswered = true;
				}
			})
			if (!judgeHaveAnswered) {
				$scope.userAnswer.push(thisQues)
			}
		} else {
			$scope.userAnswer.push(thisQues)
		}
		console.log($scope.userAnswer)
	}

	// 渲染题目
	$scope.setModTwoQue = function (tagArr) {
		console.log(tagArr)
		$scope.setModTwo = tagArr;
	}

	// 请求题目
	$scope.getPage = function () {
		$http.post(allFactory.ipAddress, {
				'userId': allFactory.userId,
				'paperModule': thisModule
			})
			.success(function (resp) {
				console.log(resp)
				if (resp.msg) {
					$scope.modTwo = sumWeight(_.flatten(resp.body.questions));
					// console.log(sumWeight($scope.modOne))
					$scope.setModTwoQue($scope.modTwo);
				} else {
					swal('网络错误，请重试', resp.errorText, 'error')
					$scope.alertLogin()
				}
			});
	}

	// 用户回答
	httpAnswer = function () {
		$http.post(allFactory.setAnwserAddress, {
				"userId": allFactory.userId,
				"paperModule": thisModule,
				"answer": $scope.userAnswer
			})
			.success(function (resp) {
				if (resp.msg) {
					console.log(resp.body)
				} else {
					swal('网络错误，请重试', resp.errorText, 'error')
				}
			});
	}

	// 测试代码
	$scope.getPage()

	// 下面为生产代码
	// if (allFactory.isLogin) {
	// 	$scope.getPage()
	// } else {
	// 	$scope.alertLogin();
	// }
});

// 3疾病与家族史
app.controller('medicalHistoryCtrl', function ($scope, $rootScope, $http) {
	console.log("medicalHistoryCtrl  p3");
	$(".icon-bingli").addClass("active")
	$rootScope.swiper = makeSwiper()
	$(".swiper-slide").height($(window).height() - 50);
});

// 4生活习惯
app.controller('habitsCustomsCtrl', function ($scope, $rootScope, $http) {
	console.log("habitsCustomsCtrl  p4");
	$(".icon-shenghuo").addClass("active")
	$rootScope.swiper = makeSwiper()
	$(".swiper-slide").height($(window).height() - 50);
});

// 5服药、使用化学药剂史
app.controller('medicationCtrl', function ($scope, $rootScope, $http) {
	console.log("medicationCtrl  p5");
	$(".icon-yao").addClass("active")
	$rootScope.swiper = makeSwiper()
	$(".swiper-slide").height($(window).height() - 50);
});

// 6乳腺相关知识
app.controller('breastCtrl', function ($scope, $rootScope, $http) {
	console.log("breastCtrl  p6");
	$(".icon-zhishichanquan2").addClass("active")
	$rootScope.swiper = makeSwiper()
	$(".swiper-slide").height($(window).height() - 50);
});

app.controller('loginCtrl', function ($scope, $rootScope, $http) {
	console.log("222");
});

// 上一页下一页
app.directive('changePage', function () {
	return {
		restrict: 'EA',
		replace: true,
		template: '<div class="btn-group btn-group-md"><button type="button" ng-click="prev()" class="btn btn-default">上一页</button><button type="button" ng-click="next()" class="btn btn-default">下一页</button></div>',
		controller: function ($scope, $rootScope) {
			$scope.prev = function () {
				$rootScope.swiper.slidePrev();
			}
			$scope.next = function () {
				$rootScope.swiper.slideNext();
			}
		}
	}
})

// 上一章下一页
app.directive('prevMode', function ($state) {
	return {
		restrict: 'EA',
		replace: true,
		scope: {
			pageUrl: '&infoMode'
		},
		template: '<div class="btn-group btn-group-md"><button type="button" ng-click="prev()" class="btn btn-default">上一章</button><button type="button" ng-click="next()" class="btn btn-default">下一页</button></div>',
		controller: function ($scope, $rootScope, $state) {
			$scope.prev = function () {
				$state.go($scope.pageUrl, {})
			}
			$scope.next = function () {
				$rootScope.swiper.slideNext();
			}
		}
	}
})

// 上一页下一章
app.directive('nextMode', function ($state) {
	return {
		restrict: 'EA',
		replace: true,
		scope: {
			pageUrl: '@infoMode'
		},
		template: '<div class="btn-group btn-group-md"><button type="button" ng-click="prev()" class="btn btn-default">上一页</button><button type="button" ng-click="next()" class="btn btn-default">下一章</button></div>',
		controller: function ($scope, $rootScope, $state) {
			$scope.prev = function () {
				$rootScope.swiper.slidePrev();
			}
			$scope.next = function () {
				$state.go($scope.pageUrl, {})
			}
		}
	}
})