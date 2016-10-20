//启动入口
var app = angular.module('myApp', ["ngRoute"])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                url: "/personal",
                templateUrl: "html/personal.html",
                controller: "personalCtrl"
            })
            .when('/', {
                url: "/basicSituation",
                templateUrl: "html/basicSituation.html",
                controller: "basicSituationCtrl"
            })
            .when('/', {
                url: "/medicalHistory",
                templateUrl: "html/medicalHistory.html",
                controller: "medicalHistoryCtrl"
            })
            .when('/', {
                url: "/habitsCustoms",
                templateUrl: "html/habitsCustoms.html",
                controller: "habitsCustomsCtrl"
            })
            .when('/', {
                url: "/medication",
                templateUrl: "html/medication.html",
                controller: "medicationCtrl"
            })
            .when('/', {
                url: "/breast",
                templateUrl: "html/breast.html",
                controller: "breastCtrl"
            })
            .otherwise({
                redirectTo: '/'
            });
    }]);

var mySwiper = new Swiper('.swiper-container', {
    direction: 'horizontal',
    loop: true,
    touchMoveStopPropagation: true, //阻止冒泡
    paginationClickable: true,
    pagination: '.swiper-pagination',
    flip: {
        slideShadows: false
    },
});

// 个人信息
app.controller('personalCtrl', function ($scope, $http) {
    console.log("222");
    var mySwiper = new Swiper('.swiper-container', {
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