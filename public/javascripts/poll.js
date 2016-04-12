var myApp = angular.module('myApp', []);
myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {

    var socket = io();
    $http.get(window.location.pathname + '/getR').
        success(function(data, status) {
            // this callback will be called asynchronously
            // when the response is available
            $scope.poll = data;
        }).
        error(function(data, status) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log('failed');
        });

    // 多选的情况下
    $scope.selection = [];
    $scope.toggleSelection = function toggleSelection(optionId) {
        var idx = $scope.selection.indexOf(optionId);

        // is currently selected
        if (idx > -1) {
            $scope.selection.splice(idx, 1);
        }

        // is newly selected
        else {
            $scope.selection.push(optionId);
        }
    }


    $scope.vote = function() {
        if ($scope.poll.multi == 0) {
            if ($scope.optionId) {
                // console.log(window.location.pathname + '/v');
                // $http.post(window.location.pathname + '/v', { id: $scope.optionId }).
                //     success(function(data, status, headers) {
                //         console.log(status, data.msg);
                //     }).
                //     error(function(data, status, headers) {
                //         console.log(status);
                //     });
                socket.emit('voting', $scope.optionId);
                // console.log($scope.optionId)                
            } else {
                console.log($scope.optionId);
                console.log("nothing");
                var toast = { message: 'Please check one option!' };
                var snackbarContainer = document.querySelector('#demo-toast-example');
                snackbarContainer.MaterialSnackbar.showSnackbar(toast);
            }
        } else {
            if ($scope.selection.length) {
                socket.emit('multiVote', $scope.selection);
            } else {
                console.log("nothing");
                var toast = { message: 'Please select at least one option!' };
                var snackbarContainer = document.querySelector('#demo-toast-example');
                snackbarContainer.MaterialSnackbar.showSnackbar(toast);
            }
        }

    }

    socket.on('jump', function(data) {
        window.location.href = window.location.pathname + '/r';
    })

    socket.on('toast', function(toast) {
        var snackbarContainer = document.querySelector('#demo-toast-example');
        snackbarContainer.MaterialSnackbar.showSnackbar(toast);
    });

    $scope.results = function() {
        window.location.href = window.location.pathname + '/r';
    }


}])


