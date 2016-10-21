//启动入口
var app = angular.module('myApp', ["ngRoute"])
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


// 个人信息
app.controller('personalCtrl', function ($scope, $http) {
    console.log("222");
    var swiper = new Swiper('.swiper-container', {
        direction: 'horizontal',
        loop: true,
        touchMoveStopPropagation: true, //阻止冒泡
        paginationClickable: true,
        pagination: '.swiper-pagination',
        flip: {
            slideShadows: false
        },
    });
});

// 基本情况
app.controller('basicSituationCtrl', function ($scope, $http) {
    console.log("222");
    var swiper = new Swiper('.swiper-container', {
        direction: 'horizontal',
        loop: true,
        touchMoveStopPropagation: true, //阻止冒泡
        paginationClickable: true,
        pagination: '.swiper-pagination',
        flip: {
            slideShadows: false
        },
    });
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