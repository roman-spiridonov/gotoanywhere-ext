const DbWrapper = require('./dbWrapper').DbWrapper;

function LocalStorageDb(options) {
    DbWrapper.apply(this, arguments);

    var _dbKey = options.dbKey || "db";

    var _changeSet = [];  // [{"action": "add/remove", "obj": dbEntry}, {...}, ...]
    var _stagedClear = false;  // db needs clearing before applying other change-sets

    var self = this;

    /**
     * Update state from db.
     */
    this.refresh = function () {
        self._data = _getDb().getMap();
        _changeSet = []; _stagedClear = false;  // TODO: update logic
    };

    /**
     * Persist state to local storage from local changeSet. Side effects only on this function.
     */
    this.save = function () {
        if(_stagedClear) {
            localStorage.removeItem('db');
            _stagedClear = false;
        }
        let curDb = _getDb();
        _changeSet.forEach((change) => {
            let dbEntry = change.dbEntry;
            if (change.action === "add") {  // adding element
                curDb.push(dbEntry);
            } else {  // removing element
                curDb.delete(dbEntry);
            }
        });

        localStorage.setItem('db', JSON.stringify(curDb.get()));
    };

    this.saveEntry = function(dbEntry) {
        let curDbStr = localStorage.getItem(_dbKey);
        let curDb = _parseDbStr(curDbStr);
        if (curDb.length > 0) {
            //console.log("Current state of db: ", curDb.map(item => item.id));
            let index = self.indexOf(dbEntry, curDb);
            if (index === -1) {
                console.log("dbEntry: ", dbEntry.id);
                localStorage.setItem('db', curDbStr.slice(0, -1).concat(',', JSON.stringify(dbEntry), ']'));
            }
        } else {
            localStorage.setItem('db', ''.concat('[', JSON.stringify(dbEntry), ']'));
        }

        localStorage.setItem(_dbKey, curDbStr.slice(0, -1).concat(',', JSON.stringify(dbEntry), ']'));
    };

    function _getDb() {
        let curDbStr = localStorage.getItem(_dbKey);
        return new DbWrapper({data: _parseDbStr(curDbStr)});
    }

    function _getData() {
        let curDbStr = localStorage.getItem(_dbKey);
        return _parseDbStr(curDbStr);
    }

    function _parseDbStr(curDbStr) {
        let curDb = [];
        if (curDbStr) {  // if not empty
            try {
                curDb = JSON.parse(curDbStr);
            } catch (e) {
                console.error('Could not parse JSON from local storage. Returned empty array.\n', e);
                return curDb;
            }
        }
        return curDb;
    }

    var parentClear = this.clear;
    this.clear = function () {
        parentClear(arguments);
        _stagedClear = true;
        _changeSet.length = 0;
    };

    var parentPush = this.push;
    this.push = function (dbEntry) {  // checks for duplicates
        parentPush(dbEntry);
        _changeSet.push({action: "add", dbEntry: dbEntry});
    };


}

exports.LocalStorageDb = LocalStorageDb;