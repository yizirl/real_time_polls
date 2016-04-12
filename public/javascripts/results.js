var myApp = angular.module('myApp', []);
myApp.controller('AppCtrl', function($scope) {
    console.log(window.location.href.split('/')[3]);

    var socket = io();
    socket.emit('results', window.location.href.split('/')[3]);
    socket.on('votes', function(data) {
        var categories = []
        var votes = []
        var total = 0
        for (var idx in data.options) {
            categories.push(data.options[idx].option);
            total += data.options[idx].votes
            if (data.options[idx].votes == 0) {
                data.options[idx].votes = null;
            }
            votes.push(data.options[idx].votes);
        }
        document.getElementById("total").innerHTML = total;
        console.log(votes);
        $('#container').highcharts({
            chart: {
                type: 'column'
            },
            xAxis: {
                categories: categories
            },
            yAxis: {
                title: 'Votes'
            },
            title: {
                text: data.title
            },
            plotOptions: {
                series: {
                    animation: false
                }
            },
            series: [{
                name: 'Votes',
                data: votes
            }]
        });
    });

    socket.on('voted', function(data) {
        socket.emit('results', window.location.href.split('/')[3]);
    });
});


    // $('#container').highcharts({
    //     chart: {
    //         animation: false,
    //         type: 'column',
    //         margin: 100,
    //         options3d: {
    //             enabled: true,
    //             alpha: 10,
    //             beta: -25,
    //             depth: 70
    //         }
    //     },
    //     title: {
    //         text: data.title
    //     },
    //     subtitle: {
    //         text: 'Notice the difference between a 0 value and a null point'
    //     },
    //     plotOptions: {
    //         column: {
    //             depth: 50
    //         }
    //     },
    //     xAxis: {
    //         categories: categories
    //     },
    //     yAxis: {
    //         opposite: true
    //     },
    //     series: [{
    //         name: 'Votes',
    //         data: votes
    //     }]
    // });

