require('select2');
var _ = require('lodash');

exports.GTASelect = function GTASelect(options) {
    // var data = options.data || [];
    var $el;

    this.init = function(selector, data) {
        $el = $(selector);
        $el.select2({
            placeholder: "Type action to search...",
            allowClear: true,
            data: data,
            escapeMarkup: function (markup) {  // disable removing mark-up
                return markup;
            },
            templateResult: function (item) {  // return item markup in options list (expanded)
                var tmpl = _.template(document.getElementById('option-template').innerHTML, {'variable': 'item'});
                return tmpl(item);
            },
            templateSelection: function (item) {  // return selected item markup (collapsed)
                return item.selectedText;
            }
        });

        $el.on('select2:select', function (e) {
            action(e);
        });

    };

    function action(e) {
        if(!chrome.tabs) return;
        console.log("selected tab", e.params.data.tab);
        chrome.tabs.update(e.params.data.tab.id, {active: true});
    }

    this.open = function() {
        $el.select2("open");
    };


    this.update = function() {  // TODO: rewrite to use internal data
        let curDb = localStorage.getItem('db');
        if (curDb) {
            let data = JSON.parse(curDb);
            // console.log("search.data = ", $("#search").data('select2'));
            let currentData = $("#search").data('select2').results.data._currentData;
            if (data) {
                data.forEach(function (item) {
                    setTimeout(() => {  // TODO: use async or promise
                        if ($.inArray(item.id, currentData.map(function (el) {
                                return el.id;
                            })) === -1) {  // TODO: use map
                            currentData.push(item);
                        }
                    });
                });
            }
        }
    }

};