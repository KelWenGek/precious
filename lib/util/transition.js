//Transition module definition
(function (lib) {
	function transform(elem,type,handler,callback) {
		var f = d.getTransformOffset(elem),start = {
			translate : {
				x : f.x,
				y : f.y
			}
		},end = {
			translate : {
				x : f.x,
				y : f.y
			}
		};
		type = type.split("");
		//具体的transition效果处理
		handler(start,end,type[0],type[1]);
		for (var i in start) {
			if(start.hasOwnProperty(i)){
				if("translate" === i){
					elem.style.webkitTransition = "";
					elem.style.webkitTransform = d.makeTranslateString(start[i].x,start[i].y);
				}
				else {
					elem.style[i] = start[i];
				}
			}
		}
		end.translate = [end.translate.x,end.translate.y];
		elem.style.webkitBackfaceVisibility = "hidden";
		elem.style.webkitTransformStyle = "preserve-3d";
		d.doTransition(elem,end,{
			duration       : "0.4s",
			timingFunction : "ease",
			callback       : function () {
				elem.style.webkitBackfaceVisibility = "";
				elem.style.webkitTransformStyle = "";
				elem.style.webkitTransition = "";
				callback && callback();
			}
		})
	}

	var d = lib.Animation,direction = {
		L : "x",
		R : "x",
		T : "y",
		B : "y"
	},in_out = {
		L : -1,
		R : 1,
		T : -1,
		B : 1
	},transition = {
		TYPE    : {
			LEFT_IN    : "LI",
			LEFT_OUT   : "LO",
			RIGHT_IN   : "RI",
			RIGHT_OUT  : "RO",
			TOP_IN     : "TI",
			TOP_OUT    : "TO",
			BOTTOM_IN  : "BI",
			BOTTOM_OUT : "BO"
		},
		move    : function (elem,distanceX,distanceY,callback) {
			var f = d.getTransformOffset(elem);
			elem.style.webkitBackfaceVisibility = "hidden";
			elem.style.webkitTransformStyle = "preserve-3d";
			d.translate(elem,"0.4s","ease","0s",f.x + distanceX,f.y + distanceY,function () {
				elem.style.webkitBackfaceVisibility = "";
				elem.style.webkitTransformStyle = "";
				elem.style.webkitTransition = "";
				callback && callback();
			})
		},
		slide   : function (elem,type,distance,callback) {
			transform(elem,type,function (start,end,c,g) {
				var h = direction[c],//方向
					i = in_out[c];//移入还是移出
				"I" === g ? start.translate[h] += i * distance : end.translate[h] += i * distance;
			},callback);
		},
		"float" : function (elem,type,distance,callback) {
			transform(elem,type,function (start,end,c,g) {
				var h = direction[c],i = in_out[c];
				if("I" === g){
					start.translate[h] += i * distance;
					start.opacity = 0;
					end.opacity = 1;
				}
				else {
					end.translate[h] += i * distance;
					start.opacity = 1;
					end.opacity = 0;
				}
			},callback);
		},
		fadeIn  : function (elem,callback) {
			transform(elem,"FI",function (start,end,c,d) {
				if("I" === d){
					start.opacity = 0;
					end.opacity = 1;
				}
				else {
					start.opacity = 1;
					end.opacity = 0;
				}
			},callback);
		},
		fadeOut : function (elem,callback) {
			transform(elem,"FO",function (start,end,c,d) {
				if("I" === d){
					start.opacity = 0;
					end.opacity = 1;
				}
				else {
					start.opacity = 1;
					end.opacity = 0;
				}
			},callback)
		},
		zoomIn  : function () {
		},
		zoomOut : function () {
		}
	};

	lib.Transition = transition;
}(window.lib || (window.lib = {})));