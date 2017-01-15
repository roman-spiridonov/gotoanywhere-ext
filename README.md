**GoToAnywhere** is Chrome extension that allows you to launch actions quickly using auto-complete pop-up. Actions include switching tabs, opening browser links, etc.

[[https://github.com/roman-spiridonov/gotoanywhere-ext/blob/develop/example/screen.png|alt=Screeshot]]

# Usage
1. Install 
```
npm install
gulp
```
Or...
```
npm install
npm run dev
```

The resulting app will be in `webapp/` folder.

2. Open <chrome://extensions>, then Drag and Drop `webapp/` folder into it.
3. Click `Ctrl+Shift+A` and type something (e.g. a browser tab name).
4. Enjoy!

# Tech stuff
## Basic architecture
The extension consists of two entry points:
* `popup.js`: contains code that exposes auto-complete field and syncs it with the db. Also includes the logic of populating the db with the 
global browser actions like tab names, etc. 
* `page.js`: content script, which is injected into _each_ browser tab by Chrome. Its goal is to parse tab's content and populate the db.

The permissions and set-up of the extension are specified in `manifest.json` (used by Chrome to properly integrate the extension).

## Debugging
To debug _extension code_ (`popup.js` etc.), right-click on the browser extension icon and choose `Inspect popup`.

The _content scripts_ (`page.js`) are debugged from main browser console: go to Sources > Content Scripts tab.  

## Tech Stack
* webpack + gulp
* jQuery, select2 widget
* lodash templates
* Native chrome.* APIs

# Feature log
* Jan. 16, 2017: First prototype. Added basic support for browser tab switching.