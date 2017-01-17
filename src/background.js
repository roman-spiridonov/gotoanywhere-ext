/**
 * This script is executed in background (i.e. before the user opens up the extension).
 */
"use strict";

// const db = require('./db/index').db;
const extension = require('./extension');

extension.updateTabs();

setInterval(() => {  // TODO: update on the fly instead of setInterval
  // db.dbInit();
  extension.updateTabs();
}, 5000);
