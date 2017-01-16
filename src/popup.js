const extension = require('./extension');
const GTASelect = require('./GTASelect').GTASelect;

const db = require('./db').db;

$(function () {
    let searchBox = new GTASelect({db: db});
    searchBox.init('#search');

    // searchBox.update();
    setInterval(() => {  // TODO: update on the fly instead of setInterval
        searchBox.update();
    }, 1000);

    searchBox.open();
});
