function DbWrapper(options) {
    var _data = _set(options.data);

    function _set(data) {
        if (typeof data === Array && data[0].id) {
            try {
                _data = data.map((elem) => [elem.id, elem]);
            } catch(e) {
                console.error("Could not initialize the db with the provided data. Assigned empty db.");
                _data = new Map;
            }
        } else {
            try {
                _data = new Map(data);
            } catch (e) {
                console.error("Could not initialize the db with the provided data. Assigned empty db.");
                _data = new Map;
            }
        }
    }
    this.set = _set;

    this.clear = function () {
        _data.clear();
    };

    this.push = function (dbEntry) {  // checks for duplicates
        if(!dbEntry.id) throw new Error("The database element should have an id!");
        _data.set(dbEntry.id, dbEntry);
        return dbEntry;
    };

    this.get = function() {
        if(arguments.length === 1) {
            let id = arguments[0];
            return _data.get(id);
        }

        return Array.from(_data.values());
    };

    this.has = function (dbEntry) {
        return _data.has(dbEntry.id);
    };

    this.delete = function(dbEntry) {
        _data.delete(dbEntry.id);
    }

}

exports.DbWrapper = DbWrapper;