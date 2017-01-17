"use strict";

const GTASelect = require('./GTASelect').GTASelect;

const db = require('./db').db;

$(function () {
  let searchBox = new GTASelect({db: db});
  db.refresh();
  searchBox.init('#search', db.get());

  //searchBox.update();
  setInterval(() => {  // TODO: update on the fly instead of setInterval
    searchBox.update();
  }, 1000);

  searchBox.open();
});
