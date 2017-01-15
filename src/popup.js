const extension = require('./extension');
const GTASelect = require('./GTASelect').GTASelect;
const dbInit = require('./dbInit');

$(function () {
    dbInit();
    var data = JSON.parse(localStorage.getItem('db'));
    var searchBox = new GTASelect();
    searchBox.init('#search', data);

    var timerId = setInterval(() => {  // TODO: update on the fly instead of setInterval
        extension.updateTabs();
        searchBox.update();
    }, 1000);

    searchBox.open();
});
