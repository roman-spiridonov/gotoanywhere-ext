const extension = require('./extension');
const GTASelect = require('./GTASelect').GTASelect;
const db = require('./db');

$(function () {
    let data;
    if (!chrome.tabs) { // populate the db with test data if launched in browser context
        data = db.dbInit(true);
    } else {
        data = db.parseDbStr(localStorage.getItem('db'));
    }

    let searchBox = new GTASelect();
    searchBox.init('#search', data);

    // searchBox.update();
    setInterval(() => {  // TODO: update on the fly instead of setInterval
        searchBox.update();
    }, 1000);

    searchBox.open();
});
