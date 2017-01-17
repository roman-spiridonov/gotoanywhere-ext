"use strict";

const _ = require('lodash');
const db = require('./db/index').db;

exports.GTASelect = function GTASelect() {
  let _state;  // array of options
  let $el;

  this.init = function (selector, data) {
    $el = $(selector);
    $el.select2({
      placeholder: "Type action to search...",
      allowClear: true,
      data: data || [],
      escapeMarkup: function (markup) {  // disable removing mark-up
        return markup;
      },
      templateResult: function (item) {  // return item markup in options list (expanded)
        let tmpl = _.template(document.getElementById('option-template').innerHTML, {'variable': 'item'});
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
    if (!chrome.tabs) {
      return;
    }
    console.log("selected tab", e.params.data.tab);
    chrome.tabs.update(e.params.data.tab.id, {active: true});
  }

  this.open = function () {
    $el.select2("open");
  };

  this.setData = function (data) {
    $el.data('select2').results.data._currentData = data;
  };

  this.update = function () {
    if (chrome.tabs) {
      db.refresh();
    }
    _state = db.get();
    console.dir(_state);

    if (_state.length > 0) {
      let currentData = $el.data('select2').results.data._currentData;
      let ids = currentData.map(el => el.id);
      _state.forEach(function (item) {
        if (ids.indexOf(item.id) !== -1) { return; }
        setTimeout(() => {
          currentData.push(item);
        });
      });
    }
  };

};
