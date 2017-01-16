const _ = require('lodash');
const extension = require('./extension');
const db = require('./db');

exports.GTASelect = function GTASelect(options) {
    // var data = options.data || [];
    var $el;

    this.init = function (selector, data) {
        console.dir(data);
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
        if (!chrome.tabs) return;
        console.log("selected tab", e.params.data.tab);
        chrome.tabs.update(e.params.data.tab.id, {active: true});
    }

    this.open = function () {
        $el.select2("open");
    };

    this.setData = function (data) {
        $el.data('select2').results.data._currentData = data;
    };

    this.update = function () {  // TODO: rewrite to use internal data
        let curDbStr = localStorage.getItem('db');
        let data = db.parseDbStr(curDbStr);
        if (data.length > 0) {
            let currentData = $el.data('select2').results.data._currentData;
            data.forEach(function (item) {
                setTimeout(() => {  // TODO: use async or promise
                    try{
                        if (extension.indexOfById(item, currentData) === -1) {  // TODO: use map
                            currentData.push(item);
                        }
                    } catch(e) {
                        return;
                    }
                }, 0);
            });
        }
    };

};