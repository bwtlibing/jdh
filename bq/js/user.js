/**
 * Created by admin on 2017/9/29.
 */
/*用户中心*/
window.onload=function () {

    (function () {

        function GetCookie() {
            var objResult={};
            var aCookie = document.cookie.split("; ");

            for (var i=0; i < aCookie.length; i++) {
                var temp = aCookie[i].split("=");
                if(temp[0]){
                    objResult[temp[0]]=temp[1];
                }
            }
            return objResult;
        }
        var cook=  GetCookie();


        /*-------------------用户中心接口ajax-------------------------*/

        var upOff=0;/*上分页的开关状态*/
        var downOff=0;/*下分页的开关状态*/

        /*获取用户手机号*/
        var userPhoneNum = getId('phoneNum');
        // userPhoneNum.innerHTML =cook.phoneNumber;
        ajaxJson({
            type: 'get',
            url: 'user/get-login-user-phone',
            async: true,
            data: {},
            params: {},
            success: function (result) {
                console.log(result);
                console.log(result.data);

                if(result.resultCode=='0'){
                    userPhoneNum.innerHTML = result.data;
                }else if (result.resultCode=='10'){
                    alertBox('登录超时');
                }


            },
            error: function (status) {
                console.log(status)
            }
        });


        /*用户二维码图片生成 ajax接口*/
        var userQRcode = getId('user-QRcode');

        ajaxJson({
            type: 'post',
            url: 'user/user-center-code-image',
            async: true,
            data: {},
            params: {},
            success: function (result) {
                console.log(result);
                if (result.resultCode=='0'){
                    userQRcode.src = result.data;
                }else if(result.resultCode=='10'){
                    // alertBox('登录超时3');
                }
            },
            error: function (status) {
                console.log(status)
            }
        });


        /*用户收藏接口*/
        userCollect(1);/*收藏第一页*/
        var collectTotalPage=undefined;/*收藏总页数*/
        function userCollect(collectCurrentPageNum) {
            ajaxJson({ type:'get',
                url:'order/query-collect',
                async:true,
                data:{},
                params:{
                    page_num:collectCurrentPageNum,
                    page_size:3
                },
                success:function (result) {
                    console.log(result);

                    if (result.resultCode=='0'){
                        /*收藏赋值*/
                        collectTotalPage=result.data.totalPage;/*收藏总页数*/
                        collectHtml(result.data.pageData);
                        if(result.data.pageData.length=='0'){
                            downOff=0;
                        }else {
                            downOff=1;
                        }
                    }else if(result.resultCode=='10'){
                        // alertBox('登录超时3');
                    }


                },
                error:function (status) {
                    console.log(status);
                }
            });
        }

        /*用户订单接口*/
        userOrder(1);/*订单第一页*/
        var orderTotalPage=undefined;/*订单总页数*/
        function userOrder(orderCurrentPageNum) {
            ajaxJson({ type:'get',
                url:'order/query-order-list',
                async:true,
                data:{},
                params:{
                    page_num:orderCurrentPageNum,
                    page_size:3
                },
                success:function (result) {

                    if (result.resultCode=='0'){
                        orderTotalPage=result.data.totalPage; /*订单总页数*/

                        /*订单赋值*/
                        orderHtml(result.data.pageData);

                        if(result.data.pageData.length=='0'){
                            downOff=0;
                        }else {
                            downOff=1;
                        }
                    }else if(result.resultCode=='10'){
                        // alertBox('登录超时4');
                    }

                },
                error:function (status) {
                    console.log(status);
                }
            });
        }

        /*获得数据后订单赋值*/
        function orderHtml(data) {
            var li=getClass('order-list-li');

            // isShow (li,data);  /*根据data的长度显示的li数量*/
            tipImgIsShow(data,'order-tip','order-ul');/*缺省图是否显示*/
            var orderUl = getId('order-ul');
            var liHtml = undefined;
            orderUl.innerHTML=null;
            var orderStatus=null;
            for (var i = 0; i < data.length; i++) {

                if(data[i].orderStatus=='0'){
                    orderStatus = '待付款';
                }else if(data[i].orderStatus=='1'){
                    orderStatus = '已取消';
                } else if(data[i].orderStatus=='2'){
                    orderStatus= '待商家发货';
                }else if(data[i].orderStatus=='3'){
                    orderStatus = '待收货';
                }else if(data[i].orderStatus=='4'){
                    orderStatus = '已完成';
                }

              /*  liHtml = ' <li class="order-list-li order-item" data-productid="'+data[i].productId+'">'+
                    ' <p> <span class="time">'+data[i].createTime+'</span> <span class="order-status">订单状态：<strong>'+orderStatus+'</strong></span> <span class="goods-num"><span class="orderProductName">'+data[i].orderProductName+'</span>X<span class="quantity">'+data[i].quantity+'</span></span> </p> <p>'+
                    ' <span class="order-id">订单号：<strong id="order-num'+i+'">'+data[i].orderNum+'</strong></span>'+ '<span class="order-money">订单总额：<strong class="orderAmount">￥'+data[i].orderAmount/100+'</strong></span></p></li>';*/




                liHtml='<li class="order-list-li order-item" data-ordernum="'+data[i].orderNum+'"   data-productid="'+data[i].productId+'" > ' +
                    '<p> <span class="time">'+data[i].createTime+'</span> <span class="order-status"><strong>'+orderStatus+'</strong></span> </p> ' +
                    '<p> <span class="goods-num"><span class="orderProductName">'+data[i].orderProductName+'</span>X<span class="quantity">'+data[i].quantity+'</span></span> <span class="order-money"><strong class="orderAmount">￥'+data[i].orderAmount/100+'</strong></span> </p> </li>';

                orderUl.innerHTML+=liHtml;






            }
        }

        /*获得数据后收藏赋值*/

        function collectHtml(data) {
            var li=getClass('collect-list');
            // isShow (li,data);  /*根据data的长度显示的li数量*/
            tipImgIsShow(data,'collect-tip','collect-ul');/*缺省图是否显示*/
            var collectUl = getId('collect-ul');
            console.log(collectUl);
            var liHtml = undefined;
            collectUl.innerHTML=null;
            for (var i = 0; i < data.length; i++) {
                liHtml = '<li class="collect-list  collect-item"  data-collectid="'+data[i].collectId+'" data-productid="'+data[i].productId+'">' +
                    '<img class="productImage" src="'+data[i].productImage+'" alt="">' +
                    '<div> <p class="productName">'+data[i].productName+'</p> <p class="collect-time">'+data[i].date+'</p> </div> </li>';
                collectUl.innerHTML+=liHtml;
            }
        }

        function tipImgIsShow(data,tipClassName,ulClassName) {/*缺省图是否显示*/

            // var Ul=getId("collect-ul");
            var Ul=getId(ulClassName);
            var ele=getClass(tipClassName)[0];
            if(data.length=='0'){
                Ul.style.display='none';
                ele.style.display='block'
            }else {
                Ul.style.display='block';
                ele.style.display='none'
            }
        }

        function upPage(index) {/*上一页*/

            var currentPage=getClass('current-page')[index];

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
                queryList(index,value);
            }

        }
        function downPage(index) {/*下一页*/
            var currentPage=getClass('current-page')[index];

            var value=currentPage.innerHTML;

            if(index==0){
                if(value<orderTotalPage){
                    value++;
                    currentPage.innerHTML=value;
                    /*查询订单列表和我的收藏列表*/
                    queryList(index,value);
                }
                else {

                    alertBox('没有更多订单了')
                }
            }else if(index==1) {
                if(value<collectTotalPage){
                    value++;
                    currentPage.innerHTML=value;
                    /*查询订单列表和我的收藏列表*/
                    queryList(index,value);
                }
                else {
                    alertBox('没有更多收藏了')
                }
            }
        }

        /*ajax的入口*/
        function queryList(i,pNum) {/*查询订单列表和我的收藏列表*/
            var pageNum= pNum;
            if (i=='0'){
                userOrder(pageNum);
            }else {
                userCollect(pageNum);
            }
        }

        /*遥控器返回焦点框*/
        SwitchFocus();
        function SwitchFocus() {
            var menuList = document.getElementsByClassName('menu-item');
            var  orderList=getClass('order-item');/*订单详情列表*/
            var  collectList=getClass('collect-item');/*收藏详情列表*/

            var menuLisLength = menuList.length - 1;
            var i = 0;/*其他按钮编号*/
            var j=0;/*订单编号*/
            var y=0; /*收藏编号*/
            var isRight=0;/*判断左右方向*/
            var isLeft=1;/*判断左右方向*/
            console.log(menuList);
            initStyle();
            function initStyle() {//初始化样式
                for (var j = 0; j <= menuLisLength; j++) {
                    menuList[j].style.border = '3px solid transparent';
                    // menuList[j].style.borderRadius = '10px';
                }
            }
            menuList[0].style.border = '3px solid yellowgreen';
            // menuList[0].style.borderRadius = '10px';
            window.document.onkeypress=document.onirkeypress = function (event) {
                event = event ? event : window.event;
                var keyCode = event.which ? event.which : event.keyCode;
                if((keyCode<37||keyCode>40)&&keyCode!=13){

                    if (keyCode == 8 || keyCode == 24 || keyCode == 32){/*返回键*/
                        // window.history.back();
                        window.location.href='../../index.html'
                    }
                    return;
                }
                var alertBox=getId('alertModal');/*隐藏弹出框*/
                if(alertBox.style.display=='block'){
                    alertBox.style.display='none';
                    menuList[i].style.borderColor = 'yellowgreen';
                    return;
                }

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

                    if (i=='0'){
                        if(j==0&&y==0){

                            // window.history.back();
                            window.location.href='../../index.html'

                        }else {

                            if(isRight){
                                /* /!*收藏*!/*/
                                if(y=='1'){
                                    getProductId(y);
                                }else if(y=='2'){
                                    getProductId(y);
                                }else if(y=='3'){
                                    getProductId(y);
                                }
                                function getProductId(index) {
                                    var curLi=getClass('collect-item')[index-1];
                                    console.log(curLi);
                                    var pid=curLi.dataset.productid;/*商品id*/
                                    var cid=curLi.dataset.productid;/*收藏id号*/
                                    window.location.href='../product_details/product_details.html?productId='+pid+'&collectId='+cid;
                                }

                            }else {
                                /*订单*/
                                if(j=='1'){
                                    chuanCan(j-1);
                                }else if(j=='2'){
                                    chuanCan(j-1);
                                }else if(j=='3'){
                                    chuanCan(j-1);
                                }
                                function chuanCan(index) {/*传入当前index参数获取对应的订单*/
                                    var curLi=getClass('order-item')[index];
                                    console.log(curLi);
                                    var pid=curLi.dataset.productid;
                                    // var order_num=  getId('order-num'+index).innerHTML;
                                    var order_num= curLi.dataset.ordernum;
                                    window.location.href='../order/order_detail.html?order_num='+order_num+'&productId='+pid;
                                }

                            }
                        }


                    }else if(i=='1'){
                        upPage(0);

                    }else if(i=='2'){

                        if(downOff){
                            downPage(0);
                        }else {
                            //alert('别点了');

                        }
                    }else if(i=='3'){
                        upPage(1);

                    }else if(i=='4'){

                        if(downOff){
                            downPage(1)
                        }else {
                            //alert('别点了');
                        }
                    }
                }
            };

            /* function upPage(index) {/!*上一页*!/

             var currentPage=getClass('current-page')[index];

             var value=currentPage.innerHTML;
             var isIndex=currentPage.innerHTML;/!*判断是否第一页*!/
             value--;

             if(value<=1){
             value=1;
             }
             currentPage.innerHTML=value;

             /!*查询订单列表和我的收藏列表*!/
             if(isIndex=='1'){
             alert(value+'已到首页，别向上翻了');
             }else {
             queryList(index,value);
             }


             }
             function downPage(index) {/!*下一页*!/
             var currentPage=getClass('current-page')[index];

             var value=currentPage.innerHTML;
             value++;
             currentPage.innerHTML=value;

             /!*查询订单列表和我的收藏列表*!/
             queryList(index,value);
             }

             /!*ajax的入口*!/
             function queryList(i,pNum) {/!*查询订单列表和我的收藏列表*!/
             var pageNum= pNum;

             console.log(pageNum);

             if (i=='0'){
             userOrder(pageNum);
             }else {
             userCollect(pageNum);
             }
             }*/

            function orderStyleInit() {/*订单样式初始化*/
                for (var x = 0; x < orderList.length; x++) {
                    orderList[x].style.border = '2px solid #afafaf';
                }
            }
            function collectStyleInit() {/*收藏样式初始化*/
                for (var x = 0; x < collectList.length; x++) {
                    collectList[x].style.border = '2px solid #afafaf';
                }
            }

            function right() {
                initStyle();//初始化样式
                if(j<=0){
                    console.log('右侧执行');
                    if (i >= menuLisLength) {
                        i = menuLisLength;
                        menuList[i].style.borderColor = 'yellowgreen';
                    } else {

                        i++;
                        console.log(i);
                        if(i>=3){
                            isRight=1;
                            isLeft=0;
                        }
                        menuList[i].style.borderColor = 'yellowgreen';
                    }
                }else {

                    orderStyleInit();
                    if (i == '0') {
                        if(isRight&&i==0){
                            return;
                        }
                        isLeft=0;
                        isRight=1;
                        orderStyleInit();
                        collectStyleInit();
                        if (orderList.length > 0) {


                            if(j=='1'){
                                //alert(1)
                                if(collectList.length=='0'){
                                    orderList[j-1].style.borderColor = 'yellowgreen';
                                }else if(collectList.length=='1') {
                                    y=j;
                                    collectList[y-1].style.borderColor = 'yellowgreen';
                                }else if(collectList.length=='2') {
                                    y=j;
                                    collectList[y-1].style.borderColor = 'yellowgreen';
                                }else if(collectList.length=='3'){

                                    y=j;
                                    collectList[y-1].style.borderColor = 'yellowgreen';
                                }

                            }else if(j=='2'){

                                if(collectList.length=='0'){
                                    orderList[j-1].style.borderColor = 'yellowgreen';
                                }else if(collectList.length=='1') {
                                    y=collectList.length;
                                    collectList[y-1].style.borderColor = 'yellowgreen';
                                }else if(collectList.length=='2') {
                                    y=j;
                                    collectList[y-1].style.borderColor = 'yellowgreen';
                                }else if(collectList.length=='3'){
                                    y=j;
                                    collectList[y-1].style.borderColor = 'yellowgreen';
                                }

                            }else  if(j==orderList.length){
                                if(collectList.length=='0'){
                                    orderList[j-1].style.borderColor = 'yellowgreen';
                                }else if(collectList.length=='1') {
                                    y=collectList.length;
                                    collectList[y-1].style.borderColor = 'yellowgreen';
                                }else if(collectList.length=='2') {
                                    y=collectList.length;
                                    collectList[y-1].style.borderColor = 'yellowgreen';
                                }else if(collectList.length=='3'){
                                    y=collectList.length;
                                    collectList[y-1].style.borderColor = 'yellowgreen';
                                }
                            }
                        }/* else {
                         i++;
                         menuList[i].style.borderColor = 'red';
                         }*/
                    } else {
                        //alert('不是收藏夹');
                        if (i >= menuLisLength) {
                            i = menuLisLength;
                            menuList[i].style.borderColor = 'yellowgreen';
                        } else {

                            i++;
                            console.log(i);
                            if(i>=3){
                                isRight=1;
                                isLeft=0;
                            }
                            menuList[i].style.borderColor = 'yellowgreen';
                        }
                    }
                }
            }
            function left() {
                initStyle();//初始化样式
                if(j<=0){
                    if (i=='0') {
                        i = 0;
                        menuList[i].style.borderColor = 'yellowgreen';
                    } else {
                        if(i=='1'){
                            i=1;
                        }else {
                            i--;
                        }
                        if (i<=2){
                            isRight=0;
                            isLeft=1;
                        }
                        if(orderList.length>0){
                            j=orderList.length;
                        }
                        menuList[i].style.borderColor = 'yellowgreen';
                    }
                }
                else {

                    if (i == '0') {
                        if(isLeft&&i==0){
                            return;
                        }
                        isLeft=0;
                        isRight=0;
                        orderStyleInit();
                        collectStyleInit();
                        if (collectList.length > 0) {
                            if(y=='1'){
                                if(orderList.length=='0'){
                                    collectList[y-1].style.borderColor = 'yellowgreen';
                                }else if(orderList.length=='1') {
                                    j=y;
                                    orderList[j-1].style.borderColor = 'yellowgreen';
                                }else if(orderList.length=='2') {
                                    j=y;
                                    orderList[j-1].style.borderColor = 'yellowgreen';
                                }else if(orderList.length=='3'){
                                    j=y;
                                    orderList[j-1].style.borderColor = 'yellowgreen';
                                }

                            }else if(y=='2'){

                                if(orderList.length=='0'){
                                    collectList[y-1].style.borderColor = 'yellowgreen';
                                }else if(orderList.length=='1') {
                                    j=orderList.length;
                                    orderList[j-1].style.borderColor = 'yellowgreen';
                                }else if(orderList.length=='2') {
                                    j=y;
                                    orderList[j-1].style.borderColor = 'yellowgreen';
                                }else if(orderList.length=='3'){
                                    j=y;
                                    orderList[j-1].style.borderColor = 'yellowgreen';
                                }

                            }else  if(y==collectList.length){

                                if(orderList.length=='0'){
                                    collectList[y-1].style.borderColor = 'yellowgreen';
                                }else if(orderList.length=='1') {
                                    j=orderList.length;
                                    orderList[j-1].style.borderColor = 'yellowgreen';
                                }else if(orderList.length=='2') {
                                    j=orderList.length;
                                    orderList[j-1].style.borderColor = 'yellowgreen';
                                }else if(orderList.length=='3'){
                                    j=orderList.length;
                                    orderList[j-1].style.borderColor = 'yellowgreen';
                                }
                            }
                            else {
                                menuList[i].style.borderColor = 'yellowgreen';
                            }

                        } else {
                            i--;
                            menuList[i].style.borderColor = 'yellowgreen';
                        }
                    }
                    else {

                        if (false) {
                            i = menuLisLength;
                            menuList[i].style.borderColor = 'yellowgreen';
                        } else {
                            if(i=='1'){
                                i=1;
                            }else {
                                i--;
                            }
                            if (i<=2){
                                isRight=0;
                                isLeft=1;
                                console.log(j);
                                if(orderList.length>0){
                                    j=orderList.length;
                                    console.log(j)
                                }
                            }
                            menuList[i].style.borderColor = 'yellowgreen';
                        }
                    }
                }

            }


            function down() {

                initStyle();//初始化样式
                collectStyleInit();
                orderStyleInit();

                if(isRight){
                    //alert('右边')
                    if (i == '0') {/*收藏*/

                        collectStyleInit();
                        if (y == collectList.length && collectList.length > 0) {

                            i=3;
                            collectList[collectList.length - 1].style.borderColor = '#afafaf';
                            menuList[i].style.borderColor = 'yellowgreen';

                        } else if (collectList.length > 0) {

                            y++;
                            collectList[y - 1].style.borderColor = 'yellowgreen';
                            j=y;
                        } else if(collectList.length =='0'){
                            i=3;
                            menuList[i].style.borderColor = 'yellowgreen';
                        }
                    } else {

                        if (i >= menuLisLength) {
                            i = menuLisLength;
                            menuList[i].style.borderColor = 'yellowgreen';
                        } else {
                            menuList[i].style.borderColor = 'yellowgreen';
                        }
                    }

                }else {
                    //alert('左边')
                    if (i == '0') {/*订单*/
                        orderStyleInit();
                        if (j == orderList.length && orderList.length > 0) {
                            i++;
                            orderList[orderList.length - 1].style.borderColor = '#afafaf';
                            menuList[i].style.borderColor = 'yellowgreen';
                        } else if (orderList.length > 0) {
                            j++;
                            orderList[j - 1].style.borderColor = 'yellowgreen';
                        } else if (orderList.length=='0'){
                            i++;
                            menuList[i].style.borderColor = 'yellowgreen';
                        }else  {
                            // i++;
                            menuList[i].style.borderColor = 'yellowgreen';
                        }

                    } else {

                        if (i >= menuLisLength) {
                            i = menuLisLength;
                            menuList[i].style.borderColor = 'yellowgreen';
                        } else {
                            //i++;
                            menuList[i].style.borderColor = 'yellowgreen';
                        }
                    }
                }
            }

            function up() {

                //i=0;
                //menuList[i].style.borderColor = ' red';

                initStyle();//初始化样式
                if(j<=0){

                    if (i==0||i=='1'||i=='2') {

                        i=0;
                        menuList[i].style.borderColor = 'yellowgreen';
                    } else if(i=='3'||i=='4') {
                        if(collectList.length==0){
                            i=0;
                            menuList[i].style.borderColor = 'yellowgreen';
                        }else if(collectList.length>0) {
                            i=0;
                            y=collectList.length ;
                            j=collectList.length-1;
                            collectList[collectList.length - 1].style.borderColor = 'yellowgreen'
                        }
                    }

                }else {
                    if(isRight){
                        if (i == '0') {/*收藏*/
                            collectStyleInit();
                            if (y == 1 && collectList.length > 0) {
                                i=0;
                                y--;
                                menuList[i].style.borderColor = 'yellowgreen';

                            } else if (collectList.length > 0) {
                                y--;
                                collectList[y - 1].style.borderColor = 'yellowgreen';
                            }
                            j=y;

                        } else {

                            if (i=='3'||i=='4') {

                                if (collectList.length==0){
                                    i=0;
                                    j=0;
                                    menuList[i].style.borderColor = 'yellowgreen';
                                }else {
                                    i = 0;
                                    y=collectList.length;
                                    collectList[y-1].style.borderColor = 'yellowgreen';
                                }

                            } else {
                                menuList[i].style.borderColor = 'yellowgreen';
                            }
                        }
                    }else {
                        //alert('左边')
                        //console.log(j);
                        if (i == '0') {/*订单*/
                            orderStyleInit();
                            if (j == 1 && orderList.length > 0) {
                                i=0;
                                j--;
                                menuList[i].style.borderColor = 'yellowgreen';
                                //alert('1')
                            } else if (orderList.length > 0) {
                                //alert('2')
                                j--;
                                orderList[j - 1].style.borderColor = 'yellowgreen';
                            }
                            y=j;
                        } else {
                            if (orderList.length==0){
                                i=0;
                                j=0;
                                y=0;
                                menuList[i].style.borderColor = 'yellowgreen';

                            }else {
                                if (i=='1'||i=='2') {
                                    i=0;
                                    j=orderList.length;
                                    orderList[j-1].style.borderColor = 'yellowgreen';
                                } else  {
                                    //i++;
                                    menuList[i].style.borderColor = 'yellowgreen';
                                }
                            }

                        }
                    }
                }
            }
        }
    })()
};

