/* global $, Dashboard */

var dashboard = new Dashboard();

// Invoked by clock_widget's getData() function, return object with 'date' +
// 'time' attributes. These values are kept up-to-date with repeated AJAX
// requests to a Django view, which output the server time.
var current_datetime = (function () {
    var time = 0, date = 0, old_datetime = "";

    // Update internal date and time + tell widget to update.
    function updateTime(datetime) {
        date = datetime[0];
        time = datetime[1];
        dashboard.publish('clock_widget/getData');
    }

    function ajax(url, callback) {
        var req = new XMLHttpRequest();
        req.addEventListener("load", function (event) {
            callback(event.target);
        });
        req.open('GET', encodeURI(url));
        req.send();
    }

    // Fetch new time in background, update widget if new value gotten.
    function fetchTime() {
        ajax('/clock', function (req) {
            var x, datetime = req.responseText.replace(/[.].*/, "");
            if (datetime !== old_datetime) {
                old_datetime = datetime;
                updateTime(datetime.split(" "));
            }
        });
    }
    setInterval(fetchTime, 500);              // repeat twice a second
    return function () {
        return { date: date, time: time };
    };
}());

dashboard.addWidget('clock_widget', 'Clock', {
    interval: 0,                               // turn off automatic update
    getData: function () {
        // When "dashboard.publish('clock_widget/getData')" is called, update
        // widget values with whatever `current_datetime()` returns.
        $.extend(this.scope, current_datetime());
    }
});

dashboard.addWidget('current_valuation_widget', 'Number', {
    getData: function () {
        $.extend(this.scope, {
            title: 'Current Valuation',
            moreInfo: 'In billions',
            updatedAt: 'Last updated at 14:10',
            detail: '64%',
            value: '$35'
        });
    }
});

dashboard.addWidget('buzzwords_widget', 'List', {
    getData: function () {
        $.extend(this.scope, {
            title: 'Buzzwords',
            moreInfo: '# of times said around the office',
            updatedAt: 'Last updated at 18:58',
            data: [{label: 'Exit strategy', value: 24},
                   {label: 'Web 2.0', value: 12},
                   {label: 'Turn-key', value: 2},
                   {label: 'Enterprise', value: 12},
                   {label: 'Pivoting', value: 3},
                   {label: 'Leverage', value: 10},
                   {label: 'Streamlininess', value: 4},
                   {label: 'Paradigm shift', value: 6},
                   {label: 'Synergy', value: 7}]
        });
    }
});

dashboard.addWidget('convergence_widget', 'Graph', {
    getData: function () {
        $.extend(this.scope, {
            title: 'Convergence',
            value: '41',
            moreInfo: '',
            data: [ 
                    { x: 0, y: 40 }, 
                    { x: 1, y: 49 }, 
                    { x: 2, y: 38 }, 
                    { x: 3, y: 30 }, 
                    { x: 4, y: 32 }
                ]
            });
    }
});
