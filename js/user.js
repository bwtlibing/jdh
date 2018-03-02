/**
 * Created by admin on 2017/9/29.
 */
/*用户中心*/
window.onload=function () {

    (function () {
       /* function GetCookie() {
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
        var cook=  GetCookie();*/
        /*获取url携带的参数*/
        var parameter=urlData();
        var orderPage=parameter.orderPage||1;
        var collectPage=parameter.collectPage||1;
        var fromLaunch=parameter.fromLaunch;
        textHtml('orderPage',orderPage);
        textHtml('collectPage',collectPage);

        /*-------------------用户中心接口ajax-------------------------*/

        var upOff=0;/*上分页的开关状态*/
        var downOff=0;/*下分页的开关状态*/

        /*获取用户手机号*/
        var userPhoneNum = getId('phoneNum');
        ajaxJson({
            type: 'get',
            url: 'user/get-login-user-phone',
            async: true,
            data: {},
            params: {},
            success: function (result) {

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
                    userQRcode.src = subLink(result.data);
                }else if(result.resultCode=='10'){
                    // alertBox('登录超时3');
                }
            },
            error: function (status) {
                console.log(status)
            }
        });

        /*用户收藏接口*/
        userCollect(collectPage);/*收藏第一页*/
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
        userOrder(orderPage);/*订单第一页*/
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

            tipImgIsShow(data,'order-tip','order-ul');/*缺省图是否显示*/
            var orderUl = getId('order-ul');
            var liHtml = undefined;
            orderUl.innerHTML=null;
            var orderStatus=null;
            for (var i = 0; i < data.length; i++) {
                if(data[i].orderStatus=='0'){
                    orderStatus = '待付款';
                }else if(data[i].orderStatus=='1'||data[i].orderStatus=='5'){
                    orderStatus = '已取消';
                } else if(data[i].orderStatus=='2'){
                    orderStatus= '待商家发货';
                }else if(data[i].orderStatus=='3'){
                    orderStatus = '待收货';
                }else if(data[i].orderStatus=='4'){
                    orderStatus = '已完成';
                }
                liHtml = ' <li class="order-list-li order-item" data-productid="'+data[i].productId+'">'+
                ' <p> <span class="time">'+data[i].createTime+'</span> <span class="order-status">订单状态：<strong>'+orderStatus+'</strong></span> <span class="goods-num"><span class="orderProductName">'+data[i].orderProductName+'</span>X<span class="quantity">'+data[i].quantity+'</span></span> </p> <p>'+
                   ' <span class="order-id">订单号：<strong id="order-num'+i+'">'+data[i].orderNum+'</strong></span>'+ '<span class="order-money">订单总额：<strong class="orderAmount">￥'+data[i].orderAmount/100+'</strong></span></p></li>';
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
                liHtml = '<li class="collect-list  collect-item" data-collectid="'+data[i].collectId+'" data-productid="'+data[i].productId+'">' +
                    '<img class="productImage" src="'+subLink(data[i].productImage)+'" alt="">' +
                    '<div> <p class="productName">'+data[i].productName+'</p> <p class="collect-time">'+data[i].date+'</p> </div> </li>';
                collectUl.innerHTML+=liHtml;
            }
        }

        function tipImgIsShow(data,tipClassName,ulClassName) {/*缺省图是否显示*/
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
        setTimeout(function () {
            SwitchFocus();
        },300);

        function SwitchFocus() {
            var  menuList = document.getElementsByClassName('menu-item');
            var menuLisLength = menuList.length - 1;
            var orderList = getClass('order-item'); /*订单详情列表*/
            var collectList = getClass('collect-item'); /*收藏详情列表*/
            var orderListLength = orderList.length;
            var collectListLength = collectList.length;
            var i = 0;/*其他按钮编号*/
            var d=0;/*订单编号*/
            var s=0; /*收藏编号*/
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
                        window.location.href='../../index.html'
                    }
                    if((d==0||d==1||d==2)&&i==5){
                        console.log(collectList[d]);
                        orderDetail(d);
                    } else if((s==0||s==1||s==2)&&i==5){
                        console.log(orderList[s]);
                        productDetails(s);
                    }
                    else if(i=='1'){
                        upPage(0);

                    }else if(i=='2'){

                        downPage(0);

                    }else if(i=='3'){

                        upPage(1);

                    }else if(i=='4'){

                        downPage(1)
                    }
                }
            };
            function productDetails(index) {
                var curLi=getClass('collect-item')[index];
                var pid=curLi.dataset.productid;/*商品id*/
                var cid=curLi.dataset.productid;/*收藏id号*/
                var currentPage=getId('collectPage').innerHTML;
                window.location.href='../product_details/product_details.html?productId='+pid+'&collectId='+cid+'&page='+currentPage;
            }
            function orderDetail(index) {/*传入当前index参数获取对应的订单*/
                var curLi=getClass('order-item')[index];
                var pid=curLi.dataset.productid;
                var order_num=  getId('order-num'+index).innerHTML;
                var currentPage=getId('orderPage').innerHTML;
                window.location.href='../order/order_detail.html?order_num='+order_num+'&productId='+pid+'&page='+currentPage+'&orderPay=false';
            }
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
                collectStyleInit();
                orderStyleInit();
                var orderList = getClass('order-item'); /*订单详情列表*/
                var collectList = getClass('collect-item'); /*收藏详情列表*/
                var orderListLength = orderList.length;
                var collectListLength = collectList.length;

                if(orderListLength==0&&collectListLength==0){/*订单和收藏全部为0*/
                    if(i==0||i=='4'){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else {
                        i++;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==1&&collectListLength==0){/*订单量为1和收藏量为0*/
                    if(i==0||i==4){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(d==0){
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(i>=1&&i<=3){
                        i++;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==2&&collectListLength==0){/*订单量为2和收藏量为0*/
                    if(i==0||i==4){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(d==0||d==1){
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(i>=1&&i<=3){
                        i++;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==3&&collectListLength==0){/*订单量为3和收藏量为0*/
                    if(i==0||i==4){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(d==0||d==1||d==2){
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(i>=1&&i<=3){
                        i++;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==3&&collectListLength==1){/*订单量为3和收藏量为1*/

                    if(i==0||i==4){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(d==0||d==1||d==2){
                        s=0;
                        d=4;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(s==0){

                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(i>=1&&i<=3){
                        i++;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==3&&collectListLength==2){/*订单量为3和收藏量为2*/

                    if(i==0||i==4){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(d==0){
                        s=0;
                        d=4;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(d==1||d==2){
                        s=1;
                        d=4;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(s==0||s==1){

                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(i>=1&&i<=3){
                        i++;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==3&&collectListLength==3){/*订单量为3和收藏量3*/

                    if(i==0||i==4){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(d==0){
                        s=0;
                        d=4;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(d==1){
                        s=1;
                        d=4;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(d==2){
                        s=2;
                        d=4;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(s==0||s==1||s==2){
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(i>=1&&i<=3){
                        i++;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==2&&collectListLength==3){/*订单量为2和收藏量3*/

                    if(i==0||i==4){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(d==0){
                        s=0;
                        d=4;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(d==1){
                        s=1;
                        d=4;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(s==0||s==1||s==2){
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(i>=1&&i<=3){
                        i++;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==1&&collectListLength==3){/*订单量为1和收藏量3*/

                    if(i==0||i==4){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(d==0){
                        s=0;
                        d=4;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(s==0||s==1||s==2){
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(i>=1&&i<=3){
                        i++;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==0&&collectListLength==3){/*订单量为0和收藏量3*/

                    if(i==0||i==4){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(s==0||s==1||s==2){
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(i>=1&&i<=3){
                        i++;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==2&&collectListLength==2){/*订单量为2和收藏量2*/

                    if(i==0||i==4){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(d==0){
                        s=0;
                        d=4;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(d==1){
                        s=1;
                        d=4;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(s==0||s==1){
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(i>=1&&i<=3){
                        i++;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==1&&collectListLength==2){/*订单量为1和收藏量2*/

                    if(i==0||i==4){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(d==0){
                        s=0;
                        d=4;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(s==0||s==1){
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(i>=1&&i<=3){
                        i++;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==0&&collectListLength==2){/*订单量为0和收藏量2*/

                    if(i==0||i==4){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(s==0||s==1){
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(i>=1&&i<=3){
                        i++;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==2&&collectListLength==1){/*订单量为2和收藏量1*/
                    if(i==0||i==4){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(d==0||d==1){
                        s=0;
                        d=4;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(s==0){
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(i>=1&&i<=3){
                        i++;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==1&&collectListLength==1){/*订单量为1和收藏量1*/
                    if(i==0||i==4){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(d==0){
                        s=0;
                        d=4;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(s==0){
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(i>=1&&i<=3){
                        i++;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==0&&collectListLength==1){/*订单量为0和收藏量1*/
                    if(i==0||i==4){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(s==0){
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(i>=1&&i<=3){
                        i++;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }
                }
            }
            function left() {
                initStyle();//初始化样式
                collectStyleInit();
                orderStyleInit();
                var orderList = getClass('order-item'); /*订单详情列表*/
                var collectList = getClass('collect-item'); /*收藏详情列表*/
                var orderListLength = orderList.length;
                var collectListLength = collectList.length;
                if(orderListLength==0&&collectListLength==0){/*订单和收藏全部为0*/
                    if(i==0||i=='1'){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else {
                        i--;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==1&&collectListLength==0){/*订单量为1和收藏量为0*/
                    if(i==0||i==1){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(d==0){
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(i>=2&&i<=4){
                        i--;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==2&&collectListLength==0){/*订单量为2和收藏量为0*/
                    if(i==0||i==1){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(d==0||d==1){
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(i>=2&&i<=4){
                        i--;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==3&&collectListLength==0){/*订单量为3和收藏量为0*/
                    if(i==0||i==1){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(d==0||d==1||d==2){
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(i>=2&&i<=4){
                        i--;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==3&&collectListLength==1){/*订单量为3和收藏量为1*/
                    if(i==0||i==1){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(d==0||d==1||d==2){
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(s==0){
                        d=0;
                        s=4;
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(i>=2&&i<=4){
                        i--;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==3&&collectListLength==2){/*订单量为3和收藏量为2*/
                    if(i==0||i==1){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(d==0||d==1||d==2){
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(s==0){
                        d=0;
                        s=4;
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(s==1){
                        d=1;
                        s=4;
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(i>=2&&i<=4){
                        i--;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==3&&collectListLength==3){/*订单量为3和收藏量为3*/
                    if(i==0||i==1){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(d==0||d==1||d==2){
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(s==0){
                        d=0;
                        s=4;
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(s==1){
                        d=1;
                        s=4;
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(s==2){
                        d=2;
                        s=4;
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(i>=2&&i<=4){
                        i--;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==2&&collectListLength==3){/*订单量为2和收藏量为3*/
                    if(i==0||i==1){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(d==0||d==1){
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(s==0){
                        d=0;
                        s=4;
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(s==1){
                        d=1;
                        s=4;
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(s==2){
                        d=1;
                        s=4;
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(i>=2&&i<=4){
                        i--;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==1&&collectListLength==3){/*订单量为1和收藏量为3*/
                    if(i==0||i==1){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(d==0){
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(s==0||s==1||s==2){
                        d=0;
                        s=4;
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(i>=2&&i<=4){
                        i--;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==0&&collectListLength==3){/*订单量为0和收藏量为3*/
                    if(i==0||i==1){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(s==0||s==1||s==2){
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(i>=2&&i<=4){
                        i--;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==2&&collectListLength==2){/*订单量为2和收藏量为2*/
                    if(i==0||i==1){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(d==0||d==1){
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(s==0){
                        d=0;
                        s=4;
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(s==1){
                        d=1;
                        s=4;
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(i>=2&&i<=4){
                        i--;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==1&&collectListLength==2){/*订单量为1和收藏量为2*/
                    if(i==0||i==1){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(d==0){
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(s==0||s==1){
                        d=0;
                        s=4;
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(i>=2&&i<=4){
                        i--;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==0&&collectListLength==2){/*订单量为0和收藏量为2*/
                    if(i==0||i==1){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(s==0||s==1){
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(i>=2&&i<=4){
                        i--;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==2&&collectListLength==1){/*订单量为2和收藏量为1*/
                    if(i==0||i==1){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(d==0||d==1){
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(s==0){
                        d=0;
                        s=4;
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(i>=2&&i<=4){
                        i--;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==1&&collectListLength==1){/*订单量为1和收藏量为1*/
                    if(i==0||i==1){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(d==0){
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(s==0){
                        d=0;
                        s=4;
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(i>=2&&i<=4){
                        i--;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==0&&collectListLength==1){/*订单量为0和收藏量为1*/
                    if(i==0||i==1){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(s==0){

                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(i>=2&&i<=4){
                        i--;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }
                }
            }

            function down() {
                initStyle();//初始化样式
                collectStyleInit();
                orderStyleInit();
                var orderList = getClass('order-item'); /*订单详情列表*/
                var collectList = getClass('collect-item'); /*收藏详情列表*/
                var orderListLength = orderList.length;
                var collectListLength = collectList.length;
                if(orderListLength==0&&collectListLength==0){/*订单和收藏全部为0*/
                    if(i==0){
                        i=4;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else {
                        menuList[i].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==1&&collectListLength==0){/*订单量为1和收藏量为0*/
                    if(i==0){
                        d=0;
                        i=5;
                        orderList[d].style.borderColor = 'yellowgreen';
                        console.log(d);
                    }else if(d==0){
                        i=1;
                        d=4;/*大于订单的最大值*/
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(i>=1&&i<=4){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==2&&collectListLength==0){/*订单量为2和收藏量为0*/
                    if(i==0){
                        d=0;
                        i=5;
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(d==0){
                        d=d+1;
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(d==1){
                        i=1;
                        d=4;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(i>=1&&i<=4){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==3&&collectListLength==0){/*订单量为3和收藏量为0*/
                    if(i==0){
                        d=0;
                        i=5;
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(d==0){
                        d=d+1;
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(d==1){
                        d=d+1;
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(d==2){
                        i=1;
                        d=4;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(i>=1&&i<=4){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==3&&collectListLength==1){/*订单量为3和收藏量为1*/
                    if(i==0){
                        s=0;
                        d=4;
                        i=5;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(s==0){
                        i=3;
                        s=4;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(d==0){
                        d=d+1;
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(d==1){
                        d=d+1;
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(d==2){
                        i=1;
                        d=4;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(i>=1&&i<=4){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==3&&collectListLength==2){/*订单量为3和收藏量为2*/
                    if(i==0){
                        s=0;
                        d=4;
                        i=5;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(s==0){
                        i=5;
                        s=1;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(s==1){
                        i=3;
                        s=4;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(d==0){
                        d=d+1;
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(d==1){
                        d=d+1;
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(d==2){
                        i=1;
                        d=4;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(i>=1&&i<=4){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==3&&collectListLength==3){/*订单量为3和收藏量为3*/
                    if(i==0){
                        s=0;
                        d=4;
                        i=5;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(s==0){
                        i=5;
                        s=1;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(s==1){
                        i=5;
                        s=2;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(s==2){
                        i=3;
                        s=4;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(d==0){
                        d=d+1;
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(d==1){
                        d=d+1;
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(d==2){
                        i=1;
                        d=4;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(i>=1&&i<=4){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==2&&collectListLength==3){/*订单量为2和收藏量为3*/
                    if(i==0){
                        s=0;
                        d=4;
                        i=5;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(s==0){
                        i=5;
                        s=1;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(s==1){
                        i=5;
                        s=2;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(s==2){
                        i=3;
                        s=4;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(d==0){
                        d=d+1;
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(d==1){
                        i=1;
                        d=4;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(i>=1&&i<=4){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==1&&collectListLength==3){/*订单量为1和收藏量为3*/
                    if(i==0){
                        s=0;
                        d=4;
                        i=5;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(s==0){
                        i=5;
                        s=1;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(s==1){
                        i=5;
                        s=2;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(s==2){
                        i=3;
                        s=4;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(d==0){
                        i=1;
                        d=4;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(i>=1&&i<=4){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }

                }else if(orderListLength==0&&collectListLength==3){/*订单量为0和收藏量为3*/
                    if(i==0){
                        s=0;
                        d=4;
                        i=5;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(s==0){
                        i=5;
                        s=1;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(s==1){
                        i=5;
                        s=2;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(s==2){
                        i=3;
                        s=4;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(i>=1&&i<=4){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }

                }else if(orderListLength==2&&collectListLength==2){/*订单量为2和收藏量为2*/
                    if(i==0){
                        s=0;
                        d=4;
                        i=5;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(s==0){
                        i=5;
                        s=1;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(s==1){
                        i=3;
                        s=4;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(d==0){
                        d=d+1;
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(d==1){
                        i=1;
                        d=4;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(i>=1&&i<=4){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }

                }else if(orderListLength==1&&collectListLength==2){/*订单量为1和收藏量为2*/
                    if(i==0){
                        s=0;
                        d=4;
                        i=5;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(s==0){
                        i=5;
                        s=1;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(s==1){
                        i=3;
                        s=4;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(d==0){
                        i=1;
                        d=4;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(i>=1&&i<=4){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }

                }else if(orderListLength==0&&collectListLength==2){/*订单量为0和收藏量为2*/
                    if(i==0){
                        s=0;
                        d=4;
                        i=5;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(s==0){
                        i=5;
                        s=1;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(s==1){
                        i=3;
                        s=4;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(i>=1&&i<=4){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==2&&collectListLength==1){/*订单量为2和收藏量为1*/
                    if(i==0){
                        s=0;
                        d=4;
                        i=5;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(s==0){
                        i=3;
                        s=4;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(d==0){
                        d=d+1;
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(d==1){
                        i=1;
                        d=4;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(i>=1&&i<=4){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==1&&collectListLength==1){/*订单量为1和收藏量为1*/
                    if(i==0){
                        s=0;
                        d=4;
                        i=5;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(s==0){
                        i=3;
                        s=4;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(d==0){
                        i=1;
                        d=4;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(i>=1&&i<=4){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==0&&collectListLength==1){/*订单量为0和收藏量为1*/
                    if(i==0){
                        s=0;
                        d=4;
                        i=5;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(s==0){
                        i=3;
                        s=4;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(i>=1&&i<=4){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }
                }
            }
            function up() {
                initStyle();//初始化样式
                collectStyleInit();
                orderStyleInit();
                var orderList = getClass('order-item'); /*订单详情列表*/
                var collectList = getClass('collect-item'); /*收藏详情列表*/
                var orderListLength = orderList.length;
                var collectListLength = collectList.length;

                if(orderListLength==0&&collectListLength==0){/*订单和收藏全部为0*/
                    if(i==0){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else {
                        i=0;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==1&&collectListLength==0){/*订单量为1和收藏量为0*/
                    if(i==0){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(d==0){
                        i=0;
                        d=4;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(i==1||i==2){
                        d=0;
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(i==3||i==4){
                        i=0;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==2&&collectListLength==0){/*订单量为2和收藏量为0*/
                    if(i==0){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(d==0){
                        i=0;
                        d=4;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(d==1){
                        d=0;
                        i=5;
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(i==1||i==2){
                        d=1;
                        i=5;
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(i==3||i==4){
                        i=0;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==3&&collectListLength==0){/*订单量为3和收藏量为0*/
                    if(i==0){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(d==0){
                        i=0;
                        d=4;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(d==1){
                        d=0;
                        i=5;
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(d==2){
                        d=1;
                        i=5;
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(i==1||i==2){
                        d=2;
                        i=5;
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(i==3||i==4){
                        i=0;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==3&&collectListLength==1){/*订单量为3和收藏量为1*/

                    if(i==0){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(d==0){
                        i=0;
                        d=4;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(d==1){
                        d=0;
                        i=5;
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(d==2){
                        d=1;
                        i=5;
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(s==0){
                        i=0;
                        s=4;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(i==1||i==2){
                        d=2;
                        i=5;
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(i==3||i==4){
                        s=0;
                        i=5;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==3&&collectListLength==2){/*订单量为3和收藏量为2*/
                    if(i==0){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(d==0){
                        i=0;
                        d=4;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(d==1){
                        d=0;
                        i=5;
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(d==2){
                        d=1;
                        i=5;
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(s==0){
                        i=0;
                        s=4;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(s==1){
                        i=5;
                        s=0;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(i==1||i==2){
                        d=2;
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(i==3||i==4){
                        s=1;
                        i=5;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==3&&collectListLength==3){/*订单量为3和收藏量为3*/
                    if(i==0){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(d==0){
                        i=0;
                        d=4;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(d==1){
                        d=0;
                        i=5;
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(d==2){
                        d=1;
                        i=5;
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(s==0){
                        i=0;
                        s=4;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(s==1){
                        i=5;
                        s=0;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(s==2){
                        i=5;
                        s=1;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(i==1||i==2){
                        d=2;
                        i=5;
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(i==3||i==4){
                        s=2;
                        i=5;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==2&&collectListLength==3){/*订单量为2和收藏量为3*/
                    if(i==0){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(d==0){
                        i=0;
                        d=4;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(d==1){
                        d=0;
                        i=5;
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(s==0){
                        i=0;
                        s=4;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(s==1){
                        i=5;
                        s=0;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(s==2){
                        i=5;
                        s=1;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(i==1||i==2){
                        d=1;
                        i=5;
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(i==3||i==4){
                        s=2;
                        i=5;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==1&&collectListLength==3){/*订单量为1和收藏量为3*/
                    if(i==0){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(d==0){
                        i=0;
                        d=4;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(s==0){
                        i=0;
                        s=4;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(s==1){
                        i=5;
                        s=0;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(s==2){
                        i=5;
                        s=1;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(i==1||i==2){
                        d=0;
                        i=5;
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(i==3||i==4){
                        s=2;
                        i=5;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==0&&collectListLength==3){/*订单量为0和收藏量为3*/
                    if(i==0){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(s==0){
                        i=0;
                        s=4;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(s==1){
                        i=5;
                        s=0;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(s==2){
                        i=5;
                        s=1;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(i==1||i==2){
                        i=0;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(i==3||i==4){
                        s=2;
                        i=5;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==2&&collectListLength==2){/*订单量为2和收藏量为2*/
                    if(i==0){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(d==0){
                        i=0;
                        d=4;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(d==1){
                        d=0;
                        i=5;
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(s==0){
                        i=0;
                        s=4;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(s==1){
                        i=5;
                        s=0;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(i==1||i==2){
                        d=1;
                        i=5;
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(i==3||i==4){
                        s=1;
                        i=5;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==1&&collectListLength==2){/*订单量为1和收藏量为2*/
                    if(i==0){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(d==0){
                        i=0;
                        d=4;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(s==0){
                        i=0;
                        s=4;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(s==1){
                        i=5;
                        s=0;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(i==1||i==2){
                        d=0;
                        i=5;
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(i==3||i==4){
                        s=1;
                        i=5;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==0&&collectListLength==2){/*订单量为0和收藏量为2*/
                    if(i==0){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(s==0){
                        i=0;
                        s=4;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(s==1){
                        i=5;
                        s=0;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }else if(i==1||i==2){
                        i=0;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(i==3||i==4){
                        s=1;
                        i=5;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==2&&collectListLength==1){/*订单量为2和收藏量为1*/
                    if(i==0){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(d==0){
                        i=0;
                        d=4;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(d==1){
                        d=0;
                        i=5;
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(s==0){
                        i=0;
                        s=4;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(i==1||i==2){
                        d=1;
                        i=5;
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(i==3||i==4){
                        s=0;
                        i=5;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==1&&collectListLength==1){/*订单量为1和收藏量为1*/
                    if(i==0){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(d==0){
                        i=0;
                        d=4;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(s==0){
                        i=0;
                        s=4;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(i==1||i==2){
                        d=0;
                        i=5;
                        orderList[d].style.borderColor = 'yellowgreen';
                    }else if(i==3||i==4){
                        s=0;
                        i=5;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }
                }else if(orderListLength==0&&collectListLength==1){/*订单量为0和收藏量为1*/
                    if(i==0){
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(s==0){
                        i=0;
                        s=4;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(i==1||i==2){
                        i=0;
                        menuList[i].style.borderColor = 'yellowgreen';
                    }else if(i==3||i==4){
                        s=0;
                        i=5;
                        collectList[s].style.borderColor = 'yellowgreen';
                    }
                }
            }

        }
    })()
};

