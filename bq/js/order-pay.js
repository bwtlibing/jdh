/**
 * Created by admin on 2017/9/21.
 */
window.onload=function () {

    (function () {

        /*获取url携带的参数*/
        var parameter=urlData();
        console.log(parameter);

        var productId=parameter.productId;
        var order_num=parameter.order_num;
        var order_money=parameter.order_money;

        var orderMoney=getId('order-amount');
        orderMoney.innerHTML=order_money;
        /*查询订单支付时不同支付方式的优惠数据接口*/

        ajaxJson({ type:'get',
            url:'order/query-pay-allowance',
            async:true,
            data:{},
            params:{
                order_num:order_num
            },
            success:function (result) {

                if( result.resultCode=='0'){
                    console.log(result);
                    discounts(result.data)
                }else if(result.resultCode=='10'){
                    alertBox('用户登录超时');
                }
            },
            error:function (status) {
                console.log(status);
            }
        });
        /*优惠活动*/
        function discounts(data) {
            var weiXin=getId('weiXin');
            var yiZhifu=getId('yizhifu');
            var zhiFuBao=getId('zhiFuBao');
            /*翼支付*/
            if(data.bestAllowance>0){
                textHtml('bestAllowance',Number(data.bestAllowance)/100);
                yiZhifu.style.display='block'
            }else {
                yiZhifu.style.display='none'
            }
            /*微信支付*/
            if(data.weixinAllowance>0){
                textHtml('weixinAllowance',Number(data.weixinAllowance)/100);
                weiXin.style.display='block'
            }else {
                weiXin.style.display='none'
            }
            /*支付宝支付*/
            if(data.zhifubaoAllowance>0){
                textHtml('zhifubaoAllowance',Number(data.zhifubaoAllowance)/100);
                zhiFuBao.style.display='block'
            }else {
                zhiFuBao.style.display='none'
            }
        }

        /*支付方式二维码 支付宝和微信*/
        function payment(payType) {
            // var orderNum='20171011142159000004';
            ajaxJson({ type:'post',
                url:'pay/create-pay-code-image',
                async:true,
                data:'',
                params:{
                    order_num:order_num,
                    pay_type:payType
                },
                success:function (result) {
                    console.log(result);

                    if( result.resultCode=='0'){
                        if(payType=='1'){
                            changePayment('支付宝',result.data)
                        }else if(payType=='0'){
                            changePayment('微信',result.data)
                        }
                    }else if(result.resultCode=='10'){
                        alertBox('用户登录超时');
                    }
                },
                error:function (status) {
                    console.log(status);
                }
            });
        }
        /*改变支付方式*/
        function changePayment(pName,src) {
            var payName=getClass('pay-name')[0];
            var QRcodeImg=getId('QRcode-img');

            QRcodeImg.src=src;
            payName.innerHTML=pName;
        }
        /*查询订单是否付款的状态*/
        queryOrderStatus();
        function queryOrderStatus() {
            setInterval(function () {
                ajaxJson({ type:'get',
                    url:'order/query-order-status-by-ordernum',
                    async:true,
                    data:'',
                    params:{
                        order_num:order_num
                    },
                    success:function (result) {
                        console.log(result);

                        if( result.resultCode=='0'){
                            if(result.data==2){
                                window.location.href='./order_detail.html?order_num='+order_num;
                            }
                        }else if(result.resultCode=='10'){
                            alertBox('用户登录超时');
                        }

                    },
                    error:function (status) {
                        console.log(status);
                    }
                });
            },2000)
        }

        /*----------------------接口结束----------------------------*/

        /*遥控器返回焦点框*/
        SwitchFocus();
        function SwitchFocus() {
            var menuList = document.getElementsByClassName('menu-item');
            var menuLisLength = menuList.length - 1;
            var i = 0;
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
                        window.history.go(-1);
                    }
                    return;
                }
                var alertBox=getId('alertModal');/*提示信息弹出框*/
                if(alertBox.style.display=='block'){
                    alertBox.style.display='none';
                    menuList[i].style.borderColor = 'yellowgreen';
                    return;
                }
                initStyle();//初始化样式
                if (keyCode == 39) {//右
                    right();
                    changePays(i);
                }
                if (keyCode == 37) {//左
                    left();
                    changePays(i);
                }
                if (keyCode == 38) {//上
                    up();
                    changePays(i);
                }
                if (keyCode == 40) {//下
                    down();
                    changePays(i);
                }
                if (keyCode == 13) {//ok键
                    menuList[i].style.borderColor = 'yellowgreen';
                    if (i=='0'){
                        window.location.href='../user/user.html'
                    }else if(i=='1'){
                        console.log('翼支付')
                        // changePayment('翼支付','../../img/order-img/QRcode.png');
                        // payment()

                    }else if(i=='2'){
                        console.log('微信');
                        payment('0');

                        // changePayment('微信支付','../../img/order-img/QRcode1.png');
                        // payment()
                    }else if(i=='3'){
                        console.log('支付宝');
                        payment(1);
                        // changePayment('支付宝','../../img/order-img/redDuiHao.png')
                    }
                }
            };


            function changePays(index) {
                if(index=='1'){
                    console.log('翼支付')

                    // payment()

                }else if(index=='2'){
                    console.log('微信');
                    payment('0');
                }else if(index=='3'){
                    console.log('支付宝');
                    payment(1);
                }
            }




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
                right();
            }

            function up() {
                left();
            }


        }
    })()
};