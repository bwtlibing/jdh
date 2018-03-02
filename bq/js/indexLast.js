/**
 * Created by admin on 2017/9/15.
 */

window.onload=function () {
    (function () {
        /*ajax接口*/
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
                    allHtml(result.data[0],'leftOneImg');/*区域一左边一张图*/
                    slideHtml(result.data[1]);/*区域二轮播图区域*/
                    allHtml(result.data[3],'middleTwoImg');/*区域四*/
                    allHtml(result.data[4],'rightTwoImg');/*区域五*/
                    videoOrImg(result.data[2]);
                },
                error:function (status) {
                    window.location.href='../error.html';
                }
            });
        }
        function allHtml(data,className) {/*每个区域赋值的函数*/
            var element=getClass(className);
            for (var i=0;i<data.recommendations.length;i++){
                element[i].src=data.recommendations[i].imageUrl;

                // element[i].setAttribute("contentid",data.recommendations[i].idContent); // 设置
                // element[i].setAttribute("contenttype",data.recommendations[i].contentType); // 设置
                // element[i].setAttribute("contenturl",data.recommendations[i].urlContent); // 设置

                setAttrs(element[i],"contentid",data.recommendations[i].idContent);
                setAttrs(element[i],"contenttype",data.recommendations[i].contentType);
                setAttrs(element[i],"contenturl",data.recommendations[i].urlContent);

                // element[i].dataset.contentid=data.recommendations[i].idContent;
                // element[i].dataset.contenttype=data.recommendations[i].contentType;  /*contentType:0商品，1商家，2活动,*/
                // element[i].dataset.contenturl=data.recommendations[i].urlContent;   /*活动链接*/
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

               /* liHtml='<li><img style=" position: absolute;width: 220px; height: 190px" data-contentid="'+data.recommendations[i].idContent+'" data-contenttype="'+data.recommendations[i].contentType+'"   class="slide-img" id="slideImg"  data-contenturl="'+data.recommendations[i].urlContent+'" src="'+data.recommendations[i].imageUrl+'" alt="" /></li>';*/

                liHtml='<li><img style=" position: absolute;width: 220px; height: 190px" contentid="'+data.recommendations[i].idContent+'" contenttype="'+data.recommendations[i].contentType+'"  class="slide-img" id="slideImg"  contenturl="'+data.recommendations[i].urlContent+'" src="'+data.recommendations[i].imageUrl+'" alt="" /></li>';


                btnLi='<li class="btnItem"></li>';
                slideUl.innerHTML+=liHtml;
                btnUl.innerHTML+=btnLi;
            }
            var firstBtnLi=getClass('btnItem')[0];
            firstBtnLi.className='active';
            slideShow();//轮播图效果
        }

        function videoOrImg(data) {
            var bigImg = getId('bigImg');
            var plyIfr = getId('plyIfr');
            if(data.recommendations[0].recommendationType=='0'){/*0带表视频，1代表图片*/

                var videoCode= data.recommendations[0].videoCode;
                // var videoCode= 'Umai:PROG/2643351@BESTV.SMG.SMG';
                playPrepare(videoCode,260,214,360,120);/*准备播放*/

                setAttrs(plyIfr,"contentid",data.recommendations[0].idContent);
                setAttrs(plyIfr,"contenttype",data.recommendations[0].contentType);
                setAttrs(plyIfr,"contenturl",data.recommendations[0].urlContent);
              /*  plyIfr.dataset.contentid=data.recommendations[0].idContent;
                plyIfr.dataset.contenttype=data.recommendations[0].contentType;  /!*contentType:0商品，1商家，2活动,*!/
                plyIfr.dataset.contenturl=data.recommendations[0].urlContent;   /!*活动链接*!/*/

            }else {
                bigImg.src = data.recommendations[0].imageUrlOrVideoCode;
                bigImg.style.display='block';
                plyIfr.style.display='none';

                setAttrs(bigImg,"contentid",data.recommendations[0].idContent);
                setAttrs(bigImg,"contenttype",data.recommendations[0].contentType);
                setAttrs(bigImg,"contenturl",data.recommendations[0].urlContent);
              /*  bigImg.dataset.contentid=data.recommendations[0].idContent;
                bigImg.dataset.contenttype=data.recommendations[0].contentType;  /!*contentType:0商品，1商家，2活动,*!/
                bigImg.dataset.contenturl=data.recommendations[0].urlContent;   /!*活动链接*!/*/
            }
        }

        /*轮播图选择当前图片*/
        function slideCurrentImg() {
            var currentImg=undefined;
            var lists = document.getElementsByClassName('list')[0];
            var item = lists.getElementsByClassName('slide-img');
            for (var i = 0; i < item.length; i++) {
                if(item[i].style.opacity=='1'){
                    currentImg=item[i]
                }
            }
            // var Id = currentImg.dataset.contentid;
            var Id = getAttrs(currentImg,'contentid');
            // var contentType=currentImg.dataset.contenttype;
            var contentType=getAttrs(currentImg,'contenttype');

            var activeUrl;
            if (contentType=='0'){/*商品类型*/

                window.location.href='./views/product_details/product_details.html?productId='+Id;
            }else if(contentType=='1'){/*商家类型*/
                window.location.href='./views/merchant-detail/merchant_detail_shopDes.html?merchantId='+Id;
            }else if(contentType=='2'){/*活动类型*/

                 // activeUrl=currentImg.dataset.contenturl;
                 activeUrl=getAttrs(currentImg,'contenturl');

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
                    // item[i].style.opacity = 0;
                    item[i].style.filter = 'alpha(opacity:' + 0 + ')';
                    subList[i].className = '';
                }
                // item[num].style.opacity = 1;
                item[num].style.filter = 'alpha(opacity:' + 100 + ')';
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
                    menuList[j].style.borderRadius = '5px';
                }
            }
            menuList[0].style.border = '3px solid yellowgreen';
            menuList[0].style.borderRadius = '5px';
            window.document.onkeypress=document.onirkeypress = function (event) {

                event = event ? event : window.event;
                var keyCode = event.which ? event.which : event.keyCode;

                if((keyCode<37||keyCode>40)&&keyCode!=13){

                    if (keyCode == 8 || keyCode == 24 || keyCode == 32){/*返回键*/
                        window.history.back();
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

                    if (i=='4') {/*返回键*/
                        window.history.back();
                    }else if(i=='0'){
                        window.location.href='./test.html';/*测试页面*/
                    }
                    else if (i == '3') {/*用户中心页面*/
                        window.location.href = './views/user/user.html'
                    } else if (i == '2') {/*特惠卖场页面*/
                        window.location.href = './views/special_stores/special_stores.html'
                    } else if (i == '5' || i == '7' || i == '8' || i == '9' || i == '10' || i == '11') {

                        productDetail(i);
                        /*商品详情页的跳转*/

                    } else if (i == '6') {/*轮播图点击*/

                        slideCurrentImg();
                        /*轮播图点击详情跳转*/
                    }
                }
            };

            /*商品详情页的跳转*/
            function productDetail(index) {
                // var currentLi = menuList[index];
                var img =menuList[index];

                // var Id = img.dataset.contentid;
                // var Id = img.attributes["contentid"].nodeValue;

                var Id =  getAttrs(img,"contentid");

                // var contentType=img.dataset.contenttype;
                // var contentType=img.attributes["contenttype"].nodeValue;

                var contentType=getAttrs(img,"contenttype");
                var activeUrl;

                if (contentType=='0'){/*商品类型*/

                    window.location.href='./views/product_details/product_details.html?productId='+Id;

                }else if(contentType=='1'){/*商家类型*/
                    window.location.href='./views/merchant-detail/merchant_detail_shopDes.html?merchantId='+Id;
                }else if(contentType=='2'){/*活动类型*/
                     activeUrl=getAttrs(img,"contenturl");
                    window.location.href=activeUrl;
                }
            }
            function right() {
                if (i >= menuLisLength) {
                    i = menuLisLength;
                    menuList[i].style.borderColor = 'yellowgreen';
                } else if (i == '6') {
                    menuList[i + 3].style.borderColor = 'yellowgreen';
                    i = i + 3;
                }else if (i == '8') {
                    menuList[i + 2].style.borderColor = 'yellowgreen';
                    i = i + 2;
                } else {
                    i++;
                    menuList[i].style.borderColor = 'yellowgreen';
                }
            }

            function left() {
                if (i <= 0) {
                    i = 0;
                    menuList[i].style.borderColor = 'yellowgreen';
                } else if (i == '7' || i == '10') {
                    i = i - 2;
                    menuList[i].style.borderColor = 'yellowgreen';

                } else if (i == '9') {
                    i = i - 3;
                    menuList[i].style.borderColor = 'yellowgreen';

                }
                else {
                    i--;
                    menuList[i].style.borderColor = ' yellowgreen';
                }
            }

            function down() {
                if (i == '0' || i == '1' ) {
                    i = i + 5;
                    menuList[i].style.borderColor = 'yellowgreen';

                } else if ( i == '2') {
                    i = i +4;
                    menuList[i].style.borderColor = 'yellowgreen';

                } else if (i == '3') {
                    i = i + 6;
                    menuList[i].style.borderColor = ' yellowgreen';

                }
                else if (i == '4') {
                    i = i + 5;
                    menuList[i].style.borderColor = 'yellowgreen';


                } else if (i == '6') {
                    i = i + 1;
                    menuList[i].style.borderColor = 'yellowgreen';

                } else if (i == '9') {
                    i = 10;
                    menuList[i].style.borderColor = 'yellowgreen';

                } else if (i == '5' || i == '7' || i == '8' || i == '10' || i == '11') {
                    menuList[i].style.borderColor = ' yellowgreen';
                }
            }

            function up() {
                if (i == '0'||i == '1' || i == '2' || i == '3' || i == '4') {

                    menuList[i].style.borderColor = 'yellowgreen';

                }  else if (i == '5'||i == '6') {
                    i = i - 5;
                    menuList[i].style.borderColor = 'yellowgreen';


                } else if (i == '7'||i == '10') {
                    i = i - 1;
                    menuList[i].style.borderColor = 'yellowgreen';

                } else if (i == '8'||i == '11') {
                    i = i - 2;
                    menuList[i].style.borderColor = 'yellowgreen';

                }
                else if (i == '9') {
                    i = i - 6;
                    menuList[i].style.borderColor = 'yellowgreen';
                }

            }
        }
    })();
};

