//检验是否支持 web storage
function isLocalStorageNameSupported() {
    var w = window;
    if ("object" == typeof localStorage) {
        var test = "test",
            sessionStorage = w.sessionStorage;
        try {
            sessionStorage.setItem(test, "1");
            sessionStorage.removeItem(test);
            w.__isLocalStorageNameSupported__ = 1;
            return !0;
        } catch (o) {
            w.__isLocalStorageNameSupported__ = -1;
            return !1;
        }
    }
}

//设置默认
function setByLocalStorage(variable, callback) {

    var local_storage = window.localStorage && window.localStorage.getItem("local_storage");
    if (null !== local_storage) {
        callback(local_storage);
    } else {
        window.localStorage && window.localStorage.setItem("local_storage", variable);
        callback(variable);
    }
}

function setCustom() {
}


//初始化
function init(variable) {

    var self = this, lastest, w = window;
    !w.__isLocalStorageNameSupported__ && isLocalStorageNameSupported();
    if (-1 === w.__isLocalStorageNameSupported__) {
        setCustom(self.defaults = variable);
    } else if (1 === w.__isLocalStorageNameSupported__) {

        if (self.lastest === void 0) {
            return void setByLocalStorage(variable, function (e) {

                setCustom(self.lastest = e);
            });
        }
        setCustom(self.lastest);
    } else {
        setCustom(self.defaults);
    }
}