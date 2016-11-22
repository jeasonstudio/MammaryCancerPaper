//启动入口
var app = angular.module('myApp', ["ngRoute", "ui.router"])

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
    "ipAddress": "./testJson"
}

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

    // 根据第二个小标题区分题目
    $scope.filterBySecNum = function (afterFirstArr) {
        _.each(afterFirstArr, function (b, k) {
            if (b.length > 1) {
                console.log(b)
            }
            $scope.getSingleChoose(b);
        })
    }

    $scope.getSingleChoose = function (afterSecArr) {

    }

    $http.get('http://120.27.49.154:8080/BreastCancer/getQuestion?' + 'userId=aaa' + '&paperModule=1')
        .success(function (resp) {
            if (resp.msg == 'success') {
                $scope.modOne = sumWeight(_.flatten(resp.body.questions));
                // console.log(sumWeight($scope.modOne))
                $scope.setModOneQue($scope.modOne);
            }
        });
});

// 2基本情况
app.controller('basicSituationCtrl', function ($scope, $rootScope, $http) {
    console.log("basicSituationCtrl  p2");
    $(".icon-xinyongqingkuang-copy").addClass("active")
    $rootScope.swiper = makeSwiper()
    $(".swiper-slide").height($(window).height() - 50);

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