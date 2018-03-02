
/**
 * Created by admin on 2017/9/15.
 */
window.onload=function () {
    (function () {
        /*获取url携带的参数*/
        var parameter=urlData();
        var fromLaunch=parameter.fromLaunch;

        /*加上当前生态馆序号*/
        var cookText= GetCookie();
        var cookEcologicalNumber=cookText.ecologicalNumber||1;

        function setCookValue(cookEcologicalNumber) {
            document.cookie='ecologicalNumber='+cookEcologicalNumber;
        }
        /*获取扶贫模块的首页*/
        var indexVideoArea;/*视频区域数据*/

        queryFuPinIndex();
        function queryFuPinIndex () {
            ajaxJson({ type:'get',
                url:'recommendation/list',
                async:true,
                data:{},
                params:{
                    page_id:'3'
                },
                success:function (result) {
                    /*最新的数据结构*/
                     console.log(result);
                     if(result.resultCode==0){
                         videoOrImgHtml(result.data[0]);/*视频区域*/
                         indexVideoArea=result.data[0];
                         allHtml(result.data[1],'rightTwoImg');/*右侧两张图片*/
                         allHtml(result.data[2],'footTwoImg');/*底部两张图片*/
                     }else if(result.resultCode=='10'){
                         alertBox('用户登录超时');
                     }
                },
                error:function (status) {
                    window.location.href='../error.html';
                }
            });
        }
        /*扶贫首页其他区域的函数*/
        function allHtml(data,className) {/*每个区域赋值的函数*/
            var element=getClass(className);
            for (var i=0;i<data.recommendations.length;i++){
                element[i].src=subLink(data.recommendations[i].imageUrl);
                element[i].dataset.contentid=data.recommendations[i].idContent;
                element[i].dataset.contenttype=data.recommendations[i].contentType;  /*contentType:0商品，1商家，2活动,*/
                element[i].dataset.contenturl=data.recommendations[i].urlContent;   /*活动链接*/
            }
        }
        /*扶贫首页的视频或者图片函数*/
         var isVideo1=false;
         var isShowVideo1=false;
         var video1;
        function videoOrImgHtml(data) {
            var bigImg = getId('bigImg');
            if (data.recommendations[0].recommendationType == '0') {/*上线时要放开注释*/
            // if (true) {/*上线时要放开注释*/

                console.log('视频播放函数');
                isVideo1 = true;
                isShowVideo1=true;

                // var videoCode = data.recommendations[0].videoCodeHd;
                var videoCode = 'Umai:PROG/2671843@BESTV.STA.SMG';
                /*高清的code码*/

                video1=new VideoPlay('plyIfrOne',635,309,355,143,videoCode,'plyIfrBox1');/*准备播放正确的视频播放位置*/
                var plyIfr = getId('plyIfrOne');
                plyIfr.dataset.contentid = data.recommendations[0].idContent;
                plyIfr.dataset.contenttype = data.recommendations[0].contentType;/*contentType:0商品，1商家，2活动,*/
                plyIfr.dataset.contenturl = data.recommendations[0].urlContent;/*活动链接*/
            } else {
                isVideo1 = false;
                isShowVideo1=false;
                bigImg.src = subLink(data.recommendations[0].imageUrl);
                bigImg.style.display = 'block';

                bigImg.dataset.contentid = data.recommendations[0].idContent;
                bigImg.dataset.contenttype = data.recommendations[0].contentType;/*contentType:0商品，1商家，2活动,*/
                bigImg.dataset.contenturl = data.recommendations[0].urlContent;/*活动链接*/
            }
        }

        /*获取扶贫生态馆列表*/
        var BiodomeChangAn;
        var BiodomeBaoJi;
        var BiodomeHuXian;
        var BiodomeAnKang;
        queryBiodomeList ();
        function queryBiodomeList () {
            ajaxJson({ type:'get',
                url:'ecologicalHall/get-ecological-hall-list',
                async:true,
                data:{},
                params:{},
                success:function (result) {
                    BiodomeChangAn=result.data[0];
                    BiodomeBaoJi=result.data[1];
                    BiodomeHuXian=result.data[2];
                    BiodomeAnKang=result.data[3];
                    var  biodome_menu=getClass('biodome-menu');
                    for (var i=0;i<biodome_menu.length;i++){
                        biodome_menu[i].dataset.id=result.data[i].id;
                    }
                },
                error:function (status) {
                    window.location.href='./views/error.html';
                }
            });
        }
        /*查询生态商品列表*/
        function getEcologicalProductList(id) {
            ajaxJson({ type:'get',
                url:'ecologicalHall/get-ecological-product-list',
                async:true,
                data:{},
                params:{
                    ecological_hall_id:id
                },
                success:function (result) {
                    /*最新的数据结构*/
                    if(result.resultCode==0){
                        productListHtml(result.data);
                    }
                },
                error:function (status) {
                    window.location.href='../error.html';
                }
            });
        }
        function productListHtml(data) {
            var productListImg=getClass('productListImg');
            for (var j = 0; j < productListImg.length; j++) {
                productListImg[j].src = '../../img/noProduct.png';
                productListImg[j].dataset.contentid = '';
            }
            for (var i = 0; i < data.length; i++) {
                productListImg[i].src = subLink(data[i].productImage);
                productListImg[i].dataset.contentid = data[i].id || '';
            }
        }

        /*遥控器切换焦点框*/
        setTimeout( SwitchFocus,200);
        function SwitchFocus() {
            var menuList = document.getElementsByClassName('menu-item');
            var menuLisLength = menuList.length - 1;
            var i = cookEcologicalNumber;/*当前生态馆的序号默认为1，是首页*/
            // var currentLeftI=1;/*判断当前向右的I的值*/
            var currentLeftI=cookEcologicalNumber;/*判断当前向右的I的值*/

            initStyle();
            function initStyle() {//初始化样式
                for (var j = 0; j <= menuLisLength; j++) {
                    menuList[j].style.border = '3px solid transparent';
                }
            }
            menuList[i].style.border = '3px solid yellowgreen';

            /*添加cook值的执行操作函数*/
            contextSwitch();
            if(currentLeftI==1){
                console.log('执行这个up函数');
                iKindsShow('up');
            }else {
                console.log('执行left函数');
                iKindsShow('noLeft');
            }

            window.document.onkeypress=document.onirkeypress= function (event) {
                event = event ? event : window.event;
                var keyCode = event.which ? event.which : event.keyCode;
                if((keyCode<37||keyCode>40)&&keyCode!=13){
                    if (keyCode == 8 || keyCode == 24 || keyCode == 32){/*返回键*/
                        if(fromLaunch=='true'){/*卓影返回判断*/
                            var sValue = Utility.setValueByName("exitIptvApp");
                        }else {
                            window.history.back();
                        }
                    } else {
                        if (isVideo1&&isShowVideo1){
                            console.log('执行video1的事件');
                            video1.playKeyPress(event);
                        }else if(twoVideoExist&&isShowVideo2){
                            console.log('执行video2的事件');
                            video2.playKeyPress(event)
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
                    right();
                    contextSwitch();
                    iKindsShow('right');
                }
                else if (keyCode == 37) {//左
                    left();
                    contextSwitch();
                    iKindsShow('left');
                }
                else if (keyCode == 38) {//上
                    up();
                    contextSwitch();
                    iKindsShow('up');
                }
                else if (keyCode == 40) {//下
                    down();
                    contextSwitch();
                    iKindsShow('down');
                }
                else if (keyCode == 13) {//ok键
                    var product_id;
                    // contextSwitch();
                    menuList[i].style.border = '3px solid yellowgreen';

                    if (i == '0') {
                        window.location.href = '../user/user.html';
                    }
                    else if (i == '6') {/*视频区域*/
                        videoOrImg(i);
                    } else if (i >= '7' && i <= '10') {/*首页区域*/
                        productDetail(i);
                    } else if (i >= '13' && i <= '16') {
                        var ecological_hall_id = menuList[i].dataset.ecologicalhallid;
                        var position = menuList[i].dataset.position;
                        /*文化介绍详情页的跳转*/
                        window.location.href = './cultural-intro.html?ecological_hall_id=' + ecological_hall_id + '&position=' + position;
                    } else if (i >= '18' && i <= '25') {
                        kindProductDetail(i);
                        /*商品详情页的跳转*/
                    }
                    setCookValue(currentLeftI);/*设置cook值*/
                }
                tabChange(keyCode)/*tab按钮切换的样式*/
            };

            /*视频或者图片区域的跳转*/
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
                }
            }
            /*商品详情页的跳转*/
            function productDetail(index) {
                var img = menuList[index];
                var Id = img.dataset.contentid;
                var contentType=img.dataset.contenttype;
                var activeUrl;/*活动Url*/

                if (contentType=='0'){/*商品类型*/
                    window.location.href='../product_details/product_details.html?productId='+Id;
                }else if(contentType=='1'){/*商家类型*/
                    window.location.href='../merchant-detail/merchant_detail_shopDes.html?sellerId='+Id;
                }else if(contentType=='2'){/*活动类型*/
                    activeUrl=img.dataset.contenturl;
                    window.location.href=activeUrl;
                }
            }
            /*生态产品种类详情页的跳转*/
            function kindProductDetail(index) {
                var img = menuList[index];
                var Id = img.dataset.contentid;
                if (Id) {
                    window.location.href = '../product_details/product_details.html?productId=' + Id;
                } else {
                    alertBox('暂无该商品');
                }
            }
            /*生态馆赋值*/
            var twoVideoExist=false;
            var isShowVideo2=false;
            var video2;
            function biodomeHtml (index,data,id) {
                // menuList[index].dataset.id=data.id;
                var biodomeHeaderImg = getId('biodomeHeaderImg');
                var biodomeName = getId('biodomeName');
                var describeInfo = getId('describeInfo');
                biodomeHeaderImg.src = subLink(data.ecoTopicImage);
                biodomeName.innerHTML = data.name;
                describeInfo.innerHTML = data.introduce;
                var bigImgTwo = getId('bigImgTwo');
                var biodomeInfoImg = getClass('biodomeInfoImg');

                if (data.videoHd) {
                    console.log('执行这个函数，第二段视频');
                    var videoCode = data.videoHd;
                    twoVideoExist = true;
                    isShowVideo2=true;
                    video2=new VideoPlay('plyIfrTwo',613,354,533,327,videoCode,'videoOrImg');/*准备播放正确的视频播放位置*/
                    /*准备播放*/
                    for (var j = 0; j < data.introduceImages.length; j++) {
                        biodomeInfoImg[j].src = subLink(data.introduceImages[j].url);
                        biodomeInfoImg[j].dataset.position = data.introduceImages[j].position;
                        biodomeInfoImg[j].dataset.ecologicalhallid = id;
                    }
                } else {
                    twoVideoExist = false;
                    isShowVideo2=false;
                    bigImgTwo.style.display = 'block';
                    for (var x = 0; x < data.introduceImages.length; x++) {
                        biodomeInfoImg[x].src = subLink(data.introduceImages[x].url);
                        biodomeInfoImg[x].dataset.position = data.introduceImages[x].position;
                        biodomeInfoImg[x].dataset.ecologicalhallid = id;
                    }
                    /*上线时需要注释掉*/
                    // bigImgTwo.src = 'http://sx.iptv.bwton.com/resource/iptv/img/admin/20171114/c8ca0454-d463-4642-8b3b-4bf8a7e6cc27.png';
                }
            }

            function tabChange(keyCode) {/*tab按钮切换的样式*/
                var biodomeDesBox=document.getElementsByClassName('biodome-des-box')[0];
                var productList=document.getElementsByClassName('product-list')[0];
                if (i == '11') {
                    isShowVideo2=true;
                    productList.style.display = 'none';
                    biodomeDesBox.style.display = 'block';
                    if (twoVideoExist && keyCode == '37') {
                        video2.replay();
                        console.log('开始重播');
                    }
                } else if (i == '12') {
                    isShowVideo2=false;
                    biodomeDesBox.style.display = 'none';
                    productList.style.display = 'block';
                    if (twoVideoExist && (keyCode == '39' || keyCode == '40')) {
                        video2.stop();
                        console.log('停止播放视频');
                    }
                }
            }

            function iKindsShow(direction) {/*不同按钮i值对应的数据*/
                 var desLocal=menuList[11];
                if(i=='1'){

                    videoOrImgHtml(indexVideoArea);
                  /* console.log('首页'+twoVideoExist);
                   console.log('第一段视频'+isVideo1);
                    //判断是否有视频，加判断视频播放条件；
                    if(isVideo1){/!*判断视频video1*!/
                        isShowVideo1=true;
                        console.log('第一段视频显示');
                        video1.replay();// 显示视频并继续播放
                    }*/
                    if(twoVideoExist){/*判断视频video2*/
                        isShowVideo2=false;
                        if(direction=='up'){
                            console.log('第二个视频隐藏');
                            video2.stop(); /*其他生态馆的视频要停止*/
                        }
                    }

                }else if(i=='2'){
                    desLocal.src='../../img/fuPin-img/changAnDes.png';
                    biodomeHtml (i,BiodomeChangAn,menuList[i].dataset.id);
                    /*生态产品列表*/
                    getEcologicalProductList(menuList[i].dataset.id);

                    console.log('长安生态馆'+twoVideoExist);
                    console.log('第一段视频'+isVideo1);

                    if(isVideo1){
                        console.log('首页视频停止');
                        isShowVideo1=false;
                        video1.stop();//  暂停并隐藏视频
                    }
                    if(twoVideoExist){
                        console.log('第二个视频播放');
                        isShowVideo2=true;
                        if(direction=='left'){
                            console.log('左侧的的按钮跳过来的')
                        }else {
                            console.log('长安视频播放');
                            video2.replay();
                        }
                    }


                }else if(i=='3'){
                    desLocal.src='../../img/fuPin-img/baoJiDes.png';
                    biodomeHtml (i,BiodomeBaoJi,menuList[i].dataset.id);
                    /*生态产品列表*/
                    getEcologicalProductList(menuList[i].dataset.id);

                    console.log('宝鸡生态馆'+twoVideoExist);
                    console.log('第一段视频'+isVideo1);
                    if(isVideo1){
                        isShowVideo1=false;
                        video1.stop();//  暂停并隐藏视频
                    }
                    if(twoVideoExist){
                        isShowVideo2=true;
                        if(direction=='left'){
                            console.log('左边按钮')
                        }else {
                            console.log('宝鸡视频播放');
                            video2.replay();
                        }
                    }

                }else if(i=='4'){
                    desLocal.src='../../img/fuPin-img/huXianDes.png';
                    biodomeHtml (i,BiodomeHuXian,menuList[i].dataset.id);
                    /*生态产品列表*/
                    getEcologicalProductList(menuList[i].dataset.id);
                    console.log("户县生态馆"+twoVideoExist);
                    console.log('第一段视频'+isVideo1);
                    if(isVideo1){
                        console.log('执行这段if函数');
                        isShowVideo1=false;
                        video1.stop();//  暂停并隐藏视频
                    }
                    if(twoVideoExist){
                        console.log('执行这段else if 函数');
                        isShowVideo2=true;
                        if(direction=='left'){
                            console.log('左侧按钮')
                        }else {
                            console.log('户县视频播放');
                            video2.replay();
                        }
                    }

                }else if(i=='5'){
                    desLocal.src='../../img/fuPin-img/anKangDes.png';
                    biodomeHtml (i,BiodomeAnKang,menuList[i].dataset.id);
                    /*生态产品列表*/
                    getEcologicalProductList(menuList[i].dataset.id);
                    console.log("长安生态馆"+twoVideoExist);
                    console.log('第一段视频'+isVideo1);
                    if(isVideo1){
                        video1.stop();// 暂停并隐藏视频
                    }
                    if(twoVideoExist){
                        if(direction=='left'){
                          console.log('左侧的按钮');
                        }else {
                            console.log('长安视频播放');
                            video2.replay();
                        }
                    }

                }
            }
            function contextSwitch() {
                var index=document.getElementsByClassName('index')[0];
                var another=document.getElementsByClassName('another')[0];
                if(i==1){
                    index.style.display='inline-block';
                    another.style.display='none';
                }else if(i>='2'&&i<='5'){
                    index.style.display='none';
                    another.style.display='inline-block';
                }
            }
            function right() {
                var index=document.getElementsByClassName('index')[0];
                var biodome=document.getElementsByClassName('biodome-des-box')[0];
                if (i >= menuLisLength) {
                    i = menuLisLength;
                    menuList[i].style.border = '3px solid yellowgreen';
                } else if (i=='1') {
                    /*判断首页内容的区域显示隐藏*/
                    currentLeftI=i;
                    if(index.style.display=='inline-block'){

                        i = i + 5;
                        menuList[i].style.border = '3px solid yellowgreen';
                    }else {
                        i = 11;
                        menuList[i].style.border = '3px solid yellowgreen';
                    }
                } else if (i=='2') {
                    /*判断首页内容的区域显示隐藏*/
                    currentLeftI=i;
                    if(index.style.display=='inline-block'){
                        i = i + 5;
                        menuList[i].style.border = '3px solid yellowgreen';
                    }else {
                        i = 11;
                        menuList[i].style.border = '3px solid yellowgreen';
                    }
                }else if (i=='3') {
                    currentLeftI=i;
                    /*判断首页内容的区域显示隐藏*/
                    if(index.style.display=='inline-block'){
                        i = 7;
                        menuList[i].style.border = '3px solid yellowgreen';
                    }else {
                        if(biodome.style.display=='block'){
                            i = 13;
                        }else {
                            i = 18;
                        }
                        menuList[i].style.border = '3px solid yellowgreen';
                    }
                }else if (i=='4') {
                    currentLeftI=i;
                    /*判断首页内容的区域显示隐藏*/
                    if(index.style.display=='inline-block'){
                        i = 7;
                        menuList[i].style.border = '3px solid yellowgreen';
                    }else {
                        if(biodome.style.display=='block'){
                            i = 15;
                        }else {
                            i = 18;
                        }
                        menuList[i].style.border = '3px solid yellowgreen';
                    }
                }else if (i=='5') {
                    currentLeftI=i;
                    /*判断首页内容的区域显示隐藏*/
                    if(index.style.display=='inline-block'){
                        i = 7;
                        menuList[i].style.border = '3px solid yellowgreen';
                    }else {
                        if(biodome.style.display=='block'){
                            i = 16;
                        }else {
                            i = 22;
                        }
                        menuList[i].style.border = '3px solid yellowgreen';
                    }
                }else if (i=='7'||i=='8'||i=='10'){/*首页部分*/
                    menuList[i].style.border = '3px solid yellowgreen';

                }else if (i=='12'){/*其他部分*/

                    menuList[i].style.border = '3px solid yellowgreen';

                }else if (i=='13'||i=='14'||i=='15'||i=='16'){/*其他部分*/
                    i=17;
                    menuList[i].style.border = '3px solid yellowgreen';

                }/*else if (i=='16'){/!*其他部分*!/
                    i=i+1;
                    menuList[i].style.border = '3px solid yellowgreen';
                }*/else if (i=='17'){/*其他部分*/

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
                } else if (i >= '1'&&i<='5') {
                    menuList[i].style.border = '3px solid yellowgreen';

                }else if (i == '6') {/*向左的关键位置*/
                    i = currentLeftI;
                    menuList[i].style.border = '3px solid yellowgreen';

                }else if (i == '7'||i=='8') {/*向左的关键位置*/
                    i = 6;
                    menuList[i].style.border = '3px solid yellowgreen';

                }else if (i == '9') {
                    i = currentLeftI;

                    menuList[i].style.border = '3px solid yellowgreen';

                }else if (i == '10') {
                    i = 9;
                    menuList[i].style.border = '3px solid yellowgreen';

                }
                  /*下半部分*/
                else if (i == '11'||i=='13'||i=='14'||i == '15'||i == '16') {/*向左的关键位置*/
                    i = currentLeftI;
                    menuList[i].style.border = '3px solid yellowgreen';

                }else if (i == '12') {/*向左的关键位置*/
                    i = 11;
                    menuList[i].style.border = '3px solid yellowgreen';
                }else if (i == '18'||i == '22') {
                    i = currentLeftI;
                    menuList[i].style.border = '3px solid yellowgreen';
                }else if (i == '17') {
                    i = 13;
                    menuList[i].style.border = '3px solid yellowgreen';
                }else {
                    i--;
                    menuList[i].style.border = '3px solid yellowgreen';
                }
            }

            function down() {
                var biodome=document.getElementsByClassName('biodome-des-box')[0];
                if (i == '0' ) {
                    var index=document.getElementsByClassName('index')[0];
                    /*判断首页内容的区域显示隐藏*/
                    if(index.style.display=='inline-block'){
                        i = i + 7;
                        menuList[i].style.border = '3px solid yellowgreen';
                    }else {
                        i = i + 12;
                        menuList[i].style.border = '3px solid yellowgreen';
                    }

                } else if (i == '1'||i == '2'||i == '3'||i == '4') {
                    currentLeftI=i;
                    i++;
                    menuList[i].style.border = '3px solid yellowgreen';
                }else if (i == '5') {
                    currentLeftI=i;
                    menuList[i].style.border = '3px solid yellowgreen';
                }else if (i == '6') {
                    i=9;
                    menuList[i].style.border = '3px solid yellowgreen';
                }else if (i == '7') {
                    i=8;
                    menuList[i].style.border = '3px solid yellowgreen';
                }else if (i == '8') {
                    i=10;
                    menuList[i].style.border = '3px solid yellowgreen';
                }
                /*大于10是下半部分*/

                else if (i == '11') {
                    i=i+2;
                    menuList[i].style.border = '3px solid yellowgreen';

                }  else if (i == '12') {
                    i=19;
                    menuList[i].style.border = '3px solid yellowgreen';

                }else if (i == '13'||i=='14'||i=='15') {
                    i=i+1;
                    menuList[i].style.border = '3px solid yellowgreen';

                } else if (i == '18'||i=='19'||i == '20'||i=='21') {
                    i=i+4;
                    menuList[i].style.border = '3px solid yellowgreen';

                }else {
                    menuList[i].style.border = '3px solid yellowgreen';
                }
            }

            function up() {
                if (i == '0') {
                    menuList[i].style.border = '3px solid yellowgreen';
                } else if (i == '1' || i == '2' || i == '3' || i == '4'||i=='5') {
                    currentLeftI=i;
                    i--;
                    menuList[i].style.border = '3px solid yellowgreen';

                } else if (i == '6'||i == '7') {
                    i = 0;
                    menuList[i].style.border = '3px solid yellowgreen';

                } else if (i=='8') {
                    i = 7;
                    menuList[i].style.border = '3px solid yellowgreen';

                } else if (i == '9') {
                    i =6;
                    menuList[i].style.border = '3px solid yellowgreen';

                } else if (i == '10') {
                    i = 8;
                    menuList[i].style.border = '3px solid yellowgreen';
                }
                /*首页部分结束*/
                else if (i=='11'||i == '12') {
                    i = 0;
                    menuList[i].style.border = '3px solid yellowgreen';

                }else if (i=='13') {
                    i = i-2;
                    menuList[i].style.border = '3px solid yellowgreen';

                }else if (i=='14'||i=='15'||i=='16') {
                    i = i-1;
                    menuList[i].style.border = '3px solid yellowgreen';

                }/*else if (i=='15') {
                    i = i-3;
                    menuList[i].style.border = '3px solid yellowgreen';

                }else if (i=='16') {
                    i = i-1;
                    menuList[i].style.border = '3px solid yellowgreen';

                }*/else if (i=='17') {
                    i = 0;
                    menuList[i].style.border = '3px solid yellowgreen';
                } else if (i == '18') {
                    i=11;
                    menuList[i].style.border = '3px solid yellowgreen';

                }else if (i == '19') {
                    i=12;
                    menuList[i].style.border = '3px solid yellowgreen';

                }else if (i == '20'||i=='21') {
                    i=0;
                    menuList[i].style.border = '3px solid yellowgreen';

                }else if (i == '22'||i=='23'||i == '24'||i=='25') {
                    i=i-4;
                    menuList[i].style.border = '3px solid yellowgreen';

                }
            }
        }

    })();
};


