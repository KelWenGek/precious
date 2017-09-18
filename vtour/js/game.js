define(function(require, exports, module) {

    require("./common");
    var loadImg = require("./loadImg");

    var imgArr = [
        resource_path + "images/game_loading.png",
        resource_path + "images/mg_b.jpg",
        resource_path + "images/mg_d.jpg",
        resource_path + "images/mg_f.jpg",
        resource_path + "images/mg_l.jpg",
        resource_path + "images/mg_r.jpg",
        resource_path + "images/mg_u.jpg",
        resource_path + "images/img_01.png",
        resource_path + "images/img_02.png",
        resource_path + "images/img_03.png",
        resource_path + "images/img_04.png",
        resource_path + "images/img_05.png",
        resource_path + "images/img_06.png",
        resource_path + "images/img_07.png",
        resource_path + "images/img_08.png",
        resource_path + "images/img_09.png",
        resource_path + "images/img_10.png",
        resource_path + "images/img_11.png",
        resource_path + "images/pic_01.png",
        resource_path + "images/pic_02.png",
        resource_path + "images/pic_03.png",
        resource_path + "images/pic_04.png",
        resource_path + "images/pic_05.png",
        resource_path + "images/pic_06.png",
        resource_path + "images/pic_07.png",
        resource_path + "images/pic_08.png",
        resource_path + "images/pic_09.png",
        resource_path + "images/pic_10.png",
        resource_path + "images/pic_11.png"
    ];
    var loading = $(".game_loading"),loadingData = $(".loading_data");
    loadImg(imgArr,function(_imgs){
        loading.remove();
        timers1 = setInterval("time()", 1000);
    },function(_per){
        loadingData.html(_per+"%");
    });

    if($(window).height() < 1040){
        $(".loading").css("height", "1040px");
    }else{
        $(".loading").css("height", "100%");
    }

});