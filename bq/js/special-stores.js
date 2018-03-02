/**
 * Created by admin on 2017/9/15.
 */


window.onload=function () {
    (function () {

        /*-----------调用接口开始------------------*/

        /*获取推荐区域列表*/
        queryRecommendList ();
        function queryRecommendList () {
            ajaxJson({ type:'get',
                url:'recommendation/list',
                async:true,
                data:{},
                params:{
                    page_id:'2'
                },
                success:function (result) {


                    /*最新的数据结构*/
                    slideHtml(result.data[0]);/*区域一轮播图区域*/
                    videoOrImgHtml(result.data[1]);/*区域二视频区域*/
                    allHtml(result.data[2],'rightSmallImg');/*区域三视频下面一张小图片*/
                    allHtml(result.data[3],'bottomBigImg');/*区域四底部两张大图片*/
                    allHtml(result.data[4],'bottomSmallImg');/*区域五底部一张小图片*/

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
                element[i].dataset.contentid=data.recommendations[i].idContent;
                element[i].dataset.contenttype=data.recommendations[i].contentType;  /*contentType:0商品，1商家，2活动,*/
                element[i].dataset.contenturl=data.recommendations[i].urlContent;   /*活动链接*/
            }
        }

        var isVideo;
        function videoOrImgHtml(data) {
            var bigImg = getId('bigImg');
            var plyIfr = getId('plyIfr');
            if(data.recommendations[0].recommendationType=='0'){/*上线时要放开注释*/
                // if(true){

                isVideo=true;
                var videoCode= data.recommendations[0].videoCode;/*高清的code码*/
                // var videoCode= 'Umai:PROG/2671843@BESTV.STA.SMG';
                playPrepare(videoCode,149,128,444,103);/*准备播放*/
                plyIfr.dataset.contentid=data.recommendations[0].idContent;
                plyIfr.dataset.contenttype=data.recommendations[0].contentType;  /*contentType:0商品，1商家，2活动,*/
                plyIfr.dataset.contenturl=data.recommendations[0].urlContent;   /*活动链接*/
            }else {
                isVideo=false;
                bigImg.src = data.recommendations[0].imageUrl;
                bigImg.style.display='block';
                plyIfr.style.display='none';
                bigImg.dataset.contentid=data.recommendations[0].idContent;
                bigImg.dataset.contenttype=data.recommendations[0].contentType;  /*contentType:0商品，1商家，2活动,*/
                bigImg.dataset.contenturl=data.recommendations[0].urlContent;   /*活动链接*/
            }
        }

        /*区域一轮播图*/
        function slideHtml(data) {
            var slideUl = getId('slide');
            var btnUl=getId('slideBtn');
            var btnLi=null;
            var liHtml = null;
            slideUl.innerHTML=null;
            btnUl.innerHTML=null;
            for (var i = 0; i < data.recommendations.length; i++) {


                liHtml='<li><img data-contenturl="'+data.recommendations[i].urlContent+'" data-contentid="'+data.recommendations[i].idContent+'" data-contenttype="'+data.recommendations[i].contentType+'" style=" position: absolute;width: 282px; height: 210px;opacity: 0" class="slide-img"  id="slideImg" src="'+data.recommendations[i].imageUrl+'" alt=""/></li>';


                btnLi='<li class="btnItem"></li>';

                slideUl.innerHTML+=liHtml;
                btnUl.innerHTML+=btnLi;

            }
            var firstBtnLi=getClass('btnItem')[0];
            firstBtnLi.className='active';
            slideShow();//轮播图效果
        }

        /*点击推荐区域内容*/
        function clickGetContent (pId) {
            ajaxJson({ type:'post',
                url:'recommendation/add-clicks',
                async:true,
                data:{},
                params:{
                    recommendation_id:pId
                },
                success:function (result) {
                    console.log(result);
                },
                error:function (status) {
                    console.log(status);
                    window.location.href='../error.html';
                }
            });
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
            console.log(currentImg);
            var Id = currentImg.dataset.contentid;
            console.log(Id);
            var contentType=currentImg.dataset.contenttype;
            console.log(contentType);
            if (contentType=='0'){/*商品类型*/

                window.location.href='../product_details/product_details.html?productId='+Id;

            }else if(contentType=='1'){/*商家类型*/
                window.location.href='../merchant-detail/merchant_detail_shopDes.html?sellerId='+Id;

            }else if(contentType=='2'){/*活动类型*/
                // var url=currentImg.dataset.contenturl;
                window.location.href=currentImg.dataset.contenturl;
            }
        }
        /*查询分类商品列表*/

        var pages=null;
        function queryKindsProductList(category_id, currentPage) {

            ajaxJson({
                type: 'get',
                url: 'product/list-by-category',
                async: true,
                data: {},
                params: {
                    category_id: category_id,
                    page: currentPage
                },
                success: function (result) {
                    console.log(result);
                    pages=result.data.totalPage;
                    kindsProductHtml(result.data.pageData);
                },
                error: function (status) {
                    window.location.href='../error.html';
                }
            });
        }

        function kindsProductHtml(data) {/*商品列表赋值*/

            var productUl = getId('productUl');
            var productImages = productUl.getElementsByClassName('product-img');
            var topImages = productUl.getElementsByClassName('top-img');

            console.log(productImages);
            console.log(productImages.length);

            var productInfo =getClass('product-info');
            var productName =getClass('product-name');
            var productPrice =getClass('product-price');

            function selectionTextNum(resultNum,index) {
                var result;
                if(resultNum.length<6){
                    result=resultNum;
                    productName[index].style.fontSize='16px'
                } /*else if(resultNum.length>=6&&resultNum.length<8){
                    result=resultNum;
                    productName[index].style.fontSize='16px'
                }*/else {
                    result=resultNum.substring(0,2)+'..'+resultNum.substring(resultNum.length-2,resultNum.length);
                    productName[index].style.fontSize='16px';
                }

                return  result;
            }




            for (var j = 0; j < productImages.length; j++) {
                productImages[j].src = '../../img/noProduct.png';
                productInfo[j].style.display='none';
                /* productName[j].innerHTML = '';
                 productPrice[j].innerHTML ='';*/
                productImages[j].dataset.contentid = '';
                topImages[j].style.display='none';
            }
            for (var i = 0; i < data.length; i++) {
                productImages[i].src = data[i].productImage;
                productInfo[i].style.display='block';
                productName[i].innerHTML =selectionTextNum(data[i].productName,i);
                // productPrice[i].innerHTML ='￥'+data[i].price/100;
                productImages[i].dataset.contentid = data[i].id || '';
                if (data[i].isOnTop){

                    topImages[i].style.display='block';
                }

            }
        }


        /*上下翻页开始*/

        var currentCategoryID=undefined;/*获取菜单页当前页的分类ID*/

        function upPage(currentCategoryID) {/*上一页*/

            var currentPage=getClass('current-page')[0];

            var value=currentPage.innerHTML;
            var isIndex=currentPage.innerHTML;/*判断是否第一页*/
            value--;

            if(value<=1){
                value=1;
            }
            currentPage.innerHTML=value;

            /*查询订单列表和我的收藏列表*/
            if(isIndex=='1'){

            }else {
                // queryList(index,value);
                queryKindsProductList(currentCategoryID,value)
            }
        }
        function downPage(currentCategoryID) {/*下一页*/
            var currentPage=getClass('current-page')[0];
            var value=currentPage.innerHTML;
            if(value<pages){
                value++;
                currentPage.innerHTML=value;
                queryKindsProductList(currentCategoryID,value)
            }else {
                alertBox('更多商品,敬请期待');
            }
        }

        function initPageNum() {/*页码数归一*/
            var currentPage=getClass('current-page')[0];
            currentPage.innerHTML=1;
        }

        /*上下翻页结束*/


        /*-----------调用接口结束------------------*/

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
            var i = 1;
            var currentLeftI=1;/*判断当前向右的I的值*/

            console.log(menuList);
            initStyle();
            function initStyle() {//初始化样式
                for (var j = 0; j <= menuLisLength; j++) {
                    menuList[j].style.border = '3px solid transparent';
                    // menuList[j].style.borderRadius = '5px';
                }
            }
            menuList[i].style.border = '3px solid yellowgreen';
            // menuList[i].style.borderRadius = '5px';

            window.document.onkeypress=document.onirkeypress= function (event) {
                event = event ? event : window.event;
                var keyCode = event.which ? event.which : event.keyCode;
                if((keyCode<37||keyCode>40)&&keyCode!=13){
                    if (keyCode == 8 || keyCode == 24 || keyCode == 32){/*返回键*/
                        window.history.back();
                    } else {
                        playKeyPress(event);
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

                    right();
                    contextSwitch();
                    iKindsShow();

                }
                else if (keyCode == 37) {//左

                    left();
                    contextSwitch();
                    iKindsShow();
                }
                else if (keyCode == 38) {//上

                    up();
                    contextSwitch();
                    iKindsShow();
                }
                else if (keyCode == 40) {//下

                    down();
                    contextSwitch();
                    iKindsShow();

                }
                else if (keyCode == 13) {//ok键

                    // contextSwitch();
                    menuList[i].style.border = '3px solid yellowgreen';

                    if (i=='0'){
                        // window.history.back();
                        window.location.href='../user/user.html';
                    }
                    else if(i=='7'){/*轮播图区域*/

                        slideCurrentImg();

                    }else if(i=='8'){/*视频区域*/
                        videoOrImg(i)
                    }else if(i>='9'&&i<='12'){

                        productDetail(i);  /*商品详情页的跳转*/

                    } else if(i>='13'&&i<='20'){/*商品种类点击跳商品详情页*/

                        kindProductDetail(i);
                    }
                    else if(i==menuList.length-2){

                        upPage(currentCategoryID);

                    }else if(i==menuList.length-1){

                        downPage(currentCategoryID);
                    }
                }

            };



            function iKindsShow() {/*不同按钮i值对应的数据*/

                if(i=='1'){
                    initPageNum();   /*页码数归一*/
                    changImgSrc(i,'../../img/special-stores-img/shouYeActive.png');
                    //判断是否有视频，加判断视频播放条件；
                    if(isVideo){
                        replay();// 显示视频并继续播放
                    }

                }else if(i=='2'){

                    if(isVideo){
                        stop();//  暂停并隐藏视频
                    }

                    initPageNum();   /*页码数归一*/
                    currentCategoryID='22';
                    queryKindsProductList(22,1);/*获取此类商品列表*/
                    changImgSrc(i,'../../img/special-stores-img/jingPinActive.png');

                }else if(i=='3'){
                    if(isVideo){
                        stop();//  暂停并隐藏视频
                    }
                    initPageNum();   /*页码数归一*/
                    currentCategoryID='23';
                    queryKindsProductList(23,1);/*获取此类商品列表*/
                    changImgSrc(i,'../../img/special-stores-img/benDiActive.png');

                }else if(i=='4'){
                    if(isVideo){
                        stop();//  暂停并隐藏视频
                    }
                    initPageNum();   /*页码数归一*/
                    currentCategoryID='24';
                    queryKindsProductList(24,1);/*获取此类商品列表*/
                    changImgSrc(i,'../../img/special-stores-img/youLeActive.png');

                }else if(i=='5'){
                    if(isVideo){
                        stop();//  暂停并隐藏视频
                    }
                    initPageNum();   /*页码数归一*/
                    currentCategoryID='25';
                    queryKindsProductList(25,1);/*获取此类商品列表*/
                    changImgSrc(i,'../../img/special-stores-img/yongPinActive.png');

                }else if(i=='6'){

                    if(isVideo){
                        stop();//  暂停并隐藏视频
                    }
                    initPageNum();   /*页码数归一*/
                    currentCategoryID='26';
                    queryKindsProductList(26,1);/*获取此类商品列表*/
                    changImgSrc(i,'../../img/special-stores-img/footActive.png');
                }
            }


            /*商品详情页的跳转*/
            function productDetail(index) {
                var currentLi = menuList[index];
                // var img = currentLi.children[0];
                var img = menuList[index];
                console.log(img);
                var Id = img.dataset.contentid;
                var contentType=img.dataset.contenttype;
                var activeUrl;
                if(Id){
                    if (contentType=='0'){/*商品类型*/
                        window.location.href='../product_details/product_details.html?productId='+Id;

                    }else if(contentType=='1'){/*商家类型*/

                        window.location.href='../merchant-detail/merchant_detail_shopDes.html?sellerId='+Id;

                    }else if(contentType=='2'){/*活动类型*/
                        activeUrl=img.dataset.contenturl;
                        window.location.href=activeUrl;
                    }
                    clickGetContent(Id);  /*点击推荐位*/
                }else {
                    alertBox('暂无该商品');
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
                        window.location.href='../product_details/product_details.html?productId='+Id;

                    }else if(contentType=='1'){/*商家类型*/

                        window.location.href='../merchant-detail/merchant_detail_shopDes.html?sellerId='+Id;

                    }else if(contentType=='2'){/*活动类型*/

                        window.location.href=activeUrl;
                    }
                    //clickGetContent(Id);  /*点击推荐位*/
                }else {
                    alertBox('暂无该商品');
                }
            }


            /*商品种类详情页的跳转*/
            function kindProductDetail(index) {
                var currentLi = menuList[index];
                // var img = currentLi.children[0];
                var img = menuList[index];
                console.log(img);
                var Id = img.dataset.contentid;
                if(Id){
                    window.location.href='../product_details/product_details.html?productId='+Id;
                }else {
                    alertBox('暂无该商品');
                }
            }

            //改变图片的src
            function changImgSrc(index,src) {
                var menuImg = document.getElementsByClassName('menu-img');
                menuImg[0].src = '../../img/special-stores-img/shouYe.png';
                menuImg[1].src = '../../img/special-stores-img/jingPin.png';
                menuImg[2].src = '../../img/special-stores-img/benDi.png';
                menuImg[3].src = '../../img/special-stores-img/youLe.png';
                menuImg[4].src = '../../img/special-stores-img/yongPin.png';
                menuImg[5].src = '../../img/special-stores-img/foot.png';
                menuImg[index - 1].src = src;
            }

            function contextSwitch() {
                var index=document.getElementsByClassName('index')[0];
                var another=document.getElementsByClassName('another')[0];
                if(i==1){
                    index.style.display='inline-block';
                    another.style.display='none';
                }else if(i>='2'&&i<='6'){
                    index.style.display='none';
                    another.style.display='inline-block';
                }
            }

            function right() {
                var index=document.getElementsByClassName('index')[0];
                if (i >= menuLisLength) {
                    i = menuLisLength;
                    menuList[i].style.border = '3px solid yellowgreen';
                } else if (i=='1') {
                    /*判断首页内容的区域显示隐藏*/
                    currentLeftI=i;
                    if(index.style.display=='inline-block'){
                        i = i + 6;
                        menuList[i].style.border = '3px solid yellowgreen';
                    }else {
                        i = 13;
                        menuList[i].style.border = '3px solid yellowgreen';
                    }

                } else if (i=='2'||i=='3') {
                    /*判断首页内容的区域显示隐藏*/
                    currentLeftI=i;

                    if(index.style.display=='inline-block'){
                        i = 7;
                        menuList[i].style.border = '3px solid yellowgreen';
                    }else {
                        i = 13;
                        menuList[i].style.border = '3px solid yellowgreen';
                    }

                }else if (i=='4'||i=='5'||i=='6') {

                    currentLeftI=i;
                    /*判断首页内容的区域显示隐藏*/
                    if(index.style.display=='inline-block'){
                        i = 7;
                        menuList[i].style.border = '3px solid yellowgreen';
                    }else {
                        i = 17;
                        menuList[i].style.border = '3px solid yellowgreen';
                    }

                }else if (i=='7') {
                    i = i + 1;
                    menuList[i].style.border = '3px solid yellowgreen';

                }else if (i=='8'||i=='9'||i=='12') {
                    menuList[i].style.border = '3px solid yellowgreen';

                }else {
                    i++;
                    menuList[i].style.border = '3px solid yellowgreen';
                }
            }

            function left() {
                if (i <= 0) {
                    i = 0;
                    menuList[i].style.border = '3px solid yellowgreen';
                } else if (i >= '1'&&i<='6') {
                    menuList[i].style.border = '3px solid yellowgreen';

                }else if (i == '7') {/*向左的关键位置*/
                    i = currentLeftI;

                    menuList[i].style.border = '3px solid yellowgreen';

                } else if (i == '10') {/*向左的关键位置*/

                    i = currentLeftI;
                    menuList[i].style.border = '3px solid yellowgreen';

                } else if (i == '9') {
                    i = i - 2;
                    menuList[i].style.border = '3px solid yellowgreen';

                }else if (i == '13') {/*向左的关键位置*/
                    i = currentLeftI;
                    menuList[i].style.border = '3px solid yellowgreen';

                }else if (i == '17') {/*向左的关键位置*/
                    i = currentLeftI;
                    menuList[i].style.border = '3px solid yellowgreen';
                } else {
                    i--;
                    menuList[i].style.border = '3px solid yellowgreen';
                }
            }

            function down() {
                if (i == '0' ) {
                    var index=document.getElementsByClassName('index')[0];
                    /*判断首页内容的区域显示隐藏*/
                    if(index.style.display=='inline-block'){
                        i = i + 8;
                        menuList[i].style.border = '3px solid yellowgreen';
                    }else {
                        i = i + 16;
                        menuList[i].style.border = '3px solid yellowgreen';
                    }

                } else if (i == '1'||i == '2'||i == '3'||i == '4'||i == '5') {
                    currentLeftI=i;
                    i++;
                    menuList[i].style.border = '3px solid yellowgreen';
                }else if (i == '6') {
                    currentLeftI=i;
                    menuList[i].style.border = '3px solid yellowgreen';
                }else if (i == '7') {
                    i=10;
                    menuList[i].style.border = '3px solid yellowgreen';
                }else if (i == '8') {
                    i=9;
                    menuList[i].style.border = '3px solid yellowgreen';
                }else if (i == '9') {
                    i=12;
                    menuList[i].style.border = '3px solid yellowgreen';
                }else if (i == '13'||i=='14'||i=='15'||i=='16') {
                    i=i+4;
                    menuList[i].style.border = '3px solid yellowgreen';
                }else if (i == '17'||i=='18'||i=='19') {
                    i=21;
                    menuList[i].style.border = '3px solid yellowgreen';
                }else if (i == '20') {
                    i=22;
                    menuList[i].style.border = '3px solid yellowgreen';
                }else {
                    menuList[i].style.border = '3px solid yellowgreen';
                }
            }

            function up() {
                if (i == '0') {
                    menuList[i].style.border = '3px solid yellowgreen';
                } else if (i == '1' || i == '2' || i == '3' || i == '4'||i=='5'||i=='6') {
                    currentLeftI=i;
                    i--;
                    menuList[i].style.border = '3px solid yellowgreen';

                } else if (i == '7'||i=='8') {
                    i = 0;
                    menuList[i].style.border = '3px solid yellowgreen';

                } else if (i == '9') {
                    i = i-1;
                    menuList[i].style.border = '3px solid yellowgreen';

                } else if (i == '10'||i == '11') {
                    i = 7;
                    menuList[i].style.border = '3px solid yellowgreen';

                }else if (i == '12') {
                    i = 9;
                    menuList[i].style.border = '3px solid yellowgreen';

                }else if (i == '13'||i == '14'||i == '15'||i=='16') {
                    i = 0;
                    menuList[i].style.border = '3px solid yellowgreen';

                }else if (i == '17'||i == '18'||i == '19'||i=='20') {
                    i = i-4;
                    menuList[i].style.border = '3px solid yellowgreen';

                }else if (i == '21'||i=='22') {
                    i = i-2;
                    menuList[i].style.border = '3px solid yellowgreen';
                }
            }
        }
    })();
};

