/**
 * This script is executed in background (i.e. before the user opens up the extension).
 */
"use strict";

const extension = require('./extension');

extension.updateTabs();

setInterval(() => {  // TODO: update on the fly instead of setInterval
  // db.dbInit();
  extension.updateTabs();
}, 5000);

/* eslint-disable */
function test() {
  alert("AAA!");
}
exports.test = test;
/* eslint-enable */

exports.db = require('./db').db;
