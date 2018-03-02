/**
 * Created by admin on 2017/9/20.
 */


window.onload=function () {

    (function () {

        /*获取url携带的参数*/
        var parameter=urlData();
        console.log(parameter);
        var sellerId=parameter.sellerId;

        var fromLaunch=parameter.fromLaunch;
        /*-----------调用接口开始------------------*/

        /*商家详情接口*/
        querySellerDetail();
        function querySellerDetail() {
            ajaxJson({ type:'get',
                url:'seller/query-seller-introduce',
                async:true,
                data:{},
                params:{
                    seller_id:sellerId
                },
                success:function (result) {
                    console.log(result);
                    console.log(result.data);
                    SellerDetailHtml (result.data);
                },
                error:function (status) {
                    window.location.href='../error.html';
                }
            });
        }

        /*商家详情页的赋值*/
        var isVideo=false;
        function SellerDetailHtml(data) {
            var type = undefined;
            var headerImg = getId('sellerHeaderImg');
            var sellerType = getId('sellerType');
            if (data.type == '0') {
                // type = '普通商家';
                sellerType.style.display = 'none';

            } else {
                type = '翼支付入驻商家';
                textHtml('sellerType', type);
                sellerType.style.display = 'inline-block';
            }
            headerImg.src = subLink(data.logoImage);
            textHtml('sellerName', data.name);

            textHtml('sellerIntroduce', data.introduce);
            textHtml('sellerAddress', data.address);


            /*图片视频区域*/

            var bigImg = getId('bigImg');
            // var plyIfr = getId('plyIfr');
            var sellerInfoImg  = getClass('sellerInfoImg');
            if (data.videoCodeHd) {
                isVideo=true;
                var videoCode = data.videoCodeHd;
                // playPrepare(videoCode, 520, 265, 608, 379,'videoOrImg');
                video1=new VideoPlay('plyIfrOne',520,265,608,379,videoCode,'videoOrImg');/*准备播放正确的视频播放位置*/
                /*准备播放*/
                for (var j = 0; j <data.images.length-1;j++) {
                    sellerInfoImg[j].src = subLink(data.images[j]);
                }
            } else {
                // plyIfr.style.display = 'none';
                bigImg.style.display = 'block';

                for (var i = 0; i < data.images.length; i++) {
                    sellerInfoImg[i].src = subLink(data.images[i]);
                }
            }
        }
        /*根据商家id取商品简介列表*/
        querySellerProductList();
        function querySellerProductList() {
            ajaxJson({ type:'get',
                url:'product/get-product-list-by-seller',
                async:true,
                data:{},
                params:{
                    seller_id:sellerId
                },
                success:function (result) {
                    console.log(result);
                    console.log(result.data);
                    productList(result.data);
                },
                error:function (status) {
                    window.location.href='../error.html';
                }
            });
        }

        function productList(data) {/*商品列表*/
            var productListImg=getClass('productListImg');

            for (var j = 0; j < productListImg.length; j++) {
                productListImg[j].src = '../../img/noProduct.png';
                productListImg[j].dataset.contentid = '';
            }

            for (var i=0;i<data.length;i++){
                productListImg[i].src=subLink(data[i].productImage);
                productListImg[i].dataset.productid=data[i].id
            }
        }


        /*遥控器切换焦点框*/
        SwitchFocus();
        function SwitchFocus() {
            var menuList = document.getElementsByClassName('menu-item');
            var menuLisLength = menuList.length - 1;
            var i = 1;
            console.log(menuList);
            initStyle();
            function initStyle() {//初始化样式
                for (var j = 0; j <= menuLisLength; j++) {
                    menuList[j].style.border = '3px solid transparent';
                }
            }
            menuList[i].style.border = '3px solid yellowgreen';

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
                            video1.playKeyPress(event);
                        }
                    }
                    return;
                }

                initStyle();//初始化样式
                var alertBox=getId('alertModal');/*隐藏弹出框*/
                if(alertBox.style.display=='block'){
                    alertBox.style.display='none';
                    menuList[i].style.borderColor = 'yellowgreen';
                    return;
                }

               if (keyCode == 39) {//右

                    right()

                } else if (keyCode == 37) {//左

                    left()

                } else if (keyCode == 38) {//上

                    up()

                } else if (keyCode == 40) {//下

                    down()

                } else if (keyCode == 13) {//ok键
                    menuList[i].style.borderColor = 'yellowgreen';
                    if (i=='0'){

                        window.location.href='../user/user.html';

                    }else if(i=='1'||i=='2'){
                        // tabCahnge() /*tab按钮切换的样式*/
                    }else if(i>=8&&i<=17) {
                        productDetail(i)/*商品详情*/
                    }
                }

                tabCahnge() /*tab按钮切换的样式*/

            };

            function tabCahnge() {/*tab按钮切换的样式*/
                var merchantDesBox=document.getElementsByClassName('merchant-des-box')[0];
                var productList=document.getElementsByClassName('product-list')[0];

                if(i=='1'){
                    productList.style.display='none';
                    merchantDesBox.style.display='block';
                    console.log('按钮左');
                    if(isVideo){
                        video1.replay();
                    }else {
                        console.log('没有视频资源')
                    }


                }else if (i=='2'){
                    console.log('按钮右');
                    merchantDesBox.style.display='none';
                    productList.style.display='block';

                    if(isVideo){
                        video1.stop();
                    }else {
                        console.log('没有视频资源');
                    }
                }
            }

            /*商家页的商品列表到商品详情页的跳转*/
            function productDetail(index) {
                // var currentLi = menuList[index];
                var img = menuList[index];
                console.log(img);
                var Id = img.dataset.productid;
                console.log(Id);
                // var contentType=img.dataset.contenttype;
                // console.log(contentType);

                if(Id){
                    window.location.href='../product_details/product_details.html?productId='+Id;
                }else {
                    alertBox('更多商品，敬请期待')
                }


               /* if (contentType=='0'){/!*商品类型*!/

                    window.location.href='./views/product_details/product_details.html?productId='+Id;

                }else if(contentType=='1'){/!*商家类型*!/

                    window.location.href='./views/merchant-detail/merchant_detail_shopDes.html?merchantId='+Id;

                }else if(contentType=='2'){/!*活动类型*!/
                    window.location.href='https://www.baidu.com/';
                }*/
            }

            function right() {/*右键*/

                if (i >= menuLisLength) {
                    i = menuLisLength;
                    menuList[i].style.borderColor = 'yellowgreen';
                } else if(i=='2'){
                    i=8;
                    menuList[i].style.borderColor = 'yellowgreen';
                } else if(i=='3'||i=='4'||i=='5'){
                    i=i+2;
                    menuList[i].style.borderColor = 'yellowgreen';
                } else if(i=='7'){
                    menuList[i].style.borderColor = 'yellowgreen';
                }else {
                    i++;
                    menuList[i].style.borderColor = 'yellowgreen';
                }
            }

            function left() {/*左键*/
                if (i <= 0) {
                    i = 0;
                    menuList[i].style.borderColor = 'yellowgreen';
                }else if(i=='2'){
                     i--;
                     menuList[i].style.borderColor = 'yellowgreen';

                }else if(i=='5'||i=='6'||i=='7'){
                    i = i-2;
                    menuList[i].style.borderColor = 'yellowgreen';
                } else if(i=='4'){
                    menuList[i].style.borderColor = 'yellowgreen';
                }else if(i=='8'){
                    i=i-6;
                    menuList[i].style.borderColor = 'yellowgreen';
                } else {
                    i--;
                    menuList[i].style.borderColor = ' yellowgreen';
                }
            }

            function down() {/*下键*/
                if (i == '0' ||i == '1' ) {
                    i = i + 2;
                    menuList[i].style.borderColor = 'yellowgreen';

                } else if ( i=='2') {
                    i = i +7;
                    menuList[i].style.borderColor = 'yellowgreen';

                }else if ( i == '3'||i == '5') {
                    i = i+1;
                    menuList[i].style.borderColor = 'yellowgreen';

                }else if (i>=8&&i<=12) {
                    i = i+5;
                    menuList[i].style.borderColor = 'yellowgreen';

                } else  {
                    menuList[i].style.borderColor = ' yellowgreen';
                }
            }

            function up() {/*上键*/
                if (i == '0'||i == '1'||i == '2'||i=='11'||i=='12') {
                    i=0;
                    menuList[i].style.borderColor = 'yellowgreen';

                }else if ( i == '3' ) {
                    i = i-2;
                    menuList[i].style.borderColor = 'yellowgreen';

                } else if ( i == '4'||i == '6') {
                    i = i-1;
                    menuList[i].style.borderColor = 'yellowgreen';
                    console.log(i);
                } else if (i == '5') {
                    i = i - 3;
                    menuList[i].style.borderColor = 'yellowgreen';

                }else if (i == '7') {
                    i = i - 5;
                    menuList[i].style.borderColor = 'yellowgreen';

                }else if (i == '8'||i=='9') {
                    i = i - 7;
                    menuList[i].style.borderColor = 'yellowgreen';

                }else if (i == '10') {
                    i = i - 8;
                    menuList[i].style.borderColor = 'yellowgreen';
                }else if (i>=12&&i<=17) {
                    i = i - 5;
                    menuList[i].style.borderColor = 'yellowgreen';
                }
            }
        }
    })()
};