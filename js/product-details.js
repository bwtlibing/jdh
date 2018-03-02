/**
 * Created by admin on 2017/9/18.
 */

window.onload=function () {
    (function () {
        /*获取url携带的参数*/
        var parameter=urlData();
        var collectPage=parameter.page||1;
        var fromLaunch=parameter.fromLaunch;
/*-----------调用接口开始------------------*/
         var isCollect=undefined;
         var collectId=undefined;
        /*商品详情接口*/
        queryProductDetail();
        function queryProductDetail() {
            ajaxJson({ type:'get',
                url:'product/detail',
                async:true,
                data:{},
                params:{
                    product_id:parameter.productId
                },
                success:function (result) {
                    console.log(result.data);
                    if(result.resultCode=='0'){
                        productDetailHtml(result.data);
                        isCollect=result.data.collected;
                        collectId=result.data.collectId;
                        var thisChild =getId('collectImg');
                        if(isCollect){
                            thisChild.src = '../../img/product-details-img/yiShouCang.png';
                        }else {
                            thisChild.src = '../../img/product-details-img/shouCang.png';
                        }
                        SwitchFocus();/*切换按钮*/
                    }else if(result.resultCode=='28'){
                        alertBox('商品不存在或者已下架');
                    }else if(result.resultCode=='10'){
                        alertBox('用户登录超时');
                    }
                },
                error:function (status) {
                    window.location.href='../error.html';
                }
            });
        }
        var dataImgLength;
        var isVideo=false;
        var video1;
        function productDetailHtml(data) {/*商品详情赋值*/
            //大图片
            var bigImg = getId('bigImg');
            var smallImgBox = getClass('small-img-box')[0];
            var smallImgHtml = null;
            var smallImg = getClass('small-img');
            dataImgLength = data.images.length;
            if (data.videoCodeHd) {/*视频*//*测试完需要放开*/
                isVideo=true;
                var videoCode=data.videoCodeHd;
                video1=new VideoPlay('plyIfrOne',320,320,157,170,videoCode,'plyIfrBox');/*准备播放正确的视频播放位置*/

                //小图片
                imgChangeStatus();
                smallImg[0].src='../../img/videoTip.png';
            } else {
                bigImg.src = subLink(data.images[0]);
                bigImg.style.display = 'block';
                //小图片
                imgChangeStatus();
            }
            function imgChangeStatus() {
                for (var i = 0; i < 4; i++) {

                     if(data.images[i]){
                         smallImgHtml='<img class="img-item menu-item small-img" src="'+ subLink(data.images[i])+'" alt="">';
                     }else {
                         smallImgHtml='<img class="img-item menu-item small-img" src="../../img/noProduct.png" alt="">';
                     }
                    smallImgBox.innerHTML+=smallImgHtml;
                }
                if( data.images.length>4){
                    // if( true){
                    if(data.images.length==6){
                        // if(true){
                        /*smallImgBox.innerHTML+='<img class="img-item menu-item small-img" src="../../img/noProduct.png" alt="">'
                            +'<img class="img-item menu-item small-img" src="../../img/noProduct.png" alt="">';*/

                        smallImgBox.innerHTML+='<img class="img-item menu-item small-img" src="'+subLink(data.images[4])+'" alt="">'
                            +'<img class="img-item menu-item small-img" src="'+ data.images[5]+'" alt="">';

                        smallImg[4].style.display = 'none';

                        smallImg[5].style.display = 'none';
                    }else if(data.images.length==5){
                        // }else if(true){

                        smallImgBox.innerHTML+='<img class="img-item menu-item small-img" src="'+ subLink(data.images[4])+'" alt="">';
                        smallImg[data.images.length-1].style.display = 'none';
                        // smallImg[4].style.display = 'none';
                    }
                }
            }
            /*商家ID赋值*/
            var serller = getId('seller');
            if (data.seller) {
                //商家图片名称；
                var sellerImage = getId('sellerImage');
                sellerImage.src = subLink(data.seller.image);
                sellerImage.dataset.sellerid = data.seller.id;
                var sellerName = getId('sellerName');
                sellerName.innerHTML = data.seller.name;
                serller.style.display = 'block'
            } else {

                serller.style.display = 'none'
            }
            /*商品名称*/
             textHtml('productName',data.productName);
            /*商品销量*/
            textHtml('salesVolumn',data.salesVolumn);
            /*商品描述*/
            textHtml('description',data.description);
            /*实际价格*/
            textHtml('realPrice',data.realPrice/100);
            /*市场价格*/
            textHtml('marketPrice',data.marketPrice/100);
             /*活动标签*/
            // var  activeList =getClass('activityList');
            var discountActivity=getId('discount-activity');
            if(data.discountsAndAllowances.length>0){
                discountActivity.style.display='block';
                var activeUl=getId('activeUl');
                var liHtml=undefined;
                activeUl.innerHTML=null;
                for(var j=0;j<data.discountsAndAllowances.length;j++){
                    liHtml='<li class="activityList">'+data.discountsAndAllowances[j]+'</li>';
                    activeUl.innerHTML+=liHtml;
                }
            }else {
                    discountActivity.style.display='none';
            }
            /*商品详情*/
            textHtml('detail',data.detail);
        }

        /*立即下单接口*/
        function submitOrder() {
            ajaxJson({ type:'get',
                url:'order/is-old-user',
                async:true,
                data:{},
                params:{},
                success:function (result) {
                    if(result.resultCode=='0'){
                        if(result.data){
                            window.location.href='../order/order_sure_oldUser.html?productId='+parameter.productId;
                        }else {
                            window.location.href='../order/order_sure_newUser.html?productId='+parameter.productId;
                        }
                    }else if(result.resultCode=='10') {
                       alertBox('登录超时')
                    }
                },
                error:function (status) {
                    console.log(status);
                    window.location.href='../error.html';
                }
            });
        }

        /*收藏商品接口*/

        function collectGoods() {
            ajaxJson({ type:'post',
                url:'order/add-collect',
                async:true,
                data:{},
                params:{
                    product_id:parameter.productId
                },
                success:function (result) {
                    if (result.resultCode=='0'){
                        isCollect=true;
                        collectId=result.data;
                        var collectImg=getId('collectImg');
                        collectImg.src = '../../img/product-details-img/yiShouCang.png';
                    }else if(result.resultCode=='10'){
                        alertBox('登录超时')
                    }
                },
                error:function (status) {
                    console.log(status)
                }
            });
        }

        /*删除收藏商品接口*/

        function deleteCollectGoods() {
            ajaxJson({
                type: 'post',
                url: 'order/delete-collect',
                async: true,
                data: {},
                params: {
                    collect_id: collectId
                },
                success: function (result) {
                    if (result.resultCode == '0') {
                        isCollect = false;
                        var collectImg = getId('collectImg');
                        collectImg.src = '../../img/product-details-img/shouCang.png';
                    }
                },
                error: function (status) {
                    console.log(status)
                }
            });
        }

/*---------------调用接口结束-----------------------*/

        /*遥控器切换焦点框*/

        function SwitchFocus() {
            var menuList = document.getElementsByClassName('menu-item');
            var menuLisLength = menuList.length - 1;
            var smallImg=getClass('small-img');
            var i = 0;
            var upIndex=2;
            var downIndex;
            initStyle();
            function initStyle() {//初始化样式
                for (var j = 0; j <= menuLisLength; j++) {
                    menuList[j].style.border = '3px solid transparent';
                }
            }
            menuList[0].style.border = '3px solid yellowgreen';

            window.document.onkeypress=document.onirkeypress = function (event) {

                event = event ? event : window.event;
                var keyCode = event.which ? event.which : event.keyCode;

                if((keyCode<37||keyCode>40)&&keyCode!=13){
                    if (keyCode == 8 || keyCode == 24 || keyCode == 32){/*返回键*/
                        if(fromLaunch=='true'){
                            var sValue = Utility.setValueByName("exitIptvApp");
                        }else {
                            window.history.back();
                        }
                    } else {
                        if (isVideo){
                            video1.playKeyPress(event);/*视频声音加减暂停按键*/
                        }
                    }
                    return;
                }

                var alertBox=getId('alertModal');/*隐藏弹出框*/
                if(alertBox.style.display=='block'){
                    alertBox.style.display='none';
                    menuList[i].style.borderColor = 'yellowgreen';
                    return;
                }
                initStyle();//初始化样式
                if (keyCode == 39) {//右
                    right();
                    imageSwitcher('right');
                    rightSwithImgPosition();
                }
                if (keyCode == 37) {//左
                    left();
                    imageSwitcher('left');
                    leftSwithImgPosition();
                }
                if (keyCode == 38) {//上
                    up();
                    imageSwitcher('up')
                }
                if (keyCode == 40) {//下
                    down();
                    imageSwitcher('down')
                }
                if (keyCode == 13) {//ok键

                    menuList[i].style.borderColor = 'yellowgreen';
                    if (i == '0') {
                        window.location.href='../user/user.html?collectPage='+collectPage;
                    }else if (i == menuList.length-3) {
                        var sellerId=getId('sellerImage').dataset.sellerid;
                        if(sellerId){
                            window.location.href = '../merchant-detail/merchant_detail_shopDes.html?sellerId='+sellerId;
                        }else {

                        }
                    } else if (i == menuList.length-2) {

                        /*立即下单接口*/
                        submitOrder();
                    } else if (i == menuList.length-1) {
                        /*收藏商品接口*/
                        if(isCollect){/*如果是收藏，点击删除收藏*/
                            deleteCollectGoods();
                        }else {/*如果未收藏，点击则收藏商品*/
                            collectGoods();
                        }
                    }
                }
                // playKeyPress(event);/*视频声音加减暂停按键*/
            };

            function imageSwitcher(direction) {/*切换图片*/
                var bigImg = getId('bigImg');
                var Src = menuList[i].src;
                var plyIfr = getId('plyIfrOne');
                if(i=='2'){
                    if(isVideo){
                        plyIfr.style.display = 'block';
                        bigImg.style.display = 'none';
                        if(direction=='left'){
                            video1.replay();
                            console.log('播放视频');
                        }
                    }else {
                        bigImg.src = Src;
                        bigImg.style.display = 'block';
                    }
                } else  if (i>2&&i<=smallImg.length+1) {
                    if(isVideo){
                        // 停止并隐藏视频
                        video1.stop();
                        plyIfr.style.display = 'none';
                    }else {
                        console.log('没有视频资源')
                    }
                    bigImg.style.display = 'block';
                    bigImg.src = Src;
                }
            }
            function rightSwithImgPosition() {

                if(smallImg.length>4){
                    if(dataImgLength==6){/*小图片长度等于6*/
                        if(i==5){
                            smallImg[smallImg.length-2].style.display='inline-block';
                            smallImg[0].style.display='none';
                        }else if(i==smallImg.length) {
                            smallImg[0].style.display='none';
                            smallImg[1].style.display='none';
                            smallImg[smallImg.length-1].style.display='inline-block';
                        }
                    }else if(dataImgLength==5){/*小图片长度等于5*/

                        if(i==5){
                            smallImg[smallImg.length-1].style.display='inline-block';
                            smallImg[0].style.display='none';

                        }/*else if(i==smallImg.length) {
                            smallImg[0].style.display='none';
                            smallImg[smallImg.length-1].style.display='inline-block';
                        }*/
                    }
                }
            }
            function leftSwithImgPosition() {
                if(smallImg.length>4){
                    if(dataImgLength==6){
                        if(i==4){
                            smallImg[1].style.display='inline-block';
                            smallImg[smallImg.length-2].style.display='none';
                        }else if(i==3) {
                            smallImg[0].style.display='inline-block';
                            smallImg[smallImg.length-1].style.display='none';
                            smallImg[smallImg.length-2].style.display='none';

                        }
                    }else if(dataImgLength==5) {
                        if(i==4){
                            smallImg[1].style.display='inline-block';
                        }else if(i==3) {
                            smallImg[0].style.display='inline-block';

                            smallImg[smallImg.length-1].style.display='none';
                        }
                    }
                }
            }
            function right() {
                var smallImg=getClass('small-img');

                if (i >= menuLisLength) {
                    i = menuLisLength;
                    menuList[i].style.borderColor = 'yellowgreen';
                } else if (i == '1') {
                    i = menuList.length-2;
                    menuList[i].style.borderColor = ' yellowgreen';

                }else if (i == smallImg.length+1) {
                    upIndex=i;
                    i = i + 2;
                    menuList[i].style.borderColor = ' yellowgreen';

                } else if (i == menuList.length-2) {
                    i = i + 1;
                    menuList[i].style.borderColor = ' yellowgreen';
                }else if (i == menuList.length-3) {
                    i=menuList.length-2;
                    menuList[i].style.borderColor = ' yellowgreen';
                }
                else {
                    i++;
                    menuList[i].style.borderColor = 'yellowgreen';
                }
            }
            function left() {
                if (i <= 0) {
                    i = 0;
                    menuList[i].style.borderColor = 'yellowgreen';
                } else if (i == menuList.length-2 ) {
                    i = 1;
                    menuList[i].style.borderColor = 'yellowgreen';
                } else if (i == 1 ) {

                    menuList[i].style.borderColor = 'yellowgreen';
                } else if (i == 2 ) {

                    menuList[i].style.borderColor = 'yellowgreen';
                }  else {
                    i--;
                    menuList[i].style.borderColor = ' yellowgreen';
                }
            }
            function down() {
                var smallImg=getClass('small-img');
                if (i == '0'  ) {
                    i = 1;
                    menuList[i].style.borderColor = 'yellowgreen';

                } else if ( i == '1') {
                    i = upIndex;

                    menuList[i].style.borderColor = 'yellowgreen';

                }else if ( i>=2&&i<=smallImg.length+1) {
                    var sellerId=getId('sellerImage').dataset.sellerid;
                    if(sellerId){
                        downIndex=i;
                        i =menuList.length-3;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else {
                        menuList[i].style.borderColor = 'yellowgreen';
                    }

                } else if ( i == menuList.length-1||i==menuList.length-2||i==menuList.length-3) {
                    menuList[i].style.borderColor = ' yellowgreen';
                }
            }
            function up() {
                var smallImg=getClass('small-img');
                if (i == '0'||i == '1'||i == menuList.length-1||i==menuList.length-2) {
                    i=0;
                    menuList[i].style.borderColor = 'yellowgreen';

                }else if (i>=2&&i<=smallImg.length+1) {
                    upIndex=i;
                    i = 1;
                    menuList[i].style.borderColor = 'yellowgreen';
                } else if (i == menuList.length-3) {

                    i= downIndex;
                    menuList[i].style.borderColor = 'yellowgreen';
                }
            }
        }
    })()
};

