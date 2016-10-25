//启动入口
// require('angular-ui-router');
var app = angular.module('myApp', ["ngRoute" ])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/personal', {
                url: "/personal",
                templateUrl: "../../html/personal.html",
                controller: "personalCtrl"
            })
            .when('/basicSituation', {
                url: "/basicSituation",
                templateUrl: "../../html/basicSituation.html",
                controller: "basicSituationCtrl"
            })
            .when('/medicalHistory', {
                url: "/medicalHistory",
                templateUrl: "../../html/medicalHistory.html",
                controller: "medicalHistoryCtrl"
            })
            .when('/habitsCustoms', {
                url: "/habitsCustoms",
                templateUrl: "../../html/habitsCustoms.html",
                controller: "habitsCustomsCtrl"
            })
            .when('/medication', {
                url: "/medication",
                templateUrl: "../../html/medication.html",
                controller: "medicationCtrl"
            })
            .when('/breast', {
                url: "/breast",
                templateUrl: "../../html/breast.html",
                controller: "breastCtrl"
            })
            .otherwise({
                url: "/personal",
                templateUrl: "../../html/personal.html",
                controller: "personalCtrl"
            });
    }]);

    // .config(function ($stateProvider, $urlRouterProvider) {
    //     $urlRouterProvider.when("", "/personal");
    //     $stateProvider
    //         .state('personal', {
    //             url: "/personal",
    //             template:require("../../html/personal.html"),
    //             controller: "personalCtrl"
    //         })
    // });

// 初始化 swiper
app.factory('mySwiper', function () {
    var swiperObj = {
        direction: 'horizontal',
        touchMoveStopPropagation: true, //阻止冒泡
        paginationClickable: true,
        pagination: '.swiper-pagination',
        iOSEdgeSwipeDetection: true,
        flip: {
            slideShadows: false
        },
    };
    var swiper = new Swiper('.swiper-container', swiperObj);

    return swiper;
});


// 个人信息
app.controller('personalCtrl', function ($scope, $http, $location, mySwiper) {
    console.log("personalCtrl  p1");
    $(".icon-gerenxinxi").addClass("active")
    $(".swiper-slide").height($(window).height() - 50);
    // var swiper = new Swiper('.swiper-container', mySwiper);
    // var swiper = mySwiper;

    // $scope.nextMode = function () {
    //     $location.path("/basicSituation");
    // }
});

// 基本情况
app.controller('basicSituationCtrl', function ($scope, $http, $location, mySwiper) {
    console.log("basicSituationCtrl  p2");
    $(".icon-xinyongqingkuang-copy").addClass("active")
    $(".swiper-slide").height($(window).height() - 50);

    $scope.prevMode = function () {
        $location.path("/personal");
    }
    $scope.nextMode = function () {
        $location.path("/medicalHistory");
    }
});

// 疾病与家族史
app.controller('medicalHistoryCtrl', function ($scope, $http) {
    console.log("222");
});

// 生活习惯
app.controller('habitsCustomsCtrl', function ($scope, $http) {
    console.log("222");
});

// 服药、使用化学药剂史
app.controller('medicationCtrl', function ($scope, $http) {
    console.log("222");
});

// 乳腺相关知识
app.controller('breastCtrl', function ($scope, $http) {
    console.log("222");
});

// 上一页下一页
app.directive('changePage', function (mySwiper) {
    return {
        restrict: 'EA',
        replace: true,
        template: '<div class="btn-group btn-group-md"><button type="button" ng-click="prev()" class="btn btn-default">上一页</button><button type="button" ng-click="next()" class="btn btn-default">下一页</button></div>',
        controller: function ($scope, $location, mySwiper) {
            $scope.prev = function () {
                mySwiper.slidePrev();
            }
            $scope.next = function () {
                mySwiper.slideNext();
            }
        }
    }
})

// 上一章下一页
app.directive('prevMode', function (mySwiper) {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            pageUrl: '&infoMode'
        },
        template: '<div class="btn-group btn-group-md"><button type="button" ng-click="prev()" class="btn btn-default">上一章</button><button type="button" ng-click="next()" class="btn btn-default">下一页</button></div>',
        controller: function ($scope, $location, mySwiper) {
            $scope.prev = function () {
                $location.path("/" + $scope.pageUrl);
            }
            $scope.next = function () {
                mySwiper.slideNext();
            }
        }
    }
})

// 上一页下一章
app.directive('nextMode', function (mySwiper) {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            pageUrl: '@infoMode'
        },
        template: '<div class="btn-group btn-group-md"><button type="button" ng-click="prev()" class="btn btn-default">上一页</button><button type="button" ng-click="next()" class="btn btn-default">下一章</button></div>',
        controller: function ($scope, $location, mySwiper ) {
            $scope.prev = function () {
                mySwiper.slidePrev();
            }
            $scope.next = function () {
                $location.path("/" + $scope.pageUrl);
                // $state.go()
            }
        }
    }
})