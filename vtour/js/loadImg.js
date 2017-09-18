define(function(require, exports, module) {
    return function (imgUrl,loadComplete,setLoadingInfo){
        var len = imgUrl.length;
        var num = 0;
        var checkLoad = function(){
            num++;
            setLoadingInfo && setLoadingInfo(parseInt(num/len*100));
            if( num == len ){
                loadComplete && loadComplete();
            }
        };
        var checkImg = function(url){
            var val= url;
            var img=new Image();
            img.onload=function(){
                if(img.complete==true){
                    checkLoad();
                }
            };
            img.src=val;
        };

        for( var i = 0; i < len; i++ ){
            checkImg(imgUrl[i]);
        }
    }
});