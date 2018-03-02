/**
 * Created by admin on 2017/9/15.
 */

window.onload=function () {
    (function () {
        /*ajax调用接口开始*/
        /*获取推荐区域列表 page_id:'0'*/
        // queryRecommendList ();
        /*  function queryRecommendList () {
         ajaxJson({ type:'get',
         url:'recommendation/list',
         async:true,
         data:{},
         params:{
         page_id:'1'
         },
         success:function (result) {
         /!*最新的数据格式*!/
         // slideHtml(result.data[0]);/!*区域一轮播图区域*!/
         // videoOrImgHtml(result.data[1]);/!*区域二视频区域*!/
         // allHtml(result.data[2],'rightTwoImg');/!*区域三视频下方两张图片*!/
         // allHtml(result.data[3],'bottomSmallImg');/!*区域四底部两张小图片*!/
         // allHtml(result.data[4],'bottomBigImg');/!*区域五底部两张大图片*!/

         },
         error:function (status) {
         window.location.href='./views/error.html';
         }
         });
         }

         /!*其他的相同区域html赋值*!/
         function allHtml(data,className) {/!*每个区域赋值的函数*!/
         var element=getClass(className);
         for (var i=0;i<data.recommendations.length;i++){

         element[i].src=data.recommendations[i].imageUrl;

         setAttrs(element[i],"contentid",data.recommendations[i].idContent);
         setAttrs(element[i],"contenttype",data.recommendations[i].contentType);
         setAttrs(element[i],"contenturl",data.recommendations[i].urlContent);

         /!* element[i].dataset.contentid=data.recommendations[i].idContent;
         element[i].dataset.contenttype=data.recommendations[i].contentType;  /!*contentType:0商品，1商家，2活动,*!/
         element[i].dataset.contenturl=data.recommendations[i].urlContent;   /!*活动链接*!/!*!/

         }
         }

         function slideHtml(data) {/!*区域二轮播图区域*!/
         var slideUl = getId('slide');
         var btnUl=getId('slideBtn');
         var btnLi=null;
         var liHtml = null;
         slideUl.innerHTML=null;
         btnUl.innerHTML=null;
         for (var i = 0; i < data.recommendations.length; i++) {

         liHtml='<li><img style=" position: absolute;width: 245px; height: 200px;opacity: 0" contentid="'+data.recommendations[i].idContent+'" contenttype="'+data.recommendations[i].contentType+'"  class="slide-img" id="slideImg"  contenturl="'+data.recommendations[i].urlContent+'" src="'+data.recommendations[i].imageUrl+'" alt="" /></li>';

         btnLi='<li class="btnItem"></li>';
         slideUl.innerHTML+=liHtml;
         btnUl.innerHTML+=btnLi;

         }
         var firstBtnLi=getClass('btnItem')[0];
         firstBtnLi.className='active';
         // slideShow();//轮播图效果
         }

         function videoOrImgHtml(data) {/!*区域三视频区域*!/
         var bigImg = getId('bigImg');
         var plyIfr = getId('plyIfr');
         if(data.recommendations[0].recommendationType=='0'){/!*0带表视频，1代表图片*!/

         var videoCode= data.recommendations[0].videoCode;
         // var videoCode= 'Umai:PROG/2671843@BESTV.STA.SMG';
         playPrepare(videoCode,140,116,435,85);/!*准备播放*!/
         setAttrs(plyIfr,"contentid",data.recommendations[0].idContent);
         setAttrs(plyIfr,"contenttype",data.recommendations[0].contentType);
         setAttrs(plyIfr,"contenturl",data.recommendations[0].urlContent);

         }else {
         bigImg.src = data.recommendations[0].imageUrl;
         bigImg.style.display='block';
         plyIfr.style.display='none';
         setAttrs(bigImg,"contentid",data.recommendations[0].idContent);
         setAttrs(bigImg,"contenttype",data.recommendations[0].contentType);
         setAttrs(bigImg,"contenturl",data.recommendations[0].urlContent);

         }
         }

         /!*轮播图选择当前图片*!/
         function slideCurrentImg() {
         var currentImg=undefined;
         var lists = document.getElementsByClassName('list')[0];
         var item = lists.getElementsByClassName('slide-img');
         var activeUrl;/!*活动Url*!/
         for (var i = 0; i < item.length; i++) {
         if(item[i].style.opacity=='1'){
         currentImg=item[i]
         }
         }
         console.log(currentImg);

         var Id = getAttrs(currentImg,'contentid');
         var contentType=getAttrs(currentImg,'contenttype');

         if (contentType=='0'){/!*商品类型*!/

         window.location.href='./views/product_details/product_details.html?productId='+Id;

         }else if(contentType=='1'){/!*商家类型*!/

         window.location.href='./views/merchant-detail/merchant_detail_shopDes.html?sellerId='+Id;

         }else if(contentType=='2'){/!*活动类型*!/
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
         }*/
        /*遥控器切换焦点框*/
        SwitchFocus();
        function SwitchFocus() {
            var menuList = document.getElementsByClassName('menu-item');
            var menuLisLength = menuList.length - 1;
            var i = 0;
            initStyle();
            function initStyle() {//初始化样式
                for (var j = 0; j <= menuLisLength; j++) {
                    menuList[j].style.borderWidth = '3px';
                    menuList[j].style.borderStyle = 'solid';
                    menuList[j].style.borderColor = 'transparent';
                    // menuList[j].style.border = '3px solid yellowgreen';
                }
            }
            // menuList[0].style.border = '3px solid yellowgreen';

            menuList[0].style.borderWidth = '3px';
            menuList[0].style.borderStyle = 'solid';
            menuList[0].style.borderColor = 'yellowgreen';

            window.document.onkeypress=document.onirkeypress = function (event) {

                event = event ? event : window.event;
                var keyCode = event.which ? event.which : event.keyCode;
                // playKeyPress(event);
                if((keyCode<37||keyCode>40)&&keyCode!=13){

                    if (keyCode == 8 || keyCode == 24 || keyCode == 32){/*返回键*/
                        window.history.back();
                    } else {
                        // playKeyPress(event);
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

                    if (i=='0') {/*返回键*/
                        window.history.back();
                    }
                    else if (i == '3') {/*特惠卖场页面*/
                        window.location.href = './views/special_stores/special_stores.html'

                    } else if (i == '4') {/*用户中心页面*/
                        window.location.href = './views/user/user.html'
                        // window.location.href = './views/special_stores/special_stores.html'

                    } else if (i == '8' || i == '9' || i == '10' || i == '11'|| i == '12'|| i == '13') {

                        window.location.href='./views/product_details/product_details.html?productId='+6;
                        // productDetail(i);
                        /*商品详情页的跳转*/

                    } else if (i == '6') {/*轮播图点击*/
                        window.location.href='./views/product_details/product_details.html?productId='+7;
                        // slideCurrentImg();
                        /*轮播图点击详情跳转*/
                    }else if (i == '7') {/*视频区域点击*/
                        window.location.href='./views/product_details/product_details.html?productId='+8;
                        // videoOrImg(i);
                        /*轮播图点击详情跳转*/
                    }
                }
            };

            /*商品详情页的跳转*/
            /*function productDetail(index) {
             var currentLi = menuList[index];
             var img = menuList[index];
             console.log(img);
             // var Id = img.dataset.contentid;
             var Id =  getAttrs(img,"contentid");
             var contentType =  getAttrs(img,"contenttype");
             var activeUrl;/!*活动Url*!/

             if (contentType=='0'){/!*商品类型*!/
             window.location.href='./views/product_details/product_details.html?productId='+Id;

             }else if(contentType=='1'){/!*商家类型*!/

             window.location.href='./views/merchant-detail/merchant_detail_shopDes.html?sellerId='+Id;
             }else if(contentType=='2'){/!*活动类型*!/
             activeUrl=img.dataset.contenturl;
             window.location.href=activeUrl;
             }
             }*/


            /* function videoOrImg(index) {
             var currentLi = menuList[index];
             console.log(currentLi);
             var Id;

             var contentType;

             var activeUrl;

             if(currentLi.children[0].style.display=='block'){
             console.log(currentLi.children[0]);

             /!*  Id =  currentLi.children[0].dataset.contentid;
             contentType=currentLi.children[0].dataset.contenttype;
             activeUrl=currentLi.children[0].dataset.contenturl;*!/


             Id=getAttrs(currentLi.children[0],'contentid');
             contentType=getAttrs(currentLi.children[0],'contenttype');
             activeUrl=getAttrs(currentLi.children[0],'contenturl');

             }else {
             /!* console.log(currentLi.children[1]);
             Id= currentLi.children[1].dataset.contentid;
             contentType=currentLi.children[1].dataset.contenttype;
             activeUrl=currentLi.children[1].dataset.contenturl;*!/
             Id=getAttrs(currentLi.children[1],'contentid');
             contentType=getAttrs(currentLi.children[1],'contenttype');
             activeUrl=getAttrs(currentLi.children[1],'contenturl');
             }

             if(Id){
             if (contentType=='0'){/!*商品类型*!/
             window.location.href='./views/product_details/product_details.html?productId='+Id;

             }else if(contentType=='1'){/!*商家类型*!/

             window.location.href='./views/merchant-detail/merchant_detail_shopDes.html?sellerId='+Id;

             }else if(contentType=='2'){/!*活动类型*!/
             window.location.href=activeUrl;
             }
             }
             }*/


            function right() {
                if (i >= menuLisLength) {
                    i = menuLisLength;
                    menuList[i].style.borderColor = 'yellowgreen';
                }else if(i == '1'||i == '2'||i == '3' ){
                    i = 6;
                    menuList[i].style.borderColor = 'yellowgreen';

                }else if(i == '4'||i == '5'){
                    i =i+6;
                    menuList[i].style.borderColor = 'yellowgreen';

                } else if (i == '10') {
                    i = i + 2;
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
                } else if (i == '12' ) {
                    i = i - 2;
                    menuList[i].style.borderColor = 'yellowgreen';

                } else if (i == '6') {
                    i = i - 5;
                    menuList[i].style.borderColor = 'yellowgreen';
                }else if (i == '8') {
                    i = i - 2;
                    menuList[i].style.borderColor = 'yellowgreen';
                }else if (i == '9') {
                    i = i - 3;
                    menuList[i].style.borderColor = 'yellowgreen';
                }else if (i == '10') {
                    i = 4;
                    menuList[i].style.borderColor = 'yellowgreen';
                }else if (i == '11') {
                    i = 5;
                    menuList[i].style.borderColor = 'yellowgreen';
                }else if (i>='0'&&i<='5') {

                    menuList[i].style.borderColor = ' yellowgreen';
                }
                else {
                    i--;
                    menuList[i].style.borderColor = ' yellowgreen';
                }
            }

            function down() {
                if (i == '0'  ) {
                    i = i + 7;
                    menuList[i].style.borderColor = 'yellowgreen';

                } else if (i == '1'|| i == '2'||i == '3'||i == '4') {
                    i++;
                    menuList[i].style.borderColor = 'yellowgreen';

                } else if (i == '6') {
                    i = i + 4;
                    menuList[i].style.borderColor = 'yellowgreen';

                }else if (i == '7') {
                    i = i +1;
                    menuList[i].style.borderColor = 'yellowgreen';

                } else if (i=='8'||i == '9') {
                    i = 13;
                    menuList[i].style.borderColor = 'yellowgreen';

                } else if (i == '10') {
                    i = i+1;
                    menuList[i].style.borderColor = 'yellowgreen';

                } else if (i == '5' || i == '11' || i == '12' || i == '13') {
                    menuList[i].style.borderColor = ' yellowgreen';
                }
            }

            function up() {
                if (i == '0'||i == '6' || i == '7' ) {
                    i=0;
                    menuList[i].style.borderColor = 'yellowgreen';

                }  else if (i>='1'&&i<='5') {
                    i = i - 1;
                    menuList[i].style.borderColor = 'yellowgreen';
                } else if (i == '8'||i == '9') {
                    i = 7;
                    menuList[i].style.borderColor = 'yellowgreen';

                } else if (i == '10') {
                    i = i - 4;
                    menuList[i].style.borderColor = 'yellowgreen';

                }else if (i == '11') {
                    i = i - 1;
                    menuList[i].style.borderColor = 'yellowgreen';

                }else if (i == '12') {
                    i = i - 6;
                    menuList[i].style.borderColor = 'yellowgreen';

                }else if (i == '13') {
                    i = i - 5;
                    menuList[i].style.borderColor = 'yellowgreen';

                }
            }
        }
    })();
};





/*
alert('开始测试');

SwitchFocus();
function SwitchFocus() {
    alert('测试代码分段1');

    var menuList = document.getElementsByClassName('menu-item');
    alert('测试代码分段2');

    var menuLisLength = menuList.length - 1;

    alert('测试代码分段3');

    var i = 0;
    initStyle();
    function initStyle() {//初始化样式
        for (var j = 0; j <= menuLisLength; j++) {
            menuList[j].style.borderWidth = '3px';
            menuList[j].style.borderStyle = 'solid';
            menuList[j].style.borderColor = 'transparent';
            // menuList[j].style.border = '3px solid yellowgreen';
        }
        alert('测试代码分段4,初始化函数');
    }
    // menuList[0].style.border = '3px solid yellowgreen';


    menuList[0].style.borderWidth = '3px';
    menuList[0].style.borderStyle = 'solid';
    menuList[0].style.borderColor = 'yellowgreen';

    window.document.onkeypress=document.onirkeypress = function (event) {


        alert('测试代码分段5，遥控器函数');

        event = event ? event : window.event;
        var keyCode = event.which ? event.which : event.keyCode;
        // playKeyPress(event);
        if((keyCode<37||keyCode>40)&&keyCode!=13){

            if (keyCode == 8 || keyCode == 24 || keyCode == 32){/!*返回键*!/
                window.history.back();
                alert('测试代码分段6，返回键');
            } else {
                // playKeyPress(event);
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
            if (i=='0') {/!*返回键*!/
                window.history.back();
            }
            else if (i == '3') {/!*特惠卖场页面*!/
                // window.location.href = './views/user/user.html'

            } else if (i == '4') {/!*用户中心页面*!/
                window.location.href = './views/user/user.html'
                // window.location.href = './views/special_stores/special_stores.html'

            } else if (i == '8' || i == '9' || i == '10' || i == '11'|| i == '12'|| i == '13') {

                window.location.href='./views/product_details/product_details.html?productId='+6;
                // productDetail(i);
                /!*商品详情页的跳转*!/

            } else if (i == '6') {/!*轮播图点击*!/
                window.location.href='./views/product_details/product_details.html?productId='+7;
                // slideCurrentImg();
                /!*轮播图点击详情跳转*!/
            }else if (i == '7') {/!*视频区域点击*!/
                window.location.href='./views/product_details/product_details.html?productId='+8;
                // videoOrImg(i);
                /!*轮播图点击详情跳转*!/
            }
        }
    };
    /!*商品详情页的跳转*!/
    /!*function productDetail(index) {
     var currentLi = menuList[index];
     var img = menuList[index];
     console.log(img);
     // var Id = img.dataset.contentid;
     var Id =  getAttrs(img,"contentid");
     var contentType =  getAttrs(img,"contenttype");
     var activeUrl;/!*活动Url*!/

     if (contentType=='0'){/!*商品类型*!/
     window.location.href='./views/product_details/product_details.html?productId='+Id;

     }else if(contentType=='1'){/!*商家类型*!/

     window.location.href='./views/merchant-detail/merchant_detail_shopDes.html?sellerId='+Id;
     }else if(contentType=='2'){/!*活动类型*!/
     activeUrl=img.dataset.contenturl;
     window.location.href=activeUrl;
     }
     }*!/

    /!* function videoOrImg(index) {
     var currentLi = menuList[index];
     console.log(currentLi);
     var Id;

     var contentType;

     var activeUrl;

     if(currentLi.children[0].style.display=='block'){
     console.log(currentLi.children[0]);

     /!*  Id =  currentLi.children[0].dataset.contentid;
     contentType=currentLi.children[0].dataset.contenttype;
     activeUrl=currentLi.children[0].dataset.contenturl;*!/


     Id=getAttrs(currentLi.children[0],'contentid');
     contentType=getAttrs(currentLi.children[0],'contenttype');
     activeUrl=getAttrs(currentLi.children[0],'contenturl');

     }else {
     /!* console.log(currentLi.children[1]);
     Id= currentLi.children[1].dataset.contentid;
     contentType=currentLi.children[1].dataset.contenttype;
     activeUrl=currentLi.children[1].dataset.contenturl;*!/
     Id=getAttrs(currentLi.children[1],'contentid');
     contentType=getAttrs(currentLi.children[1],'contenttype');
     activeUrl=getAttrs(currentLi.children[1],'contenturl');
     }

     if(Id){
     if (contentType=='0'){/!*商品类型*!/
     window.location.href='./views/product_details/product_details.html?productId='+Id;

     }else if(contentType=='1'){/!*商家类型*!/

     window.location.href='./views/merchant-detail/merchant_detail_shopDes.html?sellerId='+Id;
     }else if(contentType=='2'){/!*活动类型*!/
     window.location.href=activeUrl;
     }
     }
     }*!/
    function right() {
        if (i >= menuLisLength) {
            i = menuLisLength;
            menuList[i].style.borderColor = 'yellowgreen';
        }else if(i == '1'||i == '2'||i == '3' ){
            i = 6;
            menuList[i].style.borderColor = 'yellowgreen';

        }else if(i == '4'||i == '5'){
            i =i+6;
            menuList[i].style.borderColor = 'yellowgreen';

        } else if (i == '10') {
            i = i + 2;
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
        } else if (i == '12' ) {
            i = i - 2;
            menuList[i].style.borderColor = 'yellowgreen';

        } else if (i == '6') {
            i = i - 5;
            menuList[i].style.borderColor = 'yellowgreen';
        }else if (i == '8') {
            i = i - 2;
            menuList[i].style.borderColor = 'yellowgreen';
        }else if (i == '9') {
            i = i - 3;
            menuList[i].style.borderColor = 'yellowgreen';
        }else if (i == '10') {
            i = 4;
            menuList[i].style.borderColor = 'yellowgreen';
        }else if (i == '11') {
            i = 5;
            menuList[i].style.borderColor = 'yellowgreen';
        }else if (i>='0'&&i<='5') {

            menuList[i].style.borderColor = ' yellowgreen';
        }
        else {
            i--;
            menuList[i].style.borderColor = ' yellowgreen';
        }
    }
    function down() {
        if (i == '0'  ) {
            i = i + 7;
            menuList[i].style.borderColor = 'yellowgreen';

        } else if (i == '1'|| i == '2'||i == '3'||i == '4') {
            i++;
            menuList[i].style.borderColor = 'yellowgreen';

        } else if (i == '6') {
            i = i + 4;
            menuList[i].style.borderColor = 'yellowgreen';

        }else if (i == '7') {
            i = i +1;
            menuList[i].style.borderColor = 'yellowgreen';

        } else if (i=='8'||i == '9') {
            i = 13;
            menuList[i].style.borderColor = 'yellowgreen';

        } else if (i == '10') {
            i = i+1;
            menuList[i].style.borderColor = 'yellowgreen';

        } else if (i == '5' || i == '11' || i == '12' || i == '13') {
            menuList[i].style.borderColor = ' yellowgreen';
        }
    }
    function up() {
        if (i == '0'||i == '6' || i == '7' ) {
            i=0;
            menuList[i].style.borderColor = 'yellowgreen';

        }  else if (i>='1'&&i<='5') {
            i = i - 1;
            menuList[i].style.borderColor = 'yellowgreen';
        } else if (i == '8'||i == '9') {
            i = 7;
            menuList[i].style.borderColor = 'yellowgreen';

        } else if (i == '10') {
            i = i - 4;
            menuList[i].style.borderColor = 'yellowgreen';

        }else if (i == '11') {
            i = i - 1;
            menuList[i].style.borderColor = 'yellowgreen';

        }else if (i == '12') {
            i = i - 6;
            menuList[i].style.borderColor = 'yellowgreen';

        }else if (i == '13') {
            i = i - 5;
            menuList[i].style.borderColor = 'yellowgreen';
        }
    }
}
*/
