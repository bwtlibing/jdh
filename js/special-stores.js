/**
 * Created by admin on 2017/9/15.
 */


window.onload=function () {
    (function () {
        /*获取url携带的参数*/
        var parameter=urlData();
        var fromLaunch=parameter.fromLaunch;

        var cookText= GetCookie();
        var cookCurrentPage=cookText.currentPage||1;
        var cookIndex=cookText.index||1;
        function setCookValue(cookCurrentPage,cookIndex) {
            document.cookie='currentPage='+cookCurrentPage;
            document.cookie='index='+cookIndex;
        }
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
                    if(result.resultCode=='0'){
                        slideHtml(result.data[0]);/*区域一轮播图区域*/
                        videoOrImgHtml(result.data[1]);/*区域二视频区域*/
                        allHtml(result.data[2],'rightSmallImg');/*区域三视频下面一张小图片*/
                        allHtml(result.data[3],'bottomBigImg');/*区域四底部两张大图片*/
                        allHtml(result.data[4],'bottomSmallImg');/*区域五底部一张小图片*/
                    }
                    SwitchFocus(); /*焦点框执行函数*/
                },
                error:function (status) {
                     window.location.href='../error.html';
                }
            });
        }
        function allHtml(data,className) {/*每个区域赋值的函数*/
            var element=getClass(className);
            for (var i=0;i<data.recommendations.length;i++){
                element[i].src=subLink(data.recommendations[i].imageUrl);
                element[i].dataset.contentid=data.recommendations[i].idContent;
                element[i].dataset.contenttype=data.recommendations[i].contentType;  /*contentType:0商品，1商家，2活动,*/
                element[i].dataset.contenturl=data.recommendations[i].urlContent;   /*活动链接*/
            }
        }
        var isVideo;
        var video1;
        function videoOrImgHtml(data) {
            var bigImg = getId('bigImg');
            if(data.recommendations[0].recommendationType=='0'){/*上线时要放开注释*/
            // if(true){
                isVideo=true;

                var videoCode= data.recommendations[0].videoCodeHd;/*高清的code码*/
                // var videoCode= 'Umai:PROG/2671843@BESTV.STA.SMG';

                video1=new VideoPlay('plyIfrOne',314,174,871,130,videoCode,'plyIfrBox');/*准备播放正确的视频播放位置*/
                var plyIfr = getId('plyIfrOne');

                plyIfr.dataset.contentid=data.recommendations[0].idContent;
                plyIfr.dataset.contenttype=data.recommendations[0].contentType;  /*contentType:0商品，1商家，2活动,*/
                plyIfr.dataset.contenturl=data.recommendations[0].urlContent;   /*活动链接*/
            }else {
                isVideo=false;
                bigImg.src = subLink(data.recommendations[0].imageUrl);
                bigImg.style.display='block';
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

           liHtml='<li><img data-contenturl="'+data.recommendations[i].urlContent+'" data-contentid="'+data.recommendations[i].idContent+'" data-contenttype="'+data.recommendations[i].contentType+'" style=" position: absolute;width: 580px; height: 292px;opacity: 0" class="slide-img"  id="slideImg" src="'+subLink(data.recommendations[i].imageUrl)+'" alt=""/></li>';
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
            var Id = currentImg.dataset.contentid;
            var contentType=currentImg.dataset.contenttype;
            if (contentType=='0'){/*商品类型*/
                window.location.href='../product_details/product_details.html?productId='+Id;
            }else if(contentType=='1'){/*商家类型*/
                window.location.href='../merchant-detail/merchant_detail_shopDes.html?sellerId='+Id;
            }else if(contentType=='2'){/*活动类型*/
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

            var productInfo =getClass('product-info');
            var productName =getClass('product-name');
            var productPrice =getClass('product-price');
            var currentPage =getClass('current-page')[0];
            function selectionTextNum(resultNum,index) {
                var result;
                if(resultNum.length<6){
                    result=resultNum;
                    productName[index].style.fontSize='23px'
                } else if(resultNum.length>=6&&resultNum.length<8){
                    result=resultNum;
                    productName[index].style.fontSize='17px'
                }else {
                    result=resultNum.substring(0,3)+'...'+resultNum.substring(resultNum.length-3,resultNum.length);
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
                productImages[i].src = subLink(data[i].productImage);
                productInfo[i].style.display='block';
                productName[i].innerHTML =selectionTextNum(data[i].productName,i);
                productPrice[i].innerHTML ='￥'+data[i].price/100;
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
        // SwitchFocus();
        function SwitchFocus() {
            var menuList = document.getElementsByClassName('menu-item');
            var menuLisLength = menuList.length - 1;
           /* var i = 1;
            var currentLeftI=1;/!*判断当前向右的I的值*!/*/
            var i = cookIndex;
            var currentLeftI=cookIndex;/*判断当前向右的I的值*/

            initStyle();
            function initStyle() {//初始化样式
                for (var j = 0; j <= menuLisLength; j++) {
                    menuList[j].style.border = '3px solid transparent';
                }
            }
            menuList[i].style.border = '3px solid yellowgreen';
            if(i>=1&&i<=6){
                menuList[i].style.background = '#7907a5';
            }
            contextSwitch();/*返回页面时切换状态*/
            iKindsShow(cookCurrentPage,cookCurrentPage);
            var currentPage =getClass('current-page')[0];
            currentPage.innerHTML=cookCurrentPage;

            window.document.onkeypress=document.onirkeypress= function (event) {
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
                        video1.playKeyPress(event);
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
                var pageHtml=getClass('current-page')[0].innerHTML;
                if (keyCode == 39) {//右
                    right();
                    contextSwitch();
                    iKindsShow(1,1);
                }
                else if (keyCode == 37) {//左
                    left();
                    contextSwitch();
                    iKindsShow(pageHtml,pageHtml);
                }
                else if (keyCode == 38) {//上
                    up();
                    contextSwitch();
                    iKindsShow(1,1);
                }
                else if (keyCode == 40) {//下
                    down();
                    contextSwitch();
                    iKindsShow(1,1);
                }
                else if (keyCode == 13) {//ok键
                    menuList[i].style.border = '3px solid yellowgreen';
                    if (i=='0'){
                        window.location.href='../user/user.html';
                    }
                    else if(i=='8'){/*轮播图区域*/
                        slideCurrentImg();
                    }else if(i=='9'){/*视频区域*/
                        videoOrImg(i)
                    }else if(i>='10'&&i<='13'){
                        productDetail(i);  /*商品详情页的跳转*/

                    } else if(i>='14'&&i<='21'){/*商品种类点击跳商品详情页*/

                        kindProductDetail(i);
                    }
                    else if(i==menuList.length-2){

                        upPage(currentCategoryID);

                    }else if(i==menuList.length-1){

                        downPage(currentCategoryID);
                    }
                    var currentPage=getClass('current-page')[0];
                    var page=currentPage.innerHTML;
                    setCookValue(page,currentLeftI);
                }
            };
            function initPageNum(pages) {/*页码数归一*/
                var currentPage=getClass('current-page')[0];
                currentPage.innerHTML=pages;
            }
            function iKindsShow(initPage,pages) {/*不同按钮i值对应的数据*/

                if(i=='1'){
                    initPageNum(initPage);   /*页码数归一*/
                    changStatus(i);
                    //判断是否有视频，加判断视频播放条件；
                    if(isVideo){
                        console.log('有视频资源');
                        video1.replay();// 显示视频并继续播放
                    }else {
                        console.log('没有视频资源')
                    }
                }else if(i=='2'){

                    if(isVideo){
                        console.log('有视频资源');
                        video1.stop();//  暂停并隐藏视频
                    }else {
                        console.log('没有视频资源')
                    }

                    initPageNum(initPage);   /*页码数归一*/
                    currentCategoryID='22';
                    queryKindsProductList(22,pages);/*获取此类商品列表*/
                    changStatus(i);

                }else if(i=='3'){
                    if(isVideo){
                        console.log('有视频资源');
                        video1.stop();//  暂停并隐藏视频
                    }else {
                        console.log('没有视频资源')
                    }
                    initPageNum(initPage);   /*页码数归一*/
                    currentCategoryID='23';
                    queryKindsProductList(23,pages);/*获取此类商品列表*/
                    changStatus(i);

                }else if(i=='4'){
                    if(isVideo){
                        console.log('有视频资源');
                        video1.stop();//  暂停并隐藏视频
                    }else {
                        console.log('没有视频资源')
                    }
                    initPageNum(initPage);   /*页码数归一*/
                    currentCategoryID='24';
                    queryKindsProductList(24,pages);/*获取此类商品列表*/
                    changStatus(i);

                }else if(i=='5'){
                    if(isVideo){
                        console.log('有视频资源');
                        video1.stop();//  暂停并隐藏视频
                    }else {
                        console.log('没有视频资源')
                    }
                    initPageNum(initPage);   /*页码数归一*/
                    currentCategoryID='25';
                    queryKindsProductList(25,pages);/*获取此类商品列表*/
                    changStatus(i);

                }else if(i=='6'){
                    if(isVideo){
                        console.log('有视频资源');
                        video1.stop();//  暂停并隐藏视频
                    }else {
                        console.log('没有视频资源')
                    }
                    initPageNum(initPage);   /*页码数归一*/
                    currentCategoryID='26';
                    queryKindsProductList(26,pages);/*获取此类商品列表*/
                    changStatus(i);
                }else if(i=='7'){
                    if(isVideo){
                        console.log('有视频资源');
                        video1.stop();//  暂停并隐藏视频
                    }else {
                        console.log('没有视频资源')
                    }
                    initPageNum(initPage);   /*页码数归一*/
                    currentCategoryID='27';
                    queryKindsProductList(27,pages);/*获取此类商品列表*/
                    changStatus(i);
                }
            }
            /*商品详情页的跳转*/
            function productDetail(index) {
                var img = menuList[index];
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
                var Id;
                var contentType;
                var activeUrl;

                if(currentLi.children[0].style.display=='block'){
                    Id =  currentLi.children[0].dataset.contentid;
                    contentType=currentLi.children[0].dataset.contenttype;
                    activeUrl=currentLi.children[0].dataset.contenturl;

                }else {
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
                    clickGetContent(Id);  /*点击推荐位*/
                }else {
                    alertBox('暂无该商品');
                }
            }

            /*商品种类详情页的跳转*/
               function kindProductDetail(index) {

                   var img = menuList[index];

                   var Id = img.dataset.contentid;
                   if(Id){
                       window.location.href='../product_details/product_details.html?productId='+Id;
                   }else {
                       alertBox('暂无该商品');
                   }
               }

           //改变图片的src
            function changStatus(index) {
                var menu =getClass('menu');
                menu[0].style.background = '#7396dd';
                menu[1].style.background = '#cc8d55';
                menu[2].style.background = '#6868b0';
                menu[3].style.background = '#2ba8cc';
                menu[4].style.background = '#2db291';
                menu[5].style.background = '#ce7e7c';
                menu[6].style.background = '#86d192';
                menu[index - 1].style.background = '#7907a5';
            }
            function contextSwitch() {
                var index=document.getElementsByClassName('index')[0];
                var another=document.getElementsByClassName('another')[0];
                if(i==1){
                    index.style.display='inline-block';
                    another.style.display='none';
                }else if(i>='2'&&i<='7'){
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
                        i = 8;
                        menuList[i].style.border = '3px solid yellowgreen';
                    }else {
                        i = 14;
                        menuList[i].style.border = '3px solid yellowgreen';
                    }

                } else if (i=='2'||i=='3') {
                    /*判断首页内容的区域显示隐藏*/
                    currentLeftI=i;

                    if(index.style.display=='inline-block'){
                        i = 8;
                        menuList[i].style.border = '3px solid yellowgreen';
                    }else {
                        i = 14;
                        menuList[i].style.border = '3px solid yellowgreen';
                    }

                }else if (i=='4'||i=='5'||i=='6'||i=='7') {
                    currentLeftI=i;
                    /*判断首页内容的区域显示隐藏*/
                    if(index.style.display=='inline-block'){
                        i = 8;
                        menuList[i].style.border = '3px solid yellowgreen';
                    }else {
                        i = 18;
                        menuList[i].style.border = '3px solid yellowgreen';
                    }
                }else if (i=='8') {
                    i = i + 1;
                    menuList[i].style.border = '3px solid yellowgreen';

                }else if (i=='9'||i=='10'||i=='13') {
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
                } else if (i >= '1'&&i<='7') {
                    menuList[i].style.border = '3px solid yellowgreen';

                }else if (i == '8') {/*向左的关键位置*/
                    i = currentLeftI;

                    menuList[i].style.border = '3px solid yellowgreen';

                } else if (i == '11') {/*向左的关键位置*/

                    i = currentLeftI;
                    menuList[i].style.border = '3px solid yellowgreen';

                } else if (i == '10') {
                    i = i - 2;
                    menuList[i].style.border = '3px solid yellowgreen';

                }else if (i == '14') {/*向左的关键位置*/
                    i = currentLeftI;
                    menuList[i].style.border = '3px solid yellowgreen';

                }else if (i == '18') {/*向左的关键位置*/
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
                        i = i + 9;
                        menuList[i].style.border = '3px solid yellowgreen';
                    }else {
                        i = i + 17;
                        menuList[i].style.border = '3px solid yellowgreen';
                    }

                } else if (i == '1'||i == '2'||i == '3'||i == '4'||i == '5'||i == '6') {
                    currentLeftI=i;
                    i++;
                    menuList[i].style.border = '3px solid yellowgreen';
                }else if (i == '7') {
                    currentLeftI=i;
                    menuList[i].style.border = '3px solid yellowgreen';
                }else if (i == '8') {
                    i=11;
                    menuList[i].style.border = '3px solid yellowgreen';
                }else if (i == '9') {
                    i=10;
                    menuList[i].style.border = '3px solid yellowgreen';
                }else if (i == '10') {
                    i=13;
                    menuList[i].style.border = '3px solid yellowgreen';
                }else if (i == '14'||i=='15'||i=='16'||i=='17') {
                    i=i+4;
                    menuList[i].style.border = '3px solid yellowgreen';
                }else if (i == '18'||i=='19'||i=='20') {
                    i=22;
                    menuList[i].style.border = '3px solid yellowgreen';
                }else if (i == '21') {
                    i=23;
                    menuList[i].style.border = '3px solid yellowgreen';
                }else {
                    menuList[i].style.border = '3px solid yellowgreen';
                }
            }

            function up() {
                if (i == '0') {
                    menuList[i].style.border = '3px solid yellowgreen';
                } else if (i == '1'||i == '2'||i == '3'|| i == '4'||i=='5'||i=='6'||i=='7') {
                    currentLeftI=i;
                    i--;
                    menuList[i].style.border = '3px solid yellowgreen';

                } else if (i == '8'||i=='9') {
                    i = 0;
                    menuList[i].style.border = '3px solid yellowgreen';

                } else if (i == '10') {
                    i = i-1;
                    menuList[i].style.border = '3px solid yellowgreen';

                } else if (i == '11'||i == '12') {
                    i = 8;
                    menuList[i].style.border = '3px solid yellowgreen';

                }else if (i == '13') {
                    i = 10;
                    menuList[i].style.border = '3px solid yellowgreen';

                }else if (i == '14'||i == '15'||i == '16'||i=='17') {
                    i = 0;
                    menuList[i].style.border = '3px solid yellowgreen';

                }else if (i == '18'||i == '19'||i == '20'||i=='21') {
                    i = i-4;
                    menuList[i].style.border = '3px solid yellowgreen';

                }else if (i == '22'||i=='23') {
                    i = i-2;
                    menuList[i].style.border = '3px solid yellowgreen';
                }
            }
        }
    })();
};

