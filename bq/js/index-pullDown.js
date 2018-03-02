/**
 * Created by admin on 2017/9/15.
 */

window.onload=function () {
    (function () {

        /*ajax调用接口开始*/

        /*获取推荐区域列表 page_id:'0'*/
        queryRecommendList ();
        function queryRecommendList () {     /*获取上半部分数据*/
            ajaxJson({ type:'get',
                url:'recommendation/list',
                async:true,
                data:{},
                params:{
                    page_id:'2'
                },
                success:function (result) {
                    console.log(result);
                    console.log(result.data);
                    allHtml(result.data[0],'leftOneImg');/*区域一左边一张图*/
                    allHtml(result.data[1],'slide-img-one');/*区域二轮播图区域*/
                    // allHtml(result.data[2],'bigVideo');/*区域三视频区域*/
                    videoOrImg(result.data[2]);
                    allHtml(result.data[3],'middleTwoImg');/*区域四*/
                    allHtml(result.data[4],'rightTwoImg');/*区域五*/
                    allHtml(result.data[5],'middleThreeImg');/*区域六中部三张图*/
                    allHtml(result.data[6],'downLeftSixImg');/*区域七六张图*/
                    allHtml(result.data[7],'slide-img-two');/*区域八 第二个轮播图*/
                    allHtml(result.data[8],'downRightTwoImg');/*区域九 第二个轮播图*/
                },
                error:function (status) {
                    window.location.href='../error.html';
                }
            });
        }
       /* queryRecommendListTWo ();
        function queryRecommendListTWo () {     /!*获取下半部分数据*!/
            ajaxJson({ type:'get',
                url:'recommendation/list',
                async:true,
                data:{},
                params:{
                    page_id:'2'
                },
                success:function (result) {
                    console.log(result);
                    console.log(result.data);
                    allHtml(result.data[0],'middleThreeImg');/!*区域六中部三张图*!/
                    allHtml(result.data[1],'downLeftSixImg');/!*区域七六张图*!/
                    allHtml(result.data[2],'slide-img-two');/!*区域八 第二个轮播图*!/
                    allHtml(result.data[3],'downRightTwoImg');/!*区域九 第二个轮播图*!/
                },
                error:function (status) {
                    window.location.href='../error.html';
                }
            });
        }*/

        function allHtml(data,className) {/*每个区域赋值的函数*/
            var element=getClass(className);
            for (var i=0;i<data.recommendations.length;i++){
                element[i].src=data.recommendations[i].imageUrlOrVideoCode;
                element[i].dataset.contentid=data.recommendations[i].idContent;
                element[i].dataset.contenttype=data.recommendations[i].contentType;  /*contentType:0商品，1商家，2活动,*/
                element[i].dataset.contenturl=data.recommendations[i].urlContent;   /*活动链接*/
            }
        }

        function videoOrImg(data) {
            var bigImg = getId('bigImg');
            var plyIfr = getId('plyIfr');
            if(data.recommendations[0].recommendationType=='0'){

                //var videoCode= data.recommendations[0].imageUrlOrVideoCode;
                var videoCode= 'Umai:PROG/2643358@BESTV.SMG.SMG';
                playPrepare(videoCode,500,280,691,200);/*准备播放*/
                plyIfr.dataset.contentid=data.recommendations[0].idContent;
                plyIfr.dataset.contenttype=data.recommendations[0].contentType;  /*contentType:0商品，1商家，2活动,*/
                plyIfr.dataset.contenturl=data.recommendations[0].urlContent;   /*活动链接*/

            }else {
                bigImg.src = data.recommendations[0].imageUrlOrVideoCode;
                bigImg.style.display='block';
                plyIfr.style.display='none';
                bigImg.dataset.contentid=data.recommendations[0].idContent;
                bigImg.dataset.contenttype=data.recommendations[0].contentType;  /*contentType:0商品，1商家，2活动,*/
                bigImg.dataset.contenturl=data.recommendations[0].urlContent;   /*活动链接*/
            }
        }


        /*第一个轮播图选择当前图片*/
        function slideCurrentImg(className) {
            var currentImg=undefined;
            var lists = document.getElementsByClassName(className)[0];
            var item = lists.getElementsByTagName('img');
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

                window.location.href='./views/merchant-detail/merchant_detail_shopDes.html?merchantId='+Id;

            }else if(contentType=='2'){/*活动类型*/
                window.location.href='https://www.baidu.com/';
            }
        }

        window.onresize=function () {
            middleListLocation();
            middle();
            hotGoodsListLocation();
            presentLocation();
        };
        middleListLocation();//中部商品的位置样式控制
        function middleListLocation() {
            var Featured_left=document.getElementsByClassName('Featured-left');
            var img=Featured_left[0].getElementsByTagName('img');
            var topHeight=img[0].clientHeight;
            var middleList=document.getElementsByClassName('middle-list')[0];

            middleList.style.top=topHeight+20+'px';
        }
        hotGoodsListLocation();//火热商品的位置样式控制
        function hotGoodsListLocation() {
            var Featured_left=document.getElementsByClassName('Featured-left');
            var img=Featured_left[0].getElementsByTagName('img');
            var topHeight=img[0].clientHeight;
            var middleListHeight=document.getElementsByClassName('middle-list')[0].clientHeight;
            var hotGoodsList=document.getElementsByClassName('hot-goods')[0];
            hotGoodsList.style.top=middleListHeight+topHeight+40+'px';
        }

        slideShowHeight();//轮播图div的高度
        function slideShowHeight() {
            var slideImg=document.getElementById('slideImg');
            var imgHeight=slideImg.clientHeight;
            var  slideShow=document.getElementById('slide-show');
            slideShow.style.height=imgHeight+'px';
        }

        presentLocation();//赠送商品的位置样式控制
        function presentLocation() {
            var img=document.getElementsByClassName('hot-img');
            var topHeight=img[0].clientHeight;
            var hotGoodsList=document.getElementsByClassName('right-bottom')[0];
            hotGoodsList.style.top=topHeight+15+'px';
        }

        middle();//中间底部图片适应屏幕变化进行位置改变
        function middle() {
            var middleImg=document.getElementsByClassName('list')[0].getElementsByTagName('img')[0];
            var imgHeight=middleImg.clientHeight;
            var Featured_middle_up=document.getElementsByClassName('Featured-middle-up')[0];
            Featured_middle_up.style.height=imgHeight+'px';
        }

        slideShow('list','btn');//第一个轮播图效果
        slideShow('list-two','btn-two');//第一个轮播图效果
        function slideShow(element,btnElement) {
            var index = 0;
            var lists = document.getElementsByClassName(element)[0];
            var item = lists.getElementsByTagName('img');
            var subList = document.getElementsByClassName(btnElement)[0].getElementsByTagName('li');
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
            console.log(menuList);
            var menuLisLength = menuList.length - 1;
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
            window.document.onkeypress=document.onirkeypress= function (event) {

                event = event ? event : window.event;
                var keyCode = event.which ? event.which : event.keyCode;
                if((keyCode<37||keyCode>40)&&keyCode!=13){
                    if (keyCode == 8 || keyCode == 24 || keyCode == 32){/*返回键*/
                        destoryMP();
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


                    if(i=='3'){
                        window.location.href='./views/user/user.html'
                    } else  if(i=='2'){
                        window.location.href='../../views/special_stores/special_storesLast.html'
                    }else  if(i>='5'&&i<='23'&&i!=6&&i!=21){
                        productDetail(i)
                    }  else if(i=='6'||i=='21'){ /*两个轮播图*/
                        if(i=='6'){
                            slideCurrentImg('list-one')
                        }else {
                            slideCurrentImg('list-two')
                        }
                    }
                }
            };

            /*商品详情页的跳转*/
            function productDetail(index) {
                var currentLi = menuList[index];
                var img = currentLi.children[0];
                console.log(img);
                var Id = img.dataset.contentid;
                console.log(Id);
                var contentType=img.dataset.contenttype;
                console.log(contentType);
                if (contentType=='0'){/*商品类型*/

                    window.location.href='./views/product_details/product_details.html?productId='+Id;

                }else if(contentType=='1'){/*商家类型*/

                    window.location.href='./views/merchant-detail/merchant_detail_shopDes.html?merchantId='+Id;

                }else if(contentType=='2'){/*活动类型*/
                    window.location.href='https://www.baidu.com/';
                }

            }

            function right() {

                if (i >= menuLisLength) {
                    i = menuLisLength;
                    menuList[i].style.borderColor = 'yellowgreen';

                } else if (i == '6') {
                    i = i + 3;
                    menuList[i].style.borderColor = ' yellowgreen';

                }else if (i == '8') {
                    menuList[i + 2].style.borderColor = 'yellowgreen';
                    i = i + 2;
                }else if (i == '16'||i=='18') {
                    i = 21 ;
                    menuList[i].style.borderColor = 'yellowgreen';
                } else if (i == '20') {
                    i = 22 ;
                    menuList[i].style.borderColor = 'yellowgreen';
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
                }else if (i == '21') {
                    i = i - 5;
                    menuList[i].style.borderColor = 'yellowgreen';
                }else if (i == '22') {
                    i = i - 2;
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
                } else if (i == '5'||i=='7') {
                    i = 12;
                    menuList[i].style.borderColor = 'yellowgreen';

                }else if (i == '6') {
                    i = i + 1;
                    menuList[i].style.borderColor = 'yellowgreen';

                }else if (i == '8') {
                    i = 13;
                    menuList[i].style.borderColor = 'yellowgreen';

                }  else if (i == '9') {
                    i = 10;
                    menuList[i].style.borderColor = 'yellowgreen';

                } else if (i == '10' || i == '11') {
                    i = 14;
                    menuList[i].style.borderColor = ' yellowgreen';
                } else if (i == '12' || i == '13') {
                    i = i+3;
                    menuList[i].style.borderColor = ' yellowgreen';
                }else if (i == '14') {
                    i = 21;
                    menuList[i].style.borderColor = ' yellowgreen';
                }else if (i == '15'||i=='16'||i=='17'||i=='18') {
                    i = i+2;
                    menuList[i].style.borderColor = ' yellowgreen';
                }else if (i == '21') {
                    i = i+1;
                    menuList[i].style.borderColor = ' yellowgreen';
                }else {
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
                } else if (i == '9') {
                    i = i - 6;
                    menuList[i].style.borderColor = 'yellowgreen';
                }else if (i == '12') {
                    i = i - 7;
                    menuList[i].style.borderColor = 'yellowgreen';
                }else if (i == '13') {
                    i = i - 5;
                    menuList[i].style.borderColor = 'yellowgreen';
                }else if (i == '14'||i == '15'||i=='16') {
                    i = i - 3;
                    menuList[i].style.borderColor = 'yellowgreen';
                }else if (i == '17'||i=='18'||i=='19'||i=='20') {
                    i = i - 2;
                    menuList[i].style.borderColor = 'yellowgreen';
                }else if (i == '21') {
                    i = i - 7;
                    menuList[i].style.borderColor = 'yellowgreen';
                }else if (i == '22'||i=='23') {
                    i = 21;
                    menuList[i].style.borderColor = 'yellowgreen';
                }

            }
        }
    })();
};

