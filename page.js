chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    sendResponse({counter: request.counter + 1});
    return true;  // asynchronous sendResponse
});

chrome.runtime.onConnect.addListener(function (port) {
    port.onMessage.addListener(function (msg) {
        port.postMessage({counter: msg.counter + 1});
    });
});