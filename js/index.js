/**
 * Created by admin on 2017/9/15.
 */
window.onload=function () {
    (function () {
        /*获取url携带的参数*/
        var parameter=urlData();
        var fromLaunch=parameter.fromLaunch;

        /*ajax调用接口开始*/
        /*获取推荐区域列表 page_id:'0'*/
        queryRecommendList ();
        function queryRecommendList () {
            ajaxJson({ type:'get',
                url:'recommendation/list',
                async:true,
                data:{},
                params:{
                    page_id:'1'
                },
                success:function (result) {
                    /*最新的数据格式*/
                    slideHtml(result.data[0]);/*区域一轮播图区域*/
                    allHtml(result.data[2],'rightTwoImg');/*区域三视频下方两张图片*/
                    allHtml(result.data[3],'bottomSmallImg');/*区域四底部两张小图片*/
                    allHtml(result.data[4],'bottomBigImg');/*区域五底部两张大图片*/
                    videoOrImgHtml(result.data[1]);/*区域二视频区域*/
                    /*调用成功之后执行轮播效果*/
                    // slideShow();//轮播图效果
                },
                error:function (status) {
                    window.location.href='./views/error.html';
                }
            });
        }

          /*其他的相同区域html赋值*/
        function allHtml(data,className) {/*每个区域赋值的函数*/
            var element=getClass(className);
            for (var i=0;i<data.recommendations.length;i++){
                element[i].src= subLink(data.recommendations[i].imageUrl);
                element[i].dataset.contentid=data.recommendations[i].idContent;
                element[i].dataset.contenttype=data.recommendations[i].contentType;  /*contentType:0商品，1商家，2活动,*/
                element[i].dataset.contenturl=data.recommendations[i].urlContent;   /*活动链接*/
            }
        }

        function slideHtml(data) {/*区域二轮播图区域*/
            var slideUl = getId('slide');
            var btnUl=getId('slideBtn');
            var btnLi=null;
            var liHtml = null;
            slideUl.innerHTML=null;
            btnUl.innerHTML=null;
            for (var i = 0; i < data.recommendations.length; i++) {
                liHtml='<li><img style=" position: absolute;width: 490px; height: 280px;opacity: 0" data-contentid="'+data.recommendations[i].idContent+'" data-contenttype="'+data.recommendations[i].contentType+'"  class="slide-img" id="slideImg"  data-contenturl="'+data.recommendations[i].urlContent+'" src="'+subLink(data.recommendations[i].imageUrl)+'" alt="" /></li>';
                btnLi='<li class="btnItem"></li>';
                slideUl.innerHTML+=liHtml;
                btnUl.innerHTML+=btnLi;
            }
            var firstBtnLi=getClass('btnItem')[0];
            firstBtnLi.className='active';
            slideShow();//轮播图效果
        }

        var isVideo=false;
        var video1;
        function videoOrImgHtml(data) {/*区域三视频区域*/
            var bigImg = getId('bigImg');

            /*上线时要放开注释*/
            // if(data.recommendations[0].recommendationType=='0'){/*0带表视频，1代表图片*/
            if(false){/*0带表视频，1代表图片*/
                isVideo=true;
                var videoCode= data.recommendations[0].videoCodeHd;
                video1=new VideoPlay('plyIfrOne',278,158,871,143,videoCode,'plyIfrBox');/*准备播放正确的视频播放位置*/

                var plyIfr = getId('plyIfrOne');

                plyIfr.dataset.contentid=data.recommendations[0].idContent;
                plyIfr.dataset.contenttype=data.recommendations[0].contentType;  /*contentType:0商品，1商家，2活动,*/
                plyIfr.dataset.contenturl=data.recommendations[0].urlContent;   /*活动链接*/

            }else {
                bigImg.src = subLink(data.recommendations[0].imageUrl);
                bigImg.style.display='block';
                // plyIfr.style.display='none';
                bigImg.dataset.contentid=data.recommendations[0].idContent;
                bigImg.dataset.contenttype=data.recommendations[0].contentType;  /*contentType:0商品，1商家，2活动,*/
                bigImg.dataset.contenturl=data.recommendations[0].urlContent;   /*活动链接*/
            }
        }

        /*轮播图选择当前图片*/
        function slideCurrentImg() {
            var currentImg=undefined;
            var lists = document.getElementsByClassName('list')[0];
            var item = lists.getElementsByClassName('slide-img');
            var activeUrl;/*活动Url*/
            for (var i = 0; i < item.length; i++) {
                if(item[i].style.opacity=='1'){
                    currentImg=item[i]
                }
            }
            console.log(currentImg);
            var Id = currentImg.dataset.contentid;
            console.log(Id);
            var contentType=currentImg.dataset.contenttype;
            console.log(contentType);
            if (contentType=='0'){/*商品类型*/

                window.location.href='./views/product_details/product_details.html?productId='+Id;

            }else if(contentType=='1'){/*商家类型*/

                window.location.href='./views/merchant-detail/merchant_detail_shopDes.html?sellerId='+Id;

            }else if(contentType=='2'){/*活动类型*/
                 activeUrl=currentImg.dataset.contenturl;
                window.location.href=activeUrl;
            }
        }
        // slideShow();//轮播图效果
        function slideShow() {
            var index = 0;
            var lists = document.getElementsByClassName('list')[0];
            var item = lists.getElementsByTagName('img');
            var subList = document.getElementsByClassName('btn')[0].getElementsByTagName('li');
            item[0].style.opacity = 1;
            function slide(num) {
                for (var i = 0; i < item.length; i++) {
                    item[i].style.opacity = 0;
                    subList[i].className = '';
                }
                item[num].style.opacity = 1;
                subList[num].className = 'active';
            }
            function play() {
                index++;
                if (index > item.length - 1) {
                    index = 0;
                }
                slide(index);
            }
            var sid = setInterval(play, 2000);
        }
        /*遥控器切换焦点框*/
        SwitchFocus();
        function SwitchFocus() {
            var menuList = document.getElementsByClassName('menu-item');
            var menuLisLength = menuList.length - 1;
            console.log(menuList);
            var i = 0;
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
                        if(isVideo){
                            video1.playKeyPress(event);
                        }
                    }
                    return;
                }

                initStyle();

                if (keyCode == 39) {//右
                    right()
                }
                if (keyCode == 37) {//左
                    left()
                }
                if (keyCode == 38) {//上
                    up()
                }
                if (keyCode == 40) {//下
                    down()
                }
                if (keyCode == 13) {//ok键

                    menuList[i].style.borderColor = 'yellowgreen';

                    if (i=='0') {/*翼商圈页面*/
                        window.location.href = './views/bestpay/bestpay.html'
                    }
                    else if (i == '1') {/*扶贫页面*/
                        window.location.href = './views/fuPin/fuPin.html'

                    }  else if (i == '2') {/*特惠卖场页面*/
                        window.location.href = './views/special_stores/special_stores.html'

                    } else if (i == '3') {/*用户中心页面*/
                        window.location.href = './views/user/user.html'
                    }else if (i == '4') {/*轮播图点击*/
                        slideCurrentImg();
                        /*轮播图点击详情跳转*/
                    }else if (i == '5') {/*视频区域点击*/
                         videoOrImg(i);
                        /*轮播图点击详情跳转*/
                    }else if (i == '6' || i == '7' || i == '8' || i == '9'|| i == '10'|| i == '11') {
                        productDetail(i);
                        /*商品详情页的跳转*/
                    }
                }
                // playKeyPress(event);/*视频声音加减暂停键*/
            };

            /*商品详情页的跳转*/
            function productDetail(index) {
                var currentLi = menuList[index];
                // var img = currentLi.children[0];
                var img = menuList[index];
                console.log(img);
                var Id = img.dataset.contentid;
                var contentType=img.dataset.contenttype;
                var activeUrl;/*活动Url*/

                if (contentType=='0'){/*商品类型*/

                    window.location.href='./views/product_details/product_details.html?productId='+Id;

                }else if(contentType=='1'){/*商家类型*/

                    window.location.href='./views/merchant-detail/merchant_detail_shopDes.html?sellerId='+Id;

                }else if(contentType=='2'){/*活动类型*/
                    activeUrl=img.dataset.contenturl;
                    window.location.href=activeUrl;
                }
            }
            function videoOrImg(index) {
                var currentLi = menuList[index];
                console.log(currentLi);
                var Id;
                var contentType;
                var activeUrl;
                if(currentLi.children[0].style.display=='block'){
                    console.log(currentLi.children[0]);
                    Id =  currentLi.children[0].dataset.contentid;
                    contentType=currentLi.children[0].dataset.contenttype;
                    activeUrl=currentLi.children[0].dataset.contenturl;
                }else {
                    console.log(currentLi.children[1]);
                    Id= currentLi.children[1].dataset.contentid;
                    contentType=currentLi.children[1].dataset.contenttype;
                    activeUrl=currentLi.children[1].dataset.contenturl;
                }
                if(Id){
                    if (contentType=='0'){/*商品类型*/
                        window.location.href='./views/product_details/product_details.html?productId='+Id;
                    }else if(contentType=='1'){/*商家类型*/
                        window.location.href='./views/merchant-detail/merchant_detail_shopDes.html?sellerId='+Id;
                    }else if(contentType=='2'){/*活动类型*/
                        window.location.href=activeUrl;
                    }
                }
            }
            function right() {
                if (i >= menuLisLength) {
                    i = menuLisLength;
                    menuList[i].style.borderColor = 'yellowgreen';
                }else if(i == '0'||i == '1'){
                    i =4;
                    menuList[i].style.borderColor = 'yellowgreen';
                }else if(i == '2'){
                    i =i+6;
                    menuList[i].style.borderColor = 'yellowgreen';
                }else if(i == '3'){
                    i =i+6;
                    menuList[i].style.borderColor = 'yellowgreen';
                }else if(i == '4'){
                    i =i+1;
                    menuList[i].style.borderColor = 'yellowgreen';
                }else if(i == '5'||i=='7'||i=='11'){
                    menuList[i].style.borderColor = 'yellowgreen';
                } else if(i == '8'||i=='9'){
                    i=10;
                    menuList[i].style.borderColor = 'yellowgreen';

                } else if (i == '10') {
                    i = i + 1;
                    menuList[i].style.borderColor = 'yellowgreen';
                } else {
                    i++;
                    menuList[i].style.borderColor = 'yellowgreen';
                }
            }
            function left() {
                if (i>='0'&&i<='3') {
                    menuList[i].style.borderColor = 'yellowgreen';
                }else if (i == '4') {
                    i = 0;
                    menuList[i].style.borderColor = 'yellowgreen';
                }else if (i == '6') {
                    i = i - 2;
                    menuList[i].style.borderColor = 'yellowgreen';
                }else if (i == '8') {
                    i = i-6;
                    menuList[i].style.borderColor = 'yellowgreen';
                }else if (i == '9') {
                    i = i-6;
                    menuList[i].style.borderColor = 'yellowgreen';
                }else if (i == '10') {
                    i = i-2;
                    menuList[i].style.borderColor = 'yellowgreen';
                }
                else {
                    i--;
                    menuList[i].style.borderColor = ' yellowgreen';
                }
            }
            function down() {
                if (i == '0'||i == '1'|| i == '2') {
                     i++;
                    menuList[i].style.borderColor = 'yellowgreen';
                } else if (i == '4') {
                    i = i + 4;
                    menuList[i].style.borderColor = 'yellowgreen';
                }else if (i == '5') {
                    i = i + 1;
                    menuList[i].style.borderColor = 'yellowgreen';
                }else if (i == '6'||i == '7') {
                    i = 11;
                    menuList[i].style.borderColor = 'yellowgreen';
                } else if (i=='8') {
                    i = i + 1;
                    menuList[i].style.borderColor = 'yellowgreen';
                }else if (i == '3'|| i == '9' || i == '10' || i == '11') {
                    menuList[i].style.borderColor = ' yellowgreen';
                }
            }
            function up() {
                if (i == '0'||i == '4' || i == '5' ) {
                    menuList[i].style.borderColor = 'yellowgreen';
                }  else if (i>='1'&&i<='3') {
                    i = i - 1;
                    menuList[i].style.borderColor = 'yellowgreen';
                } else if (i == '6'||i == '7') {
                    i = 5;
                    menuList[i].style.borderColor = 'yellowgreen';
                } else if (i == '8') {
                    i = i - 4;
                    menuList[i].style.borderColor = 'yellowgreen';
                }else if (i == '9') {
                    i = i - 1;
                    menuList[i].style.borderColor = 'yellowgreen';
                }else if (i == '10') {
                    i = i - 6;
                    menuList[i].style.borderColor = 'yellowgreen';
                }else if (i == '11') {
                    i = i - 5;
                    menuList[i].style.borderColor = 'yellowgreen';
                }
            }
        }
    })();
};

