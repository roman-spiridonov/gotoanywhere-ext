chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if(request.counter <= 1) {
        console.group("onMessage (one-time message check)");
        console.log("Received request", request);
        console.groupEnd();
    }
    sendResponse({counter: request.counter + 1});
    return true;  // asynchronous sendResponse
});

chrome.runtime.onConnect.addListener(function (port) {
    port.onMessage.addListener(function (msg) {
        if(msg.counter <= 1) {
            console.group("onMessage (long-lived connection message)");
            console.log("Received message", msg);
            console.groupEnd();
        }
        port.postMessage({counter: msg.counter + 1});
    });
});