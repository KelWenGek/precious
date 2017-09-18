var resolution = (function () {
	//设置rem
	var Resolution = {};

	function setRem() {
		var a = docEl.getBoundingClientRect().width;
		a / initScaleRate > 540 && (a = 540 * initScaleRate);
		var d = a / 10;
		docEl.style.fontSize = d + "px";
		Resolution.rem = window.rem = d;
	}

	var timer,
		docEl = document.documentElement,
		viewPort = document.querySelector('meta[name="viewport"]'),
		flexible = document.querySelector('meta[name="flexible"]'),
		initScaleRate = 0,
		initScale = 0;
	if (viewPort) {
		//将根据已有的meta[name="viewport"]标签来设置缩放比例
		var initScaleValue = viewPort.getAttribute("content").match(/initial\-scale=([\d\.]+)/);
		initScaleValue && (initScale = parseFloat(initScaleValue[1]), initScaleRate = parseInt(1 / initScale));
	}
	else {
		//将根据已有的meta[name="flexible"]标签来设置缩放比例
		if (flexible) {
			var flexibleContent = flexible.getAttribute("content");
			if (flexibleContent) {
				var initDpr = flexibleContent.match(/initial\-dpr=([\d\.]+)/), maxDpr = flexibleContent.match(
					/maximum\-dpr=([\d\.]+)/);
				initDpr && (initScaleRate = parseFloat(initDpr[1]), initScale = parseFloat(
					(1 / initScaleRate).toFixed(2)));
				maxDpr && (initScaleRate = parseFloat(maxDpr[1]), initScale = parseFloat(
					(1 / initScaleRate).toFixed(2)));
			}
		}
	}
	//页面没有meta来设置initScaleRate,initScale,在此处设置
	if (!initScaleRate && !initScale) {
		var userAgent = window.navigator.userAgent, userAgentType = ( !!userAgent.match(/android/gi), !!userAgent.match(
			/iphone/gi)), isOS9_3 = userAgentType && !!userAgent.match(/OS 9_3/), defaultDpr = window.devicePixelRatio;
		//检验客户端本和客户端的dpr,来确定initScaleRate和initScale
		initScaleRate = userAgentType && !isOS9_3
			? defaultDpr >= 3 && (!initScaleRate || initScaleRate >= 3)
			? 3
			:
			defaultDpr >= 2 && (!initScaleRate || initScaleRate >= 2)
				? 2
				: 1
			: 1;
		initScale = 1 / initScaleRate;
	}
	docEl.setAttribute("data-dpr", initScaleRate + '');

	//如果页面没有设置meta,添加meta标签并添加head标签
	if (!viewPort) {
		viewPort = document.createElement("meta");
		viewPort.setAttribute("name", "viewport");
		viewPort.setAttribute("content",
			"initial-scale=" + initScale + ", maximum-scale=" + initScale + ", minimum-scale=" + initScale + ", user-scalable=no");
		if (docEl.firstElementChild) {
			docEl.firstElementChild.appendChild(viewPort)
		}
		else {
			var div = document.createElement("div");
			div.appendChild(viewPort);
			document.write(div.innerHTML);
		}
	}

	"complete" === document.readyState
		? document.body.style.fontSize = 14 * initScaleRate + "px"
		:
		document.addEventListener("DOMContentLoaded", function () {
			document.body.style.fontSize = 14 * initScaleRate + "px";
		}, false);

	//设置并导出resolution util
	Resolution.dpr = window.dpr = initScaleRate;
	//resolution init 当页面需要设置rem时调用
	Resolution.init = function () {
		setRem();
		window.addEventListener("resize", function () {
			clearTimeout(timer);
			timer = setTimeout(setRem, 10);
		}, false);
		window.addEventListener("pageshow", function (event) {
			event.persisted && (clearTimeout(timer), timer = setTimeout(setRem, 10))
		}, false);
	};

	//刷新rem
	Resolution.refreshRem = setRem;

	//rem转换成px
	Resolution.rem2px = function (d) {
		var c = parseFloat(d) * this.rem;
		"number" == typeof d && (c += "px");
		"string" == typeof d && d.match(/rem$/) && (c += "px");
		return c;
	};
	//px转成rem
	Resolution.px2rem = function (d) {

		var c = parseFloat(d) / this.rem;
		c = c.toFixed(2);
		"number" == typeof d && (c += "rem");
		"string" == typeof d && d.match(/px$/) && (c += "rem");
		return c;
	};

	return Resolution;
})();