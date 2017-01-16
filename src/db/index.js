/**
 * Database for storing GoToAnywhere select options.
 * @param source: instance that supports dbWrapper interface functions (clear, set, push, pop)
 */

const LocalStorageDb = require('./localStorageDb').LocalStorageDb;

function dbInit(dbKey, prepopulate) {
    prepopulate = prepopulate || false;
    let db = new LocalStorageDb({dbKey: dbKey});

    if (prepopulate) {  // when launched in browser context
        db.set([
            ["0", {
                id: "0",
                source: "content",
                type: "anchor",
                selectedText: "<b>link</b>",
                text: "This is the best <b>link</b> I have ever seen",
                action: '/'
            }],
            ["1", {
                id: "1",
                source: "tab",
                type: "tab",
                selectedText: "Chrome",
                text: "Chrome web browser",
                action: "open"
            }],
            ["3", {
                id: "3",
                source: "tab",
                type: "tab",
                selectedText: "Chrome",
                text: "Very long tabsbfj<br/>asdf;adsjfbsda;j<br/>fbdsjab<b>fs d</b>apfsdafs adf<br/>sadasdsadsafjhsdaklfjhs;daljfsdaf",
                action: "open"
            }]
        ]);

        db.save();

    } else {  // clear at the first start (removes data from previous browser sessions)
        db.clear();
    }

    return db;
}

if (!chrome.tabs) { // populate the db with test data if launched in browser context
    var db = dbInit('db', true);
} else {
    var db = dbInit('db');
}


exports.db = db;