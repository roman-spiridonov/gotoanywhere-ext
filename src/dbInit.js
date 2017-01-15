function dbInit() {
    if (!chrome.tabs) {
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
        return localStorage.getItem('db') || (localStorage.clear(), []);
    }
}

module.exports = dbInit;