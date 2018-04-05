
;(function(jQuery) {
console.log('loading manage-local-storage');

var basil = null

var StorageOptions = {
    namespace: null,
    expireDays: 3650,
}

var StorageManager = {

    initializeBasil: function() {
        // intialize basil using options from StorageOptions.
        // StorageOptions.namespace must be explicitly assigned an appropriate value, otherwise basil init is not performed.
        console.log('INSIDE StorageManager.initializeBasil');
        if (StorageOptions.namespace == null) {
            console.log('manage-local-storage : error : namespace must be explicitly assigned prior to basil initialization');
            return;
        }
        basil = new window.Basil(StorageOptions)
    },

    readFromLocalStorage: function(key) {
        // read data that is saved in storage under given key.
        console.log('INSIDE StorageManager.readFromLocalStorage, key:'+key);
        var data = null;
        var keys = basil.keys();
        if (jQuery.inArray(key,keys) != -1) {
            data = basil.get(key);
        } else {
            data = undefined;
        }
        return data;
    },

    writeToLocalStorage: function(key,data) {
        var old_keys = basil.keys();
        if (jQuery.inArray(key,old_keys) != -1) { basil.remove(key); };
        basil.set(key,data);
    },

    getExtraKeysFromLocalStorage: function(key,data) {
        // Compare saved keys (from basil) with keys in data provided.
        // Return the saved keys (extra_keys) that are not included in data provided.
        var extra_keys = []
        var data_saved = basil.get(key)
        var keys_saved = Object.keys(data_saved)
        var keys_new = Object.keys(data)
        jQuery.each(keys_saved, function(idx,k) {
            if (jQuery.inArray(k,keys_new) == -1) {
                extra_keys.push(k);
            };
        });
        return extra_keys
    },

    deleteFromLocalStorage: function(primary_key,keys_to_delete) {
        // delete data, referenced by keys_to_delete, from a plain object in local storage
        // primary_key : the key within the namespace from which to delete data referenced by keys_to_delete
        // keys_to_delete : array of keys to delete from plain object referenced by primary_key
        var basil_keys = basil.keys()
        if (jQuery.inArray(primary_key,basil_keys) != -1) {
            var data = basil.get(primary_key)
            if (typeof data==='object' && data!==null && !(data instanceof Array) && !(data instanceof Date)) {
                jQuery.each(keys_to_delete, function(idx,k) {
                    delete data[k]
                });
                basil.remove(primary_key)
                basil.set(primary_key,data);
            } else {
                console.log('deleteFromLocalStorage :: '+primary_key+' contains data that is not a plain object.')
            }
        } else {
            console.log('deleteFromLocalStorage :: '+primary_key+' does not exist as a key in this namespace.')
        };
    },

    transferNamespace: function(namespace_old,key_new) {
        // move previously saved data from an old namespace into the current namespace
        // namespace_old : the old namespace name
        // key_new : the key in which to place data inside the current namespace
        var basil_old = new window.Basil({ 'namespace': namespace_old });
        var basil_old_keys = basil_old.keys();
        var data_new = basil.get(key_new);
        if (data_new == null) { data_new = {} };
        jQuery.each(basil_old_keys, function(idx,k) {
            // copy old data into new data object
            data_new[k] = basil_old.get(k)
            // remove old data from old namespace
            basil_old.remove(k)
        });
        // write object containing data from old namespace (and merged with data from current namespace) to the current namespace
        this.writeToLocalStorage(key_new,data_new);
    },

}

var jQueryStorageProxy = function() {
    if (arguments.length==1) {
        var arg_0 = arguments[0];
        switch(arg_0) {
            case "init": StorageManager.initializeBasil(); break;
        }
    } else if (arguments.length==2) {
        var arg_0 = arguments[0];
        var arg_1 = arguments[1];
        switch(arg_0) {
            case "namespace": StorageOptions.namespace = arg_1; break;
            case "expireDays": StorageOptions.expireDays = arg_1; break;
            case "read": return StorageManager.readFromLocalStorage(arg_1); break;
        }
    } else if (arguments.length==3) {
        var arg_0 = arguments[0];
        var arg_1 = arguments[1];
        var arg_2 = arguments[2];
        switch(arg_0) {
            case "write": console.log('write to storage'); StorageManager.writeToLocalStorage(arg_1,arg_2); break;
            case "getExtraKeys": return StorageManager.getExtraKeysFromLocalStorage(arg_1,arg_2); break;
            case "delete": StorageManager.deleteFromLocalStorage(arg_1,arg_2); break;
            case "transfer": StorageManager.transferNamespace(arg_1,arg_2); break;
        }
    }
}

jQuery.fn.CsfToolManageLocalStorage = function(options) {
    if (typeof options !== 'undefined') {
        jQuery.each(options, function(key,value) {
            jQueryStorageProxy(key,value);
        });
    } else {
        return jQueryStorageProxy;
    }
}

})(jQuery);

