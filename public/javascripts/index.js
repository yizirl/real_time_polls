var myApp = angular.module('myApp', []);
myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {

    $scope.poll = {
        question: "",
        isMulti: 0,
        options: ["", "", ""]
    };

    console.log($scope.poll.options.length);

    $scope.addNewOption = function() {
        $scope.poll.options.push("");
    };

    var dialog = document.querySelector('dialog');

    $scope.createPoll = function() {
        if (!$scope.poll.question) {
            var toast = { message: 'Please enter a poll question!' };
            var snackbarContainer = document.querySelector('#demo-toast-example');
            snackbarContainer.MaterialSnackbar.showSnackbar(toast);
            return;
        }
        var count = 0;
        var flag = true;
        for (var idx in $scope.poll.options) {
            if ($scope.poll.options[idx] != "") {
                count++;
                flag = false;
            }
        }
        if (flag) {
            var toast = { message: 'Please enter at least two options!' };
            var snackbarContainer = document.querySelector('#demo-toast-example');
            snackbarContainer.MaterialSnackbar.showSnackbar(toast);
        }
        if (count < 2) {
            var toast = { message: 'Please enter at least two options!' };
            var snackbarContainer = document.querySelector('#demo-toast-example');
            snackbarContainer.MaterialSnackbar.showSnackbar(toast);
        }
        if (count >= 2) {
            $http.post('/createpoll', $scope.poll).
                success(function(data, status, headers, config) {
                    console.log(JSON.stringify(data));
                    $scope.poll = {
                        question: "",
                        isMulti: 0,
                        options: ["", "", ""]
                    };
                    layer.open({
                        type: 1,
                        shift: 2,
                        closeBtn: 0,
                        shadeClose: true,
                        title: "",
                        area: ['65%', '35%'],
                        content: '<div class="mdl-dialog__content" style="text-align: center"><h5>您的投票已经被创建，地址如下：</h5><a href="' + data.addr + '" style="word-wrap:break-word; word-break:break-all;">' + data.addr + '</a></div>',
                        // btn: '复制到粘贴板',
                        // yes: function(index, layero) {
                        //     var clipboard = new Clipboard('.layui-layer-btn0', {
                        //         text: function() {
                        //             return data.addr;
                        //         }
                        //     });
                        //     clipboard.on('success', function(e) {
                        //         console.log(e);
                        //     });
                        //     clipboard.on('error', function(e) {
                        //         console.log(e);
                        //     });
                        // }
                    });
                }).
                error(function(data, status, headers, config) {
                    console.log(status);
                });
        }
    };

}])


