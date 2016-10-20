


//启动入口
var app = angular.module('myApp', ["ngRoute"])
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.when("", "/main");
        $stateProvider
            .state('main', {
                url: "/main",
                templateUrl: "html/main.html",
                controller: "mainCtrl"
            })
    });


app.controller('mainCtrl',function ($scope, $http) {
    alert("222");
});
