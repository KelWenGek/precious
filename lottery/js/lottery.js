//奖品设置
var reward = [
    {name: '鸡情澎湃奖', src: ''},
    {name: '鸡积向上奖', src: ''},
    {name: '生鸡勃勃奖', src: ''},
    {name: '生鸡盎然奖', src: ''},
    {name: '金鸡报晓奖', src: ''},
    {name: '最强战斗机奖', src: ''}
];
var all_sign_persongs = [];
var sign_persons_num;
var has_not_lottery_persons;
var has_not_lottery_persons_active;
var sign_persons_sample = [];
var current_round;
var isInitial = false;
var isStop = true;
var text = '2016-抽奖环节',
    line = 0;
var logo_url = 'https://qy.bangongyi.com/statics/party/3D/images/';
// 'logo.png';
if (text.toString()
        .indexOf('-') != -1) {
    line = 1;
}
$('#lottery_list_wrap_inner')
    .slimscroll();
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
//初始化
function lottery_activity_init(callback) {
    var w = window;
    !w.__isLocalStorageNameSupported__ && isLocalStorageNameSupported();
    // 不支持缓存
    if (-1 === w.__isLocalStorageNameSupported__) {
        get_sign_persons(function (data) {
            //通过签到名单中的isLottery来过滤出未中奖人员
            data = _.filter(data, function (item) {
                return item.Winning == 0;
            });
            callback(data);
        });
    } else if (1 === w.__isLocalStorageNameSupported__) {
        var lottery_roster = window.localStorage && window.localStorage.getItem("lottery_roster");
        //缓存存在
        if (null !== lottery_roster) {
            lottery_roster = JSON.parse(lottery_roster);
            // 过滤出未中奖名单,通过缓存中的已中奖人员
            filter_not_lottery(lottery_roster);
            callback(lottery_roster);
        } else {
            //缓存不存在
            get_sign_persons(function (data) {
                window.localStorage && window.localStorage.setItem("lottery_roster", JSON.stringify(data));
                filter_not_lottery(data);
                callback(data);
            });
        }
    }
}
//获取数据
function get_sign_persons(callback) {
    $.ajax({
        url: '/Service/UserList',
        type: 'get',
        dataType: 'json',
        data: {
            UserType: -1,
            IsWin: -1
        },
        success: function (result) {
            console.log(result);
            //if (result.code = '200') {
            //    //所有签到人员
            //    var data = JSON.parse(result.data);
            //    callback(data);
            //}
        },
        error: function () {
        }
    });
    //模拟数据
    _.each(zzhnokia, function (e, i) {
        all_sign_persongs[i] = {};
        all_sign_persongs[i].ID = i;
        all_sign_persongs[i].Avator = e.we_avatar;
        all_sign_persongs[i].RealName = e.RealName || 'kel_' + i;
        all_sign_persongs[i].Phone = e.Phone || '13888888888';
    });
    callback(all_sign_persongs);
}
//过滤出未中奖名单
function filter_not_lottery(data) {
    var has_lottery_persons = window.localStorage
        && window.localStorage.getItem("has_lottery_persons")
        && JSON.parse(window.localStorage.getItem("has_lottery_persons")) || [];
    //渲染结果列表
    console.log(has_lottery_persons);
    if (has_lottery_persons.length) {
        var has_lottery_persons_grouped = _.groupBy(has_lottery_persons, function (item) {
            return item.round;
        });
        //从缓存中添加结果
        _.each(has_lottery_persons_grouped, function (value, key) {
            var html = '', round = Number(key);
            html += '<div>';
            html += '<div class="lottery_list_title">第' + round + '轮</div>';
            html += '<ul id="lottery_list_' + round + '">';
            for (var i = 0; i < value.length; i++) {
                html += '<li class="result-item clearfix" data-id="' + value[i].ID + '">';
                html += '<img class="avatar" src="' + value[i].Avator + '" alt="">';
                html += '<span class="name">' + value[i].RealName + '</span>';
                html += '<span class="phone">' + value[i].Phone.substr(0, 3) + '****' + value[i].Phone.substr(7) + '</span>';
                html += '</li>';
            }
            html += '</ul>';
            html += '</div>';
            if (!$('#lottery_list_' + round)
                    .size()) {
                $('#lottery_list_wrap_inner')
                    .prepend(html);
            }
        });
        console.log(has_lottery_persons_grouped);
        has_not_lottery_persons = _.filter(data, function (item) {
            return _.every(has_lottery_persons, function (value) {
                return value.ID !== item.ID;
            });
        });
    } else {
        has_not_lottery_persons = data;
    }
    return has_not_lottery_persons;
}
//每轮抽奖初始化
function init_per_round(options) {
    var lottery_roster = window.localStorage && window.localStorage.getItem("lottery_roster");
    lottery_roster && (lottery_roster = JSON.parse(lottery_roster));
    options.filter(filter_not_lottery(lottery_roster));
    $('#mask')
        .hide();
    $('#lottery_window')
        .empty()
        .hide();
    $('#lottery_result')
        .hide();
    var html = '';
    html += '<div>';
    html += '<div class="lottery_list_title">第' + options.current_round + '轮</div>';
    html += '<ul id="lottery_list_' + options.current_round + '">';
    html += '</ul>';
    html += '</div>';
    if (!$('#lottery_list_' + options.current_round)
            .size()) {
        $('#lottery_list_wrap_inner')
            .prepend(html);
    }
    lottery_action.init();
    lottery_action.set_num_per(options.lottery_num_per);
}
var lastTime;
function RAF(callback, element) {
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
    var id = window.setTimeout(function () {
            callback(currTime + timeToCall);
        },
        timeToCall);
    lastTime = currTime + timeToCall;
    return id;
}
var raf = null;
//抽奖窗口
var cameraWin, sceneWin, rendererWin;
//动画场景
var objects = [], camera, scene, renderer;
//文字,球
var targets = {table: [], sphere: []};
var animate_start = 0;
//动画初始化
function animation_init(n, f) {

    //第一场景
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 3000;
    scene = new THREE.Scene();
    var d = f.dots;
    var k = d.length;
    if (k < sign_persons_num) {
        alert("您电脑的分辨率不足以支持当前动画的效果，请尝试按F11将电脑全屏，之后刷新页面；或者更换分辨率更高的显示器观看?");
        return
    }
    for (var g = 0; g < k; g++) {
        //创建3d图片元素
        var h = document.createElement("div");
        h.className = "element";
        var j = document.createElement("img");
        //签到人数不够像素点的个数时,超出部分从签到人中随机抽取
        if (typeof (sign_persons_sample[g]) == "undefined") {
            j.src = sign_persons_sample[Math.floor(Math.random() * sign_persons_sample.length)].Avator;
        } else {
            j.src = sign_persons_sample[g].Avator;
        }
        h.appendChild(j);
        // 创建3d图片块
        var e = new THREE.CSS3DObject(h);
        //随机散落在-2000到2000的范围内
        e.position.x = Math.random() * 4000 - 2000;
        e.position.y = Math.random() * 4000 - 2000;
        e.position.z = Math.random() * 4000 - 2000;
        //添加到场景中,并缓存图片块
        scene.add(e);
        objects.push(e);
        //生成文字队列
        var e = new THREE.Object3D();
        if (n == "logo") {
            e.position.x = (d[g].x * 5) - ((window.innerWidth) / 2) - (f.w / 2);
            e.position.y = -(d[g].y * 5) + ((window.innerHeight) / 2) + f.h
        } else {
            e.position.x = (d[g].x * 2) - window.innerWidth;
            e.position.y = -(d[g].y * 2) + window.innerHeight;
        }
        targets.table.push(e);
    }
    var b = new THREE.Vector3();
    for (var g = 0, c = sign_persons_num; g < c; g++) {

        //生成球体队列
        var m = Math.acos(-1 + (2 * g) / c);
        var a = Math.sqrt(c * Math.PI) * m;
        var e = new THREE.Object3D();
        if (sign_persons_num <= 500) {
            //球体的直径
            var q = 1200
        } else {
            if (sign_persons_num > 500 && sign_persons_num <= 800) {
                var q = 1200
            } else {
                var q = 1500
            }
        }
        e.position.x = q * Math.cos(a) * Math.sin(m);
        e.position.y = q * Math.sin(a) * Math.sin(m);
        e.position.z = q * Math.cos(m);
        b.copy(e.position)
         .multiplyScalar(2);
        e.lookAt(b);
        targets.sphere.push(e);
    }
    //生成渲染元素
    renderer = new THREE.CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.className = "opening_animation";
    document.getElementById("lottery_animation")
            .appendChild(renderer.domElement);
    //添加窗口缩放事件
    window.addEventListener("resize", onWindowResize, false);
}
//动画变换
function animation_transform(a, g, d, f) {
    // TWEEN.removeAll();
    scene_init();
    //文字动画
    if (d == 0) {
        //根据文字行数来确认图片大小
        if (line == 0) {
            $(".element")
                .width(40);
            $(".element")
                .height(40);
        } else {
            $(".element")
                .width(30);
            $(".element")
                .height(30);
        }
        if ($(".element").length > sign_persons_num) {
            $(".element")
                .show();
        }
        for (var c = 0; c < objects.length; c++) {
            var b = objects[c];
            var e = a[c];
            new TWEEN.Tween(b.position).to({x: e.position.x, y: e.position.y, z: e.position.z}, Math.random() * g + g)
                                       .easing(TWEEN.Easing.Exponential.InOut)
                                       .start();
            new TWEEN.Tween(b.position).to({x: -9500, z: e.position.z}, Math.random() * 1000 + 2000)
                                       .delay(Math.random() * 1000 + (f * 1000 - 2500))
                                       .start();
            new TWEEN.Tween(b.rotation).to({x: e.rotation.x, y: e.rotation.y, z: e.rotation.z}, Math.random() * g + g)
                                       .easing(TWEEN.Easing.Exponential.InOut)
                                       .start();
        }
    }

    //球体动画
    else {
        if ($(".element").length > sign_persons_num) {
            $(".element")
                .slice(sign_persons_num)
                .hide();
        }
        for (var c = 0; c < sign_persons_num; c++) {
            var b = objects[c];
            var e = a[c];
            new TWEEN.Tween(b.position).to({x: e.position.x, y: e.position.y, z: e.position.z}, Math.random() * g + g)
                                       .easing(TWEEN.Easing.Exponential.InOut)
                                       .start();
            new TWEEN.Tween(b.rotation).to({x: e.rotation.x, y: e.rotation.y, z: e.rotation.z}, Math.random() * g + g)
                                       .easing(TWEEN.Easing.Exponential.InOut)
                                       .start();
        }
    }
    //设置一个空动画与下面相同定时时间
    new TWEEN.Tween(this).to({}, g * f / 2)
                         .onUpdate(function () {
                             render(d);
                         })
                         .start();
    var timer = setTimeout(function () {
        rotationY_add = 0;
        animate_start = 0;
        d = 1;
        if (d == 0) {
            if (line == 0) {
                $(".element")
                    .width(30);
                $(".element")
                    .height(30);
            } else {
                $(".element")
                    .width(20);
                $(".element")
                    .height(20);
            }
        } else {
            $(".element")
                .width(120);
            $(".element")
                .height(120);
        }
        animation_transform(targets.sphere, 2000, d, 20);
    }, f * 1000);
}
//开始动画循环
function animation_update() {
    requestAnimationFrame(animation_update);
    TWEEN.update()
}
//场景渲染
function render(a) {
    if (a == 0) {
        animate_start += 1;
        if (animate_start > 1600) {
            if (scene.position.z > 0) {
                scene.position.z -= 7
            }
        } else {
            if (animate_start > 900) {
                scene.position.z = scene.position.z
            } else {
                if (animate_start > 200) {
                    scene.position.z += 7
                }
            }
        }
    }
    if (a == 1) {
        animate_start += 1;
        //让球体旋转
        scene.rotation.y += 0.02;
    }
    renderer.render(scene, camera);
}
//抽奖活动初始化
function lottery_init(data) {
    var type;
    sign_persons_num = data.length;
    sign_persons_sample = _.sample(data, 80);
    //动画初始化
    var canvas_helper = S.init();
    canvas_helper.imageFile(logo_url, function (obj) {
        if (obj.error == '-1') {
            //图片载入出问题启用文字代替
            obj = canvas_helper.letter(text);
            type = 'text';
        } else {
            type = 'logo';
        }
        setTimeout(function () {
            animation_init(type, obj);
            animation_update();
            animation_transform(targets.table, 2000, 0, 10);
        }, 100);
    });
}
//抽检动作
var lottery_action = (function () {
    var objectsWin = [];
    var current = [], num;
    var zIndex = 0;
    //抽奖初始化
    var init = function () {
        objectsWin = [];
        cameraWin = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        cameraWin.position.z = 3000;
        sceneWin = new THREE.Scene();
        for (var g = 0; g < has_not_lottery_persons_active.length; g++) {

            //生成抽奖窗口图片
            var h = document.createElement("div");
            h.className = "win";
            var nameElem = document.createElement('div');
            nameElem.className = 'name';
            nameElem.innerText = has_not_lottery_persons_active[g].RealName;
            var j = document.createElement("img");
            j.className = 'thumb';
            j.src = has_not_lottery_persons_active[g].Avator;
            h.appendChild(j);
            h.appendChild(nameElem);
            // 创建3d图片块
            var e = new THREE.CSS3DObject(h);
            e.position.z = 2500;
            //添加到场景中,并缓存图片块
            sceneWin.add(e);
            objectsWin.push({
                elem: e,
                Avator: has_not_lottery_persons_active[g].Avator,
                ID: has_not_lottery_persons_active[g].ID,
                RealName: has_not_lottery_persons_active[g].RealName,
                Phone: has_not_lottery_persons_active[g].Phone
            });
        }
        //todo 添加当前轮次奖品作为第一张图片
        var h = document.createElement("div");
        h.className = "win";
        var nameElem = document.createElement('div');
        nameElem.className = 'name';
        nameElem.innerText = reward[current_round - 1].name;
        var j = document.createElement("img");
        j.className = 'thumb';
        j.src = reward[current_round - 1].src;
        h.appendChild(j);
        h.appendChild(nameElem);
        // 创建3d图片块
        var e = new THREE.CSS3DObject(h);
        e.position.z = 2500;
        sceneWin.add(e);
        console.log(objectsWin.length);
        //生成抽奖窗口
        rendererWin = new THREE.CSS3DRenderer();
        rendererWin.domElement.style.position = "absolute";
        rendererWin.domElement.style.zIndex = "2500";
        rendererWin.domElement.className = "lottery_avatar";
        rendererWin.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('lottery_window')
                .appendChild(rendererWin.domElement);
    };

    function start() {
        if ($('#lottery_window')
                .css('display') == 'none') {
            $('#lottery_window')
                .show();
        }
        $('#lottery_result')
            .hide();
        $('#mask')
            .show();
        raf = RAF(start);
        for (var i = 0; i < objectsWin.length; i++) {
            objectsWin[i].elem.position.z = 2500;
        }
        //取出随机中奖人员
        current = _.sample(objectsWin, num || 1);
        current[0].elem.position.z = 2501;
        rendererWin.render(sceneWin, cameraWin);
    }

    function stop() {
        var has_lottery_persons = window.localStorage
            && window.localStorage.getItem("has_lottery_persons")
            && JSON.parse(window.localStorage.getItem("has_lottery_persons")) || [];
        //取出随机中奖人员
        //更新人员数组
        var ave = Math.floor(5 / 2);
        var row = 1;
        var IDs = [];
        //每一轮抽奖结束时展示中奖人员
        $('#lottery_list_wrap_inner')
            .scrollTop(0);
        $('#lottery_result')
            .show();
        //添加动画
        current.forEach(function (item, i) {
            //移除掉已经中奖的人
            var idx = _.findIndex(objectsWin, function (value) {
                return value.ID == item.ID;
            });
            objectsWin[idx].elem.position.z = 2500;
            objectsWin[idx].elem.dispatchEvent({type: 'removed'});
            objectsWin.splice(idx, 1);
        });
        current.forEach(function (item, i) {
            //移除掉已经中奖的人
            // var idx = _.findIndex(objectsWin, function (value) {
            //     return value.ID == item.ID;
            // });
            // objectsWin[idx].elem.position.z = 2500;
            // objectsWin[idx].elem.dispatchEvent({type: 'removed'});
            // objectsWin.splice(idx, 1);
            IDs.push(item.ID);
            has_lottery_persons.push({
                ID: item.ID,
                Avator: item.Avator,
                RealName: item.RealName,
                Phone: item.Phone,
                round: current_round
            });
            //换行
            if (i % 5 == 0) {
                // row += 1;
                zIndex += 1;
            }
            // * (1 - row)
            //移动
            var translate = new TWEEN.Tween(item.elem.position)
            // .to({
            //     x: -150 * (ave - i % 5),
            //     y: -150 + window.innerHeight / 2,
            //     z: 2500 + zIndex
            // }, 500)
            //todo 飞行坐标
                .to({
                    x: window.innerWidth / 2 - 500,
                    y: window.innerHeight / 2 - 80,
                    z: 2500 + zIndex
                }, 500)
                .onUpdate(function () {
                    rendererWin.render(sceneWin, cameraWin);
                })
                .onComplete(function () {
                    var html = '';
                    html += '<li class="result-item clearfix" data-id="' + item.ID + '">';
                    html += '<img class="avatar" src="' + item.Avator + '" alt="">';
                    html += '<span class="name">' + item.RealName + '</span>';
                    html += '<span class="phone">' + item.Phone.substr(0, 3) + '****' + item.Phone.substr(7) + '</span>';
                    html += '</li>';
                    $('#lottery_list_' + current_round)
                        .prepend(html);
                })
                .delay(i * 500)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();
            //缩放
            var resize = new TWEEN.Tween(item.elem.scale)
            // .to({x: 0.5, y: 0.5, z: 0.5}, 500)
                .to({x: 0, y: 0, z: 0}, 500)
                .onUpdate(function () {
                    rendererWin.render(sceneWin, cameraWin);
                })
                .delay(i * 500)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();
            //旋转
            var rotate = new TWEEN.Tween(item.elem.rotation)
                .to({z: 2 * Math.PI}, 500)
                .onUpdate(function () {
                    rendererWin.render(sceneWin, cameraWin);
                })
                .delay(i * 500)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();
        });
        clearTimeout(raf);
        console.log(current);
        console.log(has_lottery_persons);
        window.localStorage.setItem('has_lottery_persons', JSON.stringify(has_lottery_persons));
        //向服务器保存中奖名单
        //$.ajax({
        //    type: 'post',
        //    url: '',
        //    dataType: 'json',
        //    data: {
        //        round: current_round,
        //        ids: IDs.join(',')
        //    },
        //    success: function (result) {
        //    },
        //    error: function () {
        //    }
        //});
    }

    return {
        init: init,
        start: start,
        stop: stop,
        //设置单轮产生的中奖人数
        set_num_per: function (n) {
            num = n;
        }
    };
})();
//窗口缩放
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
    cameraWin.aspect = window.innerWidth / window.innerHeight;
    cameraWin.updateProjectionMatrix();
    rendererWin.setSize(window.innerWidth, window.innerHeight);
    rendererWin.render(sceneWin, cameraWin);
}
//场景初始化
function scene_init() {
    scene.position.x = 0;
    scene.position.y = 0;
    scene.position.z = 0;
    scene.rotation.x = 0;
    scene.rotation.z = 0
}
$(document)
    .ready(function () {
        lottery_activity_init(lottery_init);
        document.addEventListener('keydown', function (event) {

            //字母L键
            if (event.keyCode == 76) {
                window.localStorage.clear();
            }
            //字母Z键
            if (event.keyCode == 90) {
                $('#lottery_window')
                    .hide();
                $('#mask')
                    .hide();
                $('#lottery_result')
                    .show();
            }
            //字母X键
            if (event.keyCode == 88) {
                $('#lottery_result')
                    .hide();
                $('#lottery_window')
                    .show();
                $('#mask')
                    .show();
            }
            //按数字1代表第一轮抽奖
            if (event.keyCode == 49) {
                current_round = 1;
                init_per_round({
                    lottery_num_per: 10,
                    current_round: current_round,
                    filter: function (data) {
                        has_not_lottery_persons_active = _.filter(data, function (item, i) {
                            return true;
                        });
                    }
                });
            }
            //按数字2代表第二轮抽奖
            if (event.keyCode == 50) {
                current_round = 2;
                init_per_round({
                    lottery_num_per: 5,
                    current_round: current_round,
                    filter: function (data) {
                        has_not_lottery_persons_active = _.filter(data, function (item, i) {
                            return true;
                        });
                    }
                });
            }
            //按数字3代表第三轮抽奖
            if (event.keyCode == 51) {
                current_round = 3;
                init_per_round({
                    lottery_num_per: 2,
                    current_round: current_round,
                    filter: function (data) {
                        has_not_lottery_persons_active = _.filter(data, function (item, i) {
                            return true;
                        });
                    }
                });
            }
            //按数字4代表第四轮抽奖
            if (event.keyCode == 52) {
                current_round = 4;
                init_per_round({
                    lottery_num_per: 1,
                    current_round: current_round,
                    filter: function (data) {
                        has_not_lottery_persons_active = _.filter(data, function (item, i) {
                            return true;
                        });
                    }
                });
            }
            //按数字5代表第五轮抽奖
            if (event.keyCode == 53) {
                current_round = 5;
                init_per_round({
                    lottery_num_per: 1,
                    current_round: current_round,
                    filter: function (data) {
                        has_not_lottery_persons_active = _.filter(data, function (item, i) {
                            return true;
                        });
                    }
                });
            }
            //按数字6代表第六轮抽奖
            if (event.keyCode == 54) {
                current_round = 6;
                init_per_round({
                    lottery_num_per: 1,
                    current_round: current_round,
                    filter: function (data) {
                        has_not_lottery_persons_active = _.filter(data, function (item, i) {
                            return true;
                        });
                    }
                });
            }
            //添加空格按键事件
            if (event.keyCode == 32) {
                // if (!isInitial) {
                //     isInitial = true;
                //     lottery_action.init();
                //     lottery_action.set_num_per(10);
                // }
                if (isStop) {
                    isStop = false;
                    lottery_action.start();
                } else {
                    isStop = true;
                    lottery_action.stop();
                }
            }
        }, false);
        //中奖名单列表项点击效果,弹窗显示中奖人员信息
        $('#lottery_result')
            .on('click', '.result-item', function () {
                console.log($(this)
                    .data('id'));
            });
    });


