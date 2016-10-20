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
});