var S = {
    init: function () {
        S.Drawing.init('.canvas');
        var shapeBuilder = new S.ShapeBuilder({
            gap: 10,
            textDivider: '-'
        });
        shapeBuilder.init();
        return shapeBuilder;
    }
};
S.Drawing = {
    init: function (el) {
        var self = this;
        this.canvas = document.querySelector(el);
        this.context = this.canvas.getContext('2d');
        this.adjustCanvas();
        window.addEventListener('resize', function () {
            self.adjustCanvas();
        });
    },
    adjustCanvas: function () {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },
    clearFrame: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    getArea: function () {
        return {w: this.canvas.width, h: this.canvas.height};
    }
};
S.ShapeBuilder = function (options) {
    this.shapeCanvas = document.createElement('canvas');
    this.shapeContext = this.shapeCanvas.getContext('2d');
    this.fontFamily = options.fontFamily || 'Times New Roman';
    this.fontSize = options.fontSize || 800;
    this.textDivider = options.textDivider;
    this.gap = options.gap;
};
S.ShapeBuilder.prototype = {
    init: function () {
        this.fit();
        window.addEventListener('resize', this.fit.bind(this));
    },
    imageFile: function (url, callback) {
        var image = new Image(), self = this,
            a = S.Drawing.getArea();
        image.onload = function () {
            self.shapeContext.clearRect(0, 0, self.shapeCanvas.width, self.shapeCanvas.height);
            self.shapeContext.drawImage(this, 0, 0, a.h * 0.5, a.h * 0.5);
            callback(self.processCanvas());
        };
        image.onerror = function () {
            var error = {'error': '-1'};
            callback(error);
        };
        image.crossOrigin = 'anonymous';
        image.src = url;
    },
    letter: function (l) {
        var s = 0;
        s = Math.min(this.fontSize,
            (this.shapeCanvas.width / this.shapeContext.measureText(l).width) * 0.8 * this.fontSize,
            (this.shapeCanvas.height / this.fontSize) * (isNumber(l) ? 1 : 0.45) * this.fontSize);
        this.setFontSize(s);
        this.shapeContext.clearRect(0, 0, this.shapeCanvas.width, this.shapeCanvas.height);
        if (l.toString()
             .indexOf(this.textDivider) != -1) {
            this.shapeContext.fillText(l.substr(0, l.toString()
                                                    .indexOf(this.textDivider)), this.shapeCanvas.width / 2, this.shapeCanvas.height * 0.3);
            this.shapeContext.fillText(l.substr(l.toString()
                                                 .indexOf(this.textDivider) + 1), this.shapeCanvas.width / 2, this.shapeCanvas.height * 0.7);
        } else {
            this.shapeContext.fillText(l, this.shapeCanvas.width / 2, this.shapeCanvas.height / 2);
        }
        return this.processCanvas();
    },
    fit: function () {
        this.shapeCanvas.width = Math.floor(window.innerWidth / this.gap) * this.gap;
        this.shapeCanvas.height = Math.floor(window.innerHeight / this.gap) * this.gap;
        this.shapeContext.fillStyle = 'red';
        this.shapeContext.textBaseline = 'middle';
        this.shapeContext.textAlign = 'center';
    },
    processCanvas: function () {
        var pixels = this.shapeContext.getImageData(0, 0, this.shapeCanvas.width, this.shapeCanvas.height).data,
            dots = [],
            x = 0,
            y = 0,
            fx = this.shapeCanvas.width,
            fy = this.shapeCanvas.height,
            w = 0,
            h = 0;
        for (var p = 0; p < pixels.length; p += (4 * this.gap)) {
            if (pixels[p + 3] > 0) {
                //如果非透明则添加一个点
                dots.push(new S.Point({
                    x: x,
                    y: y
                }));
                w = x > w ? x : w;
                h = y > h ? y : h;
                fx = x < fx ? x : fx;
                fy = y < fy ? y : fy;
            }
            x += this.gap;
            if (x >= this.shapeCanvas.width) {
                x = 0;
                y += this.gap;
                p += this.gap * 4 * this.shapeCanvas.width;
            }
        }
        return {dots: dots, w: w + fx, h: h + fy};
    },
    setFontSize: function (s) {
        this.shapeContext.font = 'bold ' + s + 'px ' + this.fontFamily;
    },
};
S.Point = function (args) {
    this.x = args.x;
    this.y = args.y;
    this.z = args.z;
    this.a = args.a;
    this.h = args.h;
};



function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}