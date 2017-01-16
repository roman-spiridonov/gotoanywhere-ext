exports.dbInit = function (prepopulate) {
    prepopulate = prepopulate || false;
    if (prepopulate) {  // when launched in browser context
        var data = [{
            id: "0",
            source: "content",
            type: "anchor",
            selectedText: "<b>link</b>",
            text: "This is the best <b>link</b> I have ever seen",
            action: '/'
        }, {
            id: "1",
            source: "tab",
            type: "tab",
            selectedText: "Chrome",
            text: "Chrome web browser",
            action: "open"
        }, {
            id: "3",
            source: "tab",
            type: "tab",
            selectedText: "Chrome",
            text: "Very long tabsbfj<br/>asdf;adsjfbsda;j<br/>fbdsjab<b>fs d</b>apfsdafs adf<br/>sadasdsadsafjhsdaklfjhs;daljfsdaf",
            action: "open"
        }];  // some test data
        localStorage.setItem("db", JSON.stringify(data));
        return data;

    } else {
        return (localStorage.clear(), localStorage.setItem('db', []), []);  // clear at the first start (removes data from previous browser sessions)
    }
};

exports.parseDbStr = function (curDbStr) {
    let curDb;
    if (curDbStr) {  // if not empty
        try {
            curDb = JSON.parse(curDbStr);
        } catch (e) {
            console.error('Could not parse JSON from local storage. Returned empty array.\n', e);
            return [];
        }
    } else {
        curDb = [];
    }

    return curDb;
};