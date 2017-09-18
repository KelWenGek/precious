//mediator module definition 中介者订阅发布机制,用于解耦各个组件,进行异步触发

(function (lib) {

	function iterate(a,b) {
		var i;
		if(Array.prototype.indexOf){
			return a.indexOf(b);
		}
		if(null == a){
			throw new TypeError;
		}
		for (i = a.length ; i-- ;) {
			if(a[i] === b){
				return i;
			}
		}
		return -1;
	}

	var getListeners = function (name) {

		var _registry = this._registry || (this._registry = {}),listeners = _registry[name] || (_registry[name] = []);
		return listeners;
	};

	var hasListeners = function (name) {
		return this.getListeners(name).length ? !0 : !1
	};

	var subscribe = function (name,callback) {
		var listeners = this.getListeners(name);
		if("function" != typeof callback){
			throw new TypeError("mediator.subscribe(): the 2nd argument must be a function.");
		}
		listeners.length && -1 === iterate(listeners,callback) && listeners.push(callback);
		return this;
	};

	var subscribeOnce = function (a,b) {
		function c() {
			d.release(a,c);
			b.apply(this,arguments);
		}

		var d = this;
		b._wrapper = c;
		this.subscribe(a,c);
		return this;
	};

	var release = function (a,b) {
		function c(a) {
			this._registry && (a ? delete this._registry[a] : delete this._registry);
		}

		var e,f,g = arguments.length;
		if(0 === g){
			c.call(this);
			return this;
		}
		if(1 === g){
			c.call(this,a);
			return this;
		}
		if("function" != typeof b){
			throw new TypeError("mediator.release(): the 2nd argument must be a function.");
		}
		e = this.getListeners(a);
		f = iterate(e,b);
		-1 === f && (f = iterate(e,b._wrapper));
		if(-1 !== f){
			e.splice(f,1);
			0 === e.length && c.call(this,a);
		}
		return this;
	};
	var publish = function (name) {
		var args = Array.prototype.slice.call(arguments,1),listeners = this.getListeners(name),len = listeners.length;
		if(len){
			listeners = listeners.slice(0);
			for (var i = 0 ; len > i ; i++) listeners[i].apply(this,args)
		}
		return this;
	};
	var mediator = {
		getListeners  : getListeners,
		hasListeners  : hasListeners,
		subscribe     : subscribe,
		subscribeOnce : subscribeOnce,
		release       : release,
		publish       : publish
	};
	lib.Mediator = mediator;

}(window.lib || (window.lib = {})));