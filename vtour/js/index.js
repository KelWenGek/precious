define(function(require, exports, module) {

    require("./common");
    var loadImg = require("./loadImg");

    var imgArr = [
        resource_path + "images/loading.gif",
        resource_path + "images/loading_text.png",
        resource_path + "images/loading_bg.jpg",
        resource_path + "images/anniu.png",
        resource_path + "images/dong.png",
        resource_path + "images/random15008_98508.png",
        resource_path + "images/random21911_80384.png",
        resource_path + "images/random24683_34967.png",
        resource_path + "images/random27823_22696.png",
        resource_path + "images/random29810_30699.png",
        resource_path + "images/random31434_38977.png",
        resource_path + "images/random31473_29879.png",
        resource_path + "images/random32105_92644.png",
        resource_path + "images/random33879_82583.png",
        resource_path + "images/random40293_95943.png",
        resource_path + "images/random43493_44938.png",
        resource_path + "images/random46318_54398.png",
        resource_path + "images/random49305_15048.png",
        resource_path + "images/random49741_1329.png",
        resource_path + "images/random5183_24021.png",
        resource_path + "images/random57470_6381.png",
        resource_path + "images/random58969_67352.png",
        resource_path + "images/random60842_6284.png",
        resource_path + "images/random61084_80696.png",
        resource_path + "images/random62357_45060.png",
        resource_path + "images/random65289_72142.png",
        resource_path + "images/random6652_52352.png",
        resource_path + "images/random66768_52192.png",
        resource_path + "images/random71592_93133.png",
        resource_path + "images/random7287_53235.png",
        resource_path + "images/random73703_29591.png",
        resource_path + "images/random81788_68220.png",
        resource_path + "images/random8257_46192.png",
        resource_path + "images/random82800_3947.png",
        resource_path + "images/random88212_31019.png",
        resource_path + "images/random88687_28674.png",
        resource_path + "images/random8977_89869.png",
        resource_path + "images/random90346_71738.png",
        resource_path + "images/random97865_8478.png",
        resource_path + "images/sdfxdgfdg.png",
        resource_path + "images/shan.png",
        resource_path + "images/pic_before_sm.png",
        resource_path + "images/pic_before_sm01.png",
        resource_path + "images/pic_prize_list.jpg"
    ];
    var loading = $(".loading"),loadingData = $(".loading_data");
    loadImg(imgArr,function(_imgs){
        // loading.remove();
    },function(_per){
        loadingData.html('<div class="loading_text"></div>'+_per+"%");
    });

    $(function(){
        // $(".guide").click(function(){
        // 	$(this).fadeOut(500);
        // 	$(".index").fadeIn(500);
        // 	setTimeout(function(){
        // 		$(".index .talk").fadeIn(500);
        // 		setTimeout(function(){
        // 			$(".index .talk").fadeOut(500);
        // 			setTimeout(function(){
        // 				$(".index .btn_01").fadeIn(200);
        // 			},500);
        // 		},1500);
        // 	},800);
        // })
        $(".btn_01").click(function(){
            $(".index .hunt_box").show();
        });
        $(".btn_02").click(function(){
            $(".index").fadeOut(500);
            setTimeout('$(".rule_box").addClass("on")',200);
        });
        $(".btn_03").click(function(){
            $(".index").fadeOut(500);
            //$(".list").fadeIn(500);
            setTimeout('$(".my_reward_box").addClass("on")',200);
        });
        $(".btn_back").click(function(){
            //$(".list").fadeOut(500);
            setTimeout('$(".my_reward_box").removeClass("on")',200);
            setTimeout('$(".rule_box").removeClass("on")',200);
            $(".index").fadeIn(500);
        });
        //$(".btn_tj").click(function(){
        //	$(".suc").show();
        //	$(".two").hide();
        //})
        //$(".btn_share,.suc_share").click(function(){
        //	$(".share_box").show();
        //})
        $(".share_box").click(function(){
            $(this).hide();
        });
        $(".ico_close").click(function(){
            $(".award_situation").hide();
        });
        $(".btn_detail").click(function(){
            $(".award_situation").show();
        })

    });
    if($(window).height() < 1040){
        $(".wrap").css("height", "1040px");
    }else{
        $(".wrap").css("height", "100%");
    }
    //鍒ゆ柇缁堢
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        // alert(navigator.userAgent);
        $("#bood").addClass("before");
    } else if (/(Android)/i.test(navigator.userAgent)) {
        // alert(navigator.userAgent);
        $("#bood").addClass("brf");
    } else {
    };



});