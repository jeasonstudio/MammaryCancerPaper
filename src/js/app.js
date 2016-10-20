//启动入口
var app = angular.module('myApp', ["ngRoute"])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                url: "/main",
                templateUrl: "html/main.html",
                controller: "mainCtrl"
            })
            .otherwise({
                redirectTo: '/'
            });
    }]);

app.controller('mainCtrl', function ($scope, $http) {
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