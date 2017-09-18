(function (lib) {

	var sessionStorage = window.sessionStorage || null;


	var pageNav = {


		has3d: function () {
			var a = ["&#173;", '<style id="smodernizr">', "@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}", "</style>"].join(""), b = !1,
				c = document.createElement("div"),
				d = document.documentElement.style;
			c.id = "modernizr";
			c.innerHTML += a;
			document.body.appendChild(c);
			"WebkitPerspective" in d && "webkitPerspective" in d && (b = 9 === c.offsetLeft && 3 === c.offsetHeight);
			c.parentNode.removeChild(c);
			return b;
		},

		pageTransition: function (b) {
			var c = $(b.parent),
				d = $(b.cur),
				e = window.pageYOffset;
			if (sessionStorage) try {
				sessionStorage.setItem("h5cdetailtransition", e);
			} catch (f) {
			}
			var g = this.has3d(),
				h = g ? "translate3d(" : "translate(",
				j = g ? ",0)" : ")";
			d.css({
				position           : "absolute",
				top                : 0,
				left               : "100%",
				width              : "100%",
				height             : "100%",
				"z-index"          : 201,
				"-webkit-transform": h + "0,0" + j
			});
			d.removeClass("none");
			lib.Transition.move(d[0], -window.innerWidth, 0, function () {
				window.scrollTo(0, 0);
				c.addClass("none");
				d.attr("style", "");
				d.css({
					minHeight: window.innerHeight
				});
			});

		}
	};
	lib.PageNav = pageNav;
}(window.lib || (window.lib = {})));