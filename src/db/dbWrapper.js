function DbWrapper(options) {
    this._data = _parse(options.data);

    var self = this;

    function _parse(data) {
        if(!data) {
            return new Map;
        } else if (data.constructor == Array && data.length > 0 && data[0].id) {
            try {
                return new Map(data.map((elem) => [elem.id, elem]));
            } catch(e) {
                console.error("Could not initialize the db with the provided data. Assigned empty db.");
                return new Map;
            }
        } else {
            try {
                return new Map(data);
            } catch (e) {
                console.error("Could not initialize the db with the provided data. Assigned empty db.");
                return new Map;
            }
        }
    }

    this.set = function(data) {
        let parsedData = _parse(data);
        if(parsedData.size) {
            this._data = parsedData;
        }
    };

    this.clear = function () {
        if(self._data) self._data.clear();
    };

    this.push = function (dbEntry) {  // checks for duplicates
        if(!dbEntry.id) throw new Error("The database element should have an id!");
        self._data.set(dbEntry.id, dbEntry);
        return dbEntry;
    };

    this.get = function() {
        if(arguments.length === 1) {
            let id = arguments[0];
            return self._data.get(id);
        }

        return Array.from(self._data.values());
    };

    this.getMap = function() {
        return self._data;
    };

    this.has = function (dbEntry) {
        return self._data.has(dbEntry.id);
    };

    this.delete = function(dbEntry) {
        self._data.delete(dbEntry.id);
    }

}

exports.DbWrapper = DbWrapper;