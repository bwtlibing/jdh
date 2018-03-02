/**
 * Created by admin on 2017/9/22.
 */
/**
 * Created by admin on 2017/9/18.
 */
window.onload=function () {

    (function () {

        /*获取url携带的参数*/
        var parameter=urlData();
        console.log(parameter);
        var order_num=parameter.order_num;
        var productId=parameter.productId;

        var switchStatus=undefined;/*切换按钮的状态控制变量*/

        /*--------------订单详情接口 ajax  ------------*/

        ajaxJson({ type:'get',
            url:'order/query-order-detail',
            async:true,
            data:{},
            params:{
                order_num:order_num
            },
            success:function (result) {

                if(result.resultCode=='0'){
                    console.log(result);
                    /*html赋值*/
                    assignment(result.data);
                    /*付款倒计时*/
                    PaymentCountdown(result.data.startTime,result.data.timeNow);

                    /*物流公司、单号*/
                    // logisticsInfo (result.data);

                }else  if(result.resultCode=='10'){
                    alertBox('用户登录超时');
                }
                /*焦点框函数*/
                SwitchFocus();

            },
            error:function (status) {

                console.log(status);
            }
        });

        /*------取消订单接口-----------*/
        function cancelOrder() {

            ajaxJson({ type:'post',
                url:'order/cancel-order',
                async:true,
                data:{},
                params:{
                    order_num:order_num
                },
                success:function (result) {
                    console.log(result);
                    if(result.resultCode=='0'){
                        alertBox('取消成功了');
                        setTimeout(function () {
                            window.history.back();
                        },1000);

                    }else  if(result.resultCode=='10'){
                        alertBox('用户登录超时');
                    }
                },
                error:function (status) {
                    console.log(status);
                }
            });
        }

        /*------订单物流信息--------*/
        function queryOrderExpress() {
            ajaxJson({
                type: 'get',
                url: 'admin/order/query-order-express',
                async: true,
                data: {},
                params: {
                    order_num: order_num
                },
                success: function (result) {

                    if( result.resultCode=='0'){
                        console.log(result.data.expressHistory);

                        var data=result.data.expressDetailsArr;
                        orderExpressHtml (data);

                    }else if(result.resultCode=='10'){

                        alertBox('用户登录超时');
                    }

                },
                error: function (status) {
                    console.log(status);
                }
            });
        }

        function orderExpressHtml (data) {
            var ul=getId('expressUl');
            var  liHtml=null;
            ul.innerHTML=null;
            if(data.length>0){
                for(var i=0;i<data.length;i++){
                    liHtml=' <li><span></span><p><strong class="time">'+data[i].time+'</strong><strong class="adress">'+data[i].context+'</strong></p></li>';
                    ul.innerHTML+=liHtml
                }
            }else {
                liHtml='<li>暂无数据</li>';
                ul.innerHTML=liHtml
            }
            modal.style.display='block';
        }

        /*订单详情的html赋值*/
        function btnStatusChangge() {/*付款按钮显示隐藏*/
            var paymentBtnBox=getId('payment-btn-box');
            paymentBtnBox.style.display='inline-block';
            var payBtn=getId('payBtn');
            var cancelBtn=getId('cancelBtn');
            payBtn.className='menu-item';
            cancelBtn.className='menu-item';
        }


        function queryLogistics() {/*查询物流框的显示隐藏*/
            var queryLogisticsBox=getId('logistics-info');
            console.log(queryLogisticsBox);
            queryLogisticsBox.style.display='block';
            var queryDelivery=getId('queryDistBtn');
            queryDelivery.className='menu-item';
        }
        function assignment(data) {
            /*订单号*/

            var orderNumber = getId('order-number');
            orderNumber.innerHTML = data.orderNum;
            /*订单状态*/
            var orderStatus = getId('order-status');
            var status = undefined;

            if (data.orderStatus == '0') {
                btnStatusChangge();/*付款按钮显示隐藏*/
                status = '待付款';

            } else if (data.orderStatus == '1') {
                status = '已取消';
            } else if (data.orderStatus == '2') {
                status = '待商家发货'
            } else if (data.orderStatus == '3') {
                if(data.hasExpress){
                    switchStatus=1;
                    queryLogistics();/*查询物流*/
                }
                // switchStatus=1;
                // queryLogistics();/*查询物流*/
                status = '待收货';
            } else if (data.orderStatus == '4') {
                if(data.hasExpress){
                    switchStatus=1;
                    queryLogistics();/*查询物流*/
                }
                // switchStatus=1;
                // queryLogistics();/*查询物流*/
                status = '已完成'
            }
            orderStatus.innerHTML = status;
            /*订单总额*/
            var orderAmount = getId('order-amount');
            orderAmount.innerHTML = '￥'+data.orderRealPayAmount/100;
            /*下单时间*/
            var orderTimeDay = getId('order-time-day');
            orderTimeDay.innerHTML = data.createTime;

            /*--------------商品清单--------------*/
            /*商品图片url*/
          /*  var productImage = getId('productImage');
            productImage.src = data.orderProduct.productImage;*/
            /*商品名字*/
            var productName = getId('productName');
            productName.innerHTML = data.orderProduct.productName;
            /*商品单价*/
            var price = getId('price');
            price.innerHTML = data.orderProduct.price/100;
            /*商品数量*/
            var ProductNum = getId('ProductNum');
            ProductNum.innerHTML = data.orderProduct.quantity;
            /*商品折扣*/
            var discountName = getId('discountName');
            discountName.innerHTML = data.orderProduct.discountName;

            /*--------收货人信息------------*/

            /*收货人姓名*/
            var consigneeName = getId('consigneeName');
            consigneeName.innerHTML = data.orderConsignee.consigneeName;
            /*收货人地址*/
            var consigneeAddress = getId('consigneeAddress');
            consigneeAddress.innerHTML = data.orderConsignee.consigneeAddress;
            /*收货人手机号*/
            var consigneePhone = getId('consigneePhone');
            consigneePhone.innerHTML = data.orderConsignee.consigneePhone;

            /*---------------付款信息--------------*/
            /*商品金额*/
            var produceFee = getId('produceFee');
            // produceFee.innerHTML = data.orderAmount.produceFee;
            produceFee.innerHTML = data.orderAmount.produceFee==0?'￥'+data.orderAmount.produceFee:'￥'+data.orderAmount.produceFee/100;
            /*折扣*/
            var discountAmount = getId('discountAmount');
            // discountAmount.innerHTML = '-'+data.orderAmount.discountAmount;
            discountAmount.innerHTML = data.orderAmount.discountAmount==0?'￥'+data.orderAmount.discountAmount:'￥-'+data.orderAmount.discountAmount/100;
            /*运费*/
            var freit = getId('freit');
            // freit.innerHTML = data.orderAmount.freit;
            freit.innerHTML = data.orderAmount.freit==0?'￥'+data.orderAmount.freit:'￥'+data.orderAmount.freit/100;

            /*支付优惠*/
            var payAllowance = getId('payAllowance');
            payAllowance.innerHTML = data.orderAmount.payAllowance==0?'￥'+data.orderAmount.payAllowance:'￥-'+data.orderAmount.payAllowance/100;
            /*订单总额*/
            var realPayAmount = getId('realPayAmount');
            // realPayAmount.innerHTML = data.orderAmount.realPayAmount;
            realPayAmount.innerHTML =  data.orderAmount.realPayAmount==0?'￥'+data.orderAmount.realPayAmount:'￥'+data.orderAmount.realPayAmount/100;

            /*---------------物流信息--------------*/
            /*快递公司*/

            var expressCompany = getId('expressCompany');
            expressCompany.innerHTML = data.expressCompany;
            /*快递单号*/
            var ExpressNumber = getId('ExpressNumber');
            ExpressNumber.innerHTML = data.expressTrackingNum;
        }

        /*--------------------ajax结束---------------------------------------*/

        /*付款倒计时*/
        // PaymentCountdown();
        function PaymentCountdown(startTime,timeNow) {
            function refresh() {

                /*结束时间*/
                var endTime = startTime + 24*60*60*1000;

                var currentTime = parseInt((endTime- timeNow) / 1000);
                if (currentTime < 0) {
                    currentTime = 0;
                }
                /*时分秒*/
                var hour = parseInt((currentTime / 3600) % 24);
                var minute = parseInt((currentTime / 60) % 60);
                // var second = parseInt(currentTime  % 60);
                hour=hour<10?"0"+hour:hour;
                minute=minute<10?"0"+minute:minute ;

                var hourElement = getId('hour');
                var minuteElement = getId('minute');
                hourElement.innerHTML = hour+ '时';
                minuteElement.innerHTML = minute+ '分';
            }
            refresh();
            setInterval(refresh,1000)
        }

        /*遥控器切换焦点框*/
        var modal=getId('modal');/*物流弹出框*/
        function SwitchFocus() {
            var menuList = document.getElementsByClassName('menu-item');
            var menuLisLength = menuList.length - 1;
            var i = 0;
            console.log(menuList);
            initStyle();
            function initStyle() {//初始化样式
                for (var j = 0; j <= menuLisLength; j++) {
                    menuList[j].style.border = '3px solid transparent';
                    // menuList[j].style.borderRadius = '5px';
                }
            }

            menuList[0].style.border = '3px solid yellowgreen';
            // menuList[0].style.borderRadius = '5px';
            window.document.onkeypress=document.onirkeypress = function (event) {
                event = event ? event : window.event;
                var keyCode = event.which ? event.which : event.keyCode;

                if((keyCode<37||keyCode>40)&&keyCode!=13){
                    if (keyCode == 8 || keyCode == 24 || keyCode == 32){/*返回键*/

                        window.location.href='../user/user.html'
                    }
                    return;
                }
                initStyle();//初始化样式

                if(modal.style.display=='block'){/*物流弹出框*/
                    modal.style.display='none';
                    menuList[i].style.borderColor = 'yellowgreen';
                    return;
                }
                var alertBox=getId('alertModal');/*提示信息弹出框*/
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

                    menuList[i].style.borderColor = 'yellowgreen';
                    if(i=='0'){

                        // window.history.back();
                        window.location.href='../user/user.html'

                    }else if(i=='1'){
                        if(switchStatus){

                            queryOrderExpress();
                        }else {
                            var order_money=getId('realPayAmount').innerHTML;
                            window.location.href='./order_pay.html?productId='+productId+'&order_money='+order_money+'&order_num='+order_num;
                        }
                    }else if(i=='2'){
                        cancelOrder();//取消订单
                    }
                }
            };

            function right() {

                if (i >=menuLisLength) {
                    i = menuLisLength;
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
                }  else {
                    i--;
                    menuList[i].style.borderColor = ' yellowgreen';
                }
            }

            function down() {
                if (i >=menuLisLength) {
                    i = menuLisLength;
                    menuList[i].style.borderColor = 'yellowgreen';
                } else {
                    i++;
                    menuList[i].style.borderColor = 'yellowgreen';
                }
            }

            function up() {
                if (i == '0'||i == '1'||i == '2') {
                    i=0;
                    menuList[i].style.borderColor = 'yellowgreen';
                }
            }
        }
    })()


};