var LocalDataStorage = (function() {

    function LocalDataStorage() {

        var self = this;

        self.storage = null;

        if (_isLocalStorageSupported())
            self.storage = window.localStorage;
        else
            self.storage = window.inMemoryStorage;
    };

    LocalDataStorage.prototype.setItem = function(key, item) {
        this.storage.setItem(key, item);
    };

    LocalDataStorage.prototype.getItem = function(key) {
        return this.storage.getItem(key);
    };

    LocalDataStorage.prototype.removeItem = function(key) {
        this.storage.removeItem(key);
    };

    LocalDataStorage.prototype.clear = function() {
        this.storage.clear();
    };

    function _isLocalStorageSupported() {
        var testKey = "test";
        var stg = window.localStorage;

        try {
            stg.setItem(testKey, "1");
            stg.removeItem(testKey);

            return true;
        }
        catch (ex) {
            return false;
        }
    }

    return LocalDataStorage;

})();