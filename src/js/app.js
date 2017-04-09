//启动入口
var app = angular.module('myApp', ["ngRoute", "ui.router", "angular-md5", "ngSanitize", "ngCookies"])

app.config(function ($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.when("", "/personal"); // TODO: change to personal
	$stateProvider
		.state('personal', {
			url: "/personal",
			templateUrl: "./html/personal.html",
			controller: "personalCtrl"
		})
		.state('basicSituation', {
			url: "/basicSituation",
			templateUrl: "./html/basicSituation.html",
			controller: "basicSituationCtrl"
		})
		.state('medicalHistory', {
			url: "/medicalHistory",
			templateUrl: "./html/medicalHistory.html",
			controller: "medicalHistoryCtrl"
		})
		.state('habitsCustoms', {
			url: "/habitsCustoms",
			templateUrl: "./html/habitsCustoms.html",
			controller: "habitsCustomsCtrl"
		})
		.state('medication', {
			url: "/medication",
			templateUrl: "./html/medication.html",
			controller: "medicationCtrl"
		})
		.state('breast', {
			url: "/breast",
			templateUrl: "./html/breast.html",
			controller: "breastCtrl"
		})
		.state('login', {
			url: "/login",
			templateUrl: "./html/login.html",
			controller: "loginCtrl"
		})
});

var allFactory = {
	"userId": "",
	"teleNum": "",
	"password": "",
	"HASHPASSWD": "",
	"tagIP": "http://10.24.14.92", //测试用 ip
	// "tagIP": "http://120.27.49.154",	//生产用 ip
	"postRegister": "//120.27.49.154/BreastCancer/register", //测试用注册
	"postLogin": "//120.27.49.154/BreastCancer/login", //测试用登录
	"ipAddress": "//120.27.49.154/BreastCancer/getQuestion", //测试用请求题目
	"setAnwserAddress": "//120.27.49.154/BreastCancer/getInsertInfo", //测试用提交答案
	"isLogin": false,
	"isRemember": true
}

// var module = angular.module('angular-bind-html-compile', []);
// module.directive('bindHtmlCompile', ['$compile',
// 	function ($compile) {
// 		return {
// 			restrict: 'A',
// 			link: function (scope, element, attrs) {
// 				scope.$watch(function () {
// 						return scope.$eval(attrs.bindHtmlCompile);
// 					},
// 					function (value) {
// 						element.html(value);
// 						$compile(element.contents())(scope);
// 					});
// 			}
// 		};
// 	}
// ]);
// var module = angular.module('angularBindHtmlCompile', []);

app.directive('bindHtmlCompile', ['$compile', function ($compile) {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			scope.$watch(function () {
				return scope.$eval(attrs.bindHtmlCompile);
			}, function (value) {
				element.html(value);
				$compile(element.contents())(scope);
			});
		}
	};
}]);

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
	debugger
	var tagArrResult = [];
	for (var secQue = 0; secQue < tagArr.length; secQue++) {
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
	debugger
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
	if (tagArrResult.length == 0) {
		return [origionArr]
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
app.controller('personalCtrl', function ($scope, $rootScope, $http, $cookies, $cookieStore, $state, md5) {

	// 进入页面一些初始化配置
	console.log("personalCtrl  p1");
	$(".icon-gerenxinxi").addClass("active")
	$rootScope.swiper = makeSwiper()
	$(".swiper-slide").height($(window).height() - 50);

	$scope.setModOneQue = function (tagArr) {
		console.log(tagArr);
		// takePagesNum(tagArr)
	}
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
			html: '<div class="weui-cell__hd"><input type="checkbox" class="loginCheckbox" name="checkbox1" id="loginCheckbox" checked="checked"><span>记住密码自动登录</span></div>' +
				'<input class="swal2-input" id="teleNum" placeholder="手机号/用户名" type="text" style="display: block;" autofocus>',


			inputValidator: function (value) {
				return new Promise(function (resolve, reject) {
					// console.log(value)
					$teleNum = $('#teleNum').val();
					if ((/^1(3|4|5|7|8)\d{9}$/.test($teleNum)) && (value.length >= 6 && value.length <= 10)) {
						resolve()
					} else if (!(/^1(3|4|5|7|8)\d{9}$/.test($teleNum))) {
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
			allFactory.teleNum = $('#teleNum').val();
			allFactory.password = result;
			allFactory.HASHPASSWD = md5.createHash(result);

			debugger
			$http.post(allFactory.postLogin, {
					"teleNum": allFactory.teleNum,
					"password": allFactory.HASHPASSWD,
					"roleName": "patient",
					"isRemember": allFactory.isRemember
				})
				.success(function (resp) {
					if (resp.msg) {
						// console.log(resp.body)
						allFactory.isLogin = true;
						allFactory.userId = resp.userId;
						$scope.getPage();
						// putcookiecookie，自动登录
						if (allFactory.isRemember) {
							debugger
							window.localStorage.userInfo = JSON.stringify({
								teleNum: allFactory.teleNum,
								password: allFactory.HASHPASSWD
							})
						} else {
							window.localStorage.clear()
						}
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
					if ((/^1(3|4|5|7|8)\d{9}$/.test(value))) { // TODO：验证手机号
						allFactory.teleNum = value
						// $http.post(allFactory.postRegister, {
						// 		"teleNum": "13220101996",//allFactory.teleNum,
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
			confirmButtonText: '注册',
			inputPlaceholder: '重复输入密码(6-10位)',
			inputValidator: function (value) {
				return new Promise(function (resolve, reject) {
					if (value.length >= 6 && value.length <= 10 && value == yourPassWord) {
						allFactory.password = yourPassWord;
						allFactory.HASHPASSWD = md5.createHash(yourPassWord);

						$http.post(allFactory.postRegister, {
								"teleNum": allFactory.teleNum,
								"password": allFactory.HASHPASSWD,
								"roleName": "patient"
							})
							.success(function (resp) {
								if (resp.msg) {
									// console.log(resp.body)
									allFactory.userId = resp.userId;
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
	var thisModule = 1;

	// 答案数组
	$scope.userAnswer = []

	// 填空答题
	$scope.fillBlank = function (uuid, value) {
		alert("s")
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
	$scope.setModOneQue = function (tagArr) {
		console.log(tagArr)
		$scope.setModOne = tagArr;
	}

	// 请求题目
	$scope.getPage = function () {
		$http.post(allFactory.ipAddress, {
				'teleNum': allFactory.teleNum,
				'paperModule': thisModule
			})
			.success(function (resp) {
				console.log(resp)
				if (resp.msg) {
					$scope.modOne = sumWeight(_.flatten(resp.body.questions));
					// console.log(sumWeight($scope.modOne))
					$scope.setModOneQue($scope.modOne);
				} else {
					swal('网络错误，请重试', resp.errorText, 'error')
					$scope.alertLogin()
				}
			})
			.error(function (data, header, config, status) {
				swal('网络错误', '错误信息：' + header, 'error')
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
			})
			.error(function (data, header, config, status) {
				swal('网络错误', '错误信息：' + header, 'error')
			});
	}

	$scope.nextMode = function () {
		$state.go('basicSituation', {})
	}

	// 测试代码
	// $scope.getPage()
	// $scope.alertLogin();
	// if (allFactory.isLogin) {
	// 	$scope.getPage()
	// 	// allFactory.userId = $scope.cookUser.userId;
	// 	// allFactory.HASHPASSWD = $scope.cookUser.HASHPASSWD;
	// } else {
	// 	$scope.alertLogin();
	// }


	// 下面为生产代码
	if (allFactory.isLogin || window.localStorage.userInfo) {
		allFactory.teleNum = JSON.parse(window.localStorage.userInfo).teleNum
		allFactory.HASHPASSWD = JSON.parse(window.localStorage.userInfo).HASHPASSWD
		swal('已登录', '账号：' + allFactory.teleNum, 'success')
		$scope.getPage()
		// allFactory.userId = $scope.cookUser.userId;
		// allFactory.HASHPASSWD = $scope.cookUser.HASHPASSWD;
	} else {
		$scope.alertLogin();
	}
});

// 2基本情况
app.controller('basicSituationCtrl', function ($scope, $rootScope, $http, $cookies, $cookieStore, $state, md5) {
	// if(!allFactory.isLogin) $state.go('personal',{})

	// 这里是一个 md5加密的例子
	// console.log(md5.createHash('444444').length)

	console.log("basicSituationCtrl  p2");
	$(".icon-xinyongqingkuang-copy").addClass("active")
	$(".swiper-slide").height($(window).height() - 50);
	// 当前模块号
	var thisModule = 2;

	// 答案数组
	$scope.userAnswer = []

	// 填空答题
	$scope.fillBlank = function (uuid, value) {
		alert("s")
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
				'teleNum': allFactory.teleNum,
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
			})
			.error(function (data, header, config, status) {
				swal('网络错误', '错误信息：' + header, 'error')
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
			})
			.error(function (data, header, config, status) {
				swal('网络错误', '错误信息：' + header, 'error')
			});
	}

	$scope.nextMode = function () {
		$state.go('medicalHistory', {})
	}

	$scope.getPage()

	// 测试代码
	// $scope.getPage()
	// $scope.alertLogin();
	// if (allFactory.isLogin) {
	// 	$scope.getPage()
	// 	// allFactory.userId = $scope.cookUser.userId;
	// 	// allFactory.HASHPASSWD = $scope.cookUser.HASHPASSWD;
	// } else {
	// 	$scope.alertLogin();
	// }

	// // 拿到 cookie
	// $scope.cookUser = $cookieStore.get("user");
	// console.log($scope.cookUser)
	// $cookieStore.remove("user");

	// 下面为生产代码
	// if (allFactory.isLogin || $scope.cookUser && ($scope.cookUser.userId && $scope.cookUser.HASHPASSWD)) {
	// 	$scope.getPage()
	// 	allFactory.userId = $scope.cookUser.userId;
	// 	allFactory.HASHPASSWD = $scope.cookUser.HASHPASSWD;
	// } else {
	// 	$scope.alertLogin();
	// }
});

// 3疾病与家族史
app.controller('medicalHistoryCtrl', function ($scope, $rootScope, $http, $cookies, $cookieStore, $state, md5) {
	console.log("medicalHistoryCtrl  p3");
	$(".icon-bingli").addClass("active")
	$rootScope.swiper = makeSwiper()
	$(".swiper-slide").height($(window).height() - 50);

	// 当前模块号
	var thisModule = 3;

	// 答案数组
	$scope.userAnswer = []

	// 填空答题
	$scope.fillBlank = function (uuid, value) {
		alert("s")
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
	$scope.setModThreeQue = function (tagArr) {
		console.log(tagArr)
		$scope.setModThree = tagArr;
	}

	// 请求题目
	$scope.getPage = function () {
		$http.post(allFactory.ipAddress, {
				'teleNum': allFactory.teleNum,
				'paperModule': thisModule
			})
			.success(function (resp) {
				console.log(resp)
				if (resp.msg) {
					$scope.modThree = sumWeight(_.flatten(resp.body.questions));
					// console.log(sumWeight($scope.modOne))
					$scope.setModThreeQue($scope.modThree);
				} else {
					swal('网络错误，请重试', resp.errorText, 'error')
					$scope.alertLogin()
				}
			})
			.error(function (data, header, config, status) {
				swal('网络错误', '错误信息：' + header, 'error')
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
			})
			.error(function (data, header, config, status) {
				swal('网络错误', '错误信息：' + header, 'error')
			});
	}

	$scope.nextMode = function () {
		$state.go('habitsCustoms', {})
	}

	$scope.getPage()
});

// 4生活习惯
app.controller('habitsCustomsCtrl', function ($scope, $rootScope, $http, $cookies, $cookieStore, $state, md5) {
	console.log("habitsCustomsCtrl  p4");
	$(".icon-shenghuo").addClass("active")
	$rootScope.swiper = makeSwiper()
	$(".swiper-slide").height($(window).height() - 50);

	// 当前模块号
	var thisModule = 4;

	// 答案数组
	$scope.userAnswer = []

	// 填空答题
	$scope.fillBlank = function (uuid, value) {
		alert("s")
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
	$scope.setModFourQue = function (tagArr) {
		console.log(tagArr)
		$scope.setModFour = tagArr;
	}

	// 请求题目
	$scope.getPage = function () {
		$http.post(allFactory.ipAddress, {
				'teleNum': allFactory.teleNum,
				'paperModule': thisModule
			})
			.success(function (resp) {
				console.log(resp)
				if (resp.msg) {
					$scope.modFour = sumWeight(_.flatten(resp.body.questions));
					// console.log(sumWeight($scope.modOne))
					$scope.setModFourQue($scope.modFour);
				} else {
					swal('网络错误，请重试', resp.errorText, 'error')
					$scope.alertLogin()
				}
			})
			.error(function (data, header, config, status) {
				swal('网络错误', '错误信息：' + header, 'error')
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
			})
			.error(function (data, header, config, status) {
				swal('网络错误', '错误信息：' + header, 'error')
			});
	}

	$scope.nextMode = function () {
		$state.go('medication', {})
	}

	$scope.getPage()
});

// 5服药、使用化学药剂史
app.controller('medicationCtrl', function ($scope, $rootScope, $http, $cookies, $cookieStore, $state, md5) {
	console.log("medicationCtrl  p5");
	$(".icon-yao").addClass("active")
	$rootScope.swiper = makeSwiper()
	$(".swiper-slide").height($(window).height() - 50);

	// 当前模块号
	var thisModule = 5;

	// 答案数组
	$scope.userAnswer = []

	// 填空答题
	$scope.fillBlank = function (uuid, value) {
		alert("s")
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
	$scope.setModFiveQue = function (tagArr) {
		console.log(tagArr)
		$scope.setModFive = tagArr;
	}

	// 请求题目
	$scope.getPage = function () {
		$http.post(allFactory.ipAddress, {
				'teleNum': allFactory.teleNum,
				'paperModule': thisModule
			})
			.success(function (resp) {
				console.log(resp)
				if (resp.msg) {
					$scope.modFive = sumWeight(_.flatten(resp.body.questions));
					// console.log(sumWeight($scope.modOne))
					$scope.setModFiveQue($scope.modFive);
				} else {
					swal('网络错误，请重试', resp.errorText, 'error')
					$scope.alertLogin()
				}
			})
			.error(function (data, header, config, status) {
				swal('网络错误', '错误信息：' + header, 'error')
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
			})
			.error(function (data, header, config, status) {
				swal('网络错误', '错误信息：' + header, 'error')
			});
	}

	$scope.nextMode = function () {
		$state.go('breast', {})
	}

	$scope.getPage()
});

// 6乳腺相关知识
app.controller('breastCtrl', function ($scope, $rootScope, $http, $cookies, $cookieStore, $state, md5) {
	console.log("breastCtrl  p6");
	$(".icon-zhishichanquan2").addClass("active")
	$rootScope.swiper = makeSwiper()
	$(".swiper-slide").height($(window).height() - 50);

	// 当前模块号
	var thisModule = 6;

	// 答案数组
	$scope.userAnswer = []

	// 填空答题
	$scope.fillBlank = function (uuid, value) {
		alert("s")
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
	$scope.setModSixQue = function (tagArr) {
		console.log(tagArr)
		$scope.setModSix = tagArr;
	}

	// 请求题目
	$scope.getPage = function () {
		$http.post(allFactory.ipAddress, {
				'teleNum': allFactory.teleNum,
				'paperModule': thisModule
			})
			.success(function (resp) {
				console.log(resp)
				if (resp.msg) {
					$scope.modSix = sumWeight(_.flatten(resp.body.questions));
					// console.log(sumWeight($scope.modOne))
					$scope.setModSixQue($scope.modSix);
				} else {
					swal('网络错误，请重试', resp.errorText, 'error')
					$scope.alertLogin()
				}
			})
			.error(function (data, header, config, status) {
				swal('网络错误', '错误信息：' + header, 'error')
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
			})
			.error(function (data, header, config, status) {
				swal('网络错误', '错误信息：' + header, 'error')
			});
	}

	$scope.finishAll = function () {
		swal('提交成功','','success')
	}

	$scope.getPage()
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