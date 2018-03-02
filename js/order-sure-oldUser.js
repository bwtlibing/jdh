/**
 * Created by admin on 2017/9/22.
 */
window.onload=function () {

    (function () {

        /*获取url携带的参数*/
        var parameter=urlData();
        var productId=parameter.productId;
        var fromLaunch=parameter.fromLaunch;

        /*查询用户收货地址*/
         queryAddress ();
          function queryAddress () {
              ajaxJson({ type:'get',
                  url:'address/list',
                  async:true,
                  data:{},
                  params:{
                  },
                  success:function (result) {
                      if( result.resultCode=='0'){
                          addressHtml(result.data);

                      }else if(result.resultCode=='10'){
                          alertBox('用户登录超时1');
                      }
                      SwitchFocus();/*切换焦点框*/
                  },
                  error:function (status) {
                      console.log(status);
                  }
              });
          }

          /*收货人地址列表*/

        function addressHtml(data) {
            var addressList = getClass('addressList');
            var addressUl = getId('addressUl');
            var liHtml = undefined;
            addressUl.innerHTML = null;
            var defaultAddress = undefined;
            if (data) {
                if (data.length > 3) {
                    data.length = 3;
                }
                for (var i = 0; i < data.length; i++) {
                    defaultAddress = data[i].defaultAddress;
                    var tempStatus = undefined;
                    var address = data[i].consigneeAddress;
                    var tempAddress;
                    if (address.length >= 14) {
                        tempAddress = address.substring(0, 6) + '...' + address.substring(address.length - 6, address.length);
                    } else {
                        tempAddress = address
                    }
                    if (defaultAddress) {
                        tempStatus = 'inline-block';
                        datas.consigneeName = data[i].consigneeName;
                        datas.consigneeAddress = data[i].consigneeAddress;
                        datas.consigneePhone = data[i].consigneePhone;
                    } else {
                        tempStatus = 'none';
                    }
                    liHtml = '<li class="menu-item addressList" data-receive="1" > ' +
                        '<span class="tip-DuiGou house"><img src="../../img/order-img/company.png" alt=""> </span>' +
                        ' <span class="consigneeName">' + data[i].consigneeName + '</span>' +
                        ' <span class="consigneePhone">' + data[i].consigneePhone + '</span> ' +
                        ' <span class="consigneeAddress">' + tempAddress + ' </span>' +
                        ' <span> <img class="lighten-icon" style="display:' + tempStatus + '" src="../../img/order-img/redDuiHao.png" alt=""></span></li>';
                    addressUl.innerHTML += liHtml;

                }
            }
        }
        /*查询商品简介接口*/
        var proDiscount;/*商品折扣*/
        queryProductDes ();
        function queryProductDes () {
            ajaxJson({ type:'get',
                url:'product/brief-list',
                async:true,
                data:{},
                params:{
                    product_id:productId
                },
                success:function (result) {
                    console.log(result.data);
                    if( result.resultCode=='0'){
                        queryProductDesHtml(result.data[0]);
                        proDiscount=result.data[0].discount;
                        var number=getId('quantity').value;
                        countMoney(number,proDiscount);
                    }else if(result.resultCode=='10'){
                        // alertBox('用户登录超时2');
                    }
                },
                error:function (status) {
                    console.log(status);
                }
            });
        }
        /*商品简介赋值*/
         function queryProductDesHtml (data) {
             var price=Number(data.price).toFixed(2);
                textHtml('productName',data.productName);
                textHtml('price',price/100);
                var discountValue=undefined;
                if(!data.discount){
                    discountValue=0;
                    textHtml('discount','暂无优惠');
                }else {
                    textHtml('discount',data.discount.name);
                }
         }
         /*一些金额计算赋值*/
           function countMoney(currentNumber,discount) {

               var freight=getId('freight');/*运费*/
               var freightValue=0;
               var number=currentNumber;/*数量*/
               var price=Number(getId('price').innerHTML);/*单价*/
               var noDisCountAllMoney=Number(number)*Number(price);/*打折前的总钱数*/
               var orderMoney=0;/*大折后的总钱数*/
               var discountMoney=0;
               if(discount){/*打折存在*/
                   if(discount.discountType=='1'){
                       discountMoney=number*Number(1-discount.discountValue/100)*price;
                       orderMoney=noDisCountAllMoney*(Number(discount.discountValue/100))+freightValue;
                   }
                   else {
                       discountMoney=number*Number(discount.discountValue/100);
                       orderMoney=noDisCountAllMoney-discountMoney+freightValue;
                   }
               }else {
                   discountMoney=0;
                   orderMoney=number*price;
               }

               var tempDiscountMoney=discountMoney=='0'?'￥'+discountMoney.toFixed(2):'￥-'+discountMoney.toFixed(2);
               textHtml('totalMoney','￥'+orderMoney.toFixed(2));
               textHtml('totalVolume','￥'+noDisCountAllMoney.toFixed(2));/*未打折之前总钱数*/
               textHtml('discountMoney',tempDiscountMoney);/*打折钱数*/
               textHtml('freight','￥'+0);/*运费*/
               textHtml('orderMoney','￥'+orderMoney.toFixed(2));/*打折后订单总钱数*/
           }


         /*老用户生成订单二维码的接口*/
         createOrderQRcode();
         function createOrderQRcode() {
             var orderQRcode=getId('order-QRcode');
             ajaxJson({ type:'post',
                 url:'order/build-order-code-image',
                 async:true,
                 data:{},
                 params:{
                     product_id:productId
                 },
                 success:function (result) {
                     if( result.resultCode=='0'){
                         orderQRcode.src = subLink(result.data);
                     }else if(result.resultCode=='10'){
                         // alertBox('用户登录超时3');
                     }
                 },
                 error:function (status) {
                     console.log(status);
                 }
             });
         }


       /*查询是否需要跳转到订单详情页*/
        queryOrderStatus();
        function queryOrderStatus() {
            console.log('查询订单状态');
            setInterval(function () {
                ajaxJson({ type:'get',
                    url:'order/to-detail-page',
                    async:true,
                    data:'',
                    params:{
                        scope:3
                    },
                    success:function (result) {

                        var order_num=result.data.orderNum;

                        if(result.data.sign=='true'){

                            window.location.href='./order_detail.html?order_num='+order_num+'&orderPay=true';

                        }else {
                            console.log('不跳');
                        }
                    },
                    error:function (status) {
                        console.log(status);
                    }
                });
            },5000)
        }







      //提交订单接口
        var datas = {
            consigneeName: '',
            consigneeAddress: '',
            consigneePhone: '',
            remark: '',
            productId: parameter.productId,
            quantity: '1'
        };

        function submitOrder(data) {
            ajaxJson({
                type: 'post',
                url: 'order/add-order',
                async: true,
                data: JSON.stringify(data),
                param: {},
                success: function (result) {
                    console.log(result);
                    var order_num=result.data;
                    var orderMoney=getId('orderMoney').innerHTML;
                    if(result.resultCode=='4'){
                        alertBox('请选择收货地址');
                    }else if(result.resultCode=='0') {
                        window.location.href='./order_pay.html?productId='+parameter.productId+'&order_num='+order_num+'&order_money='+orderMoney;
                    }else if(result.resultCode=='10'){
                        alertBox('登录超时')
                    }
                },
                error: function (status) {
                    window.location.href='../error.html'
                }
            });
        }
        /*接口结束*/
        /*遥控器切换焦点框*/
        function SwitchFocus() {
            var menuList = document.getElementsByClassName('menu-item');
            /*收货地址列表*/
            var addressList =getClass('addressList');
            var menuLisLength = menuList.length - 1;
            var i = 0;
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
                initStyle();//初始化样式
                var alertBox = getId('alertModal');
                console.log(alertBox);
                /*隐藏弹出框*/
                if (alertBox.style.display == 'block') {
                    alertBox.style.display = 'none';
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
                        window.location.href='../user/user.html';

                    }else if(i==addressList.length-2){
                        chooseReceive(i);
                        /*获取选择的具体的收货人*/
                        getConsigneeInfo(i);
                    }else if(i==addressList.length-1){

                        chooseReceive(i);
                        /*获取选择的具体的收货人*/
                        getConsigneeInfo(i);
                    }else if(i==addressList.length){

                        chooseReceive(i);
                        /*获取选择的具体的收货人*/
                        getConsigneeInfo(i);
                    }
                    else if(i==menuList.length-3){


                        dedNum();/*减少商品数量*/
                    }else if(i==menuList.length-2){

                        addNum();/*增加商品数量*/

                    }else if(i==menuList.length-1){/*提交订单*/

                        submitOrder(datas);
                      // window.location.href='./order_detail.html'
                    }
                }
            };

            /*选择收货人信息*/
            function chooseReceive(index) {
                var ulParent = menuList[index].parentNode;
                var liSon = ulParent.getElementsByClassName('menu-item');
                for (var i = 0; i < liSon.length; i++) {
                    liSon[i].getElementsByClassName('lighten-icon')[0].style.display = 'none';
                }
                menuList[index].getElementsByClassName('lighten-icon')[0].style.display = 'inline-block';
            }

            /*获取选择的具体的收货人*/
            function getConsigneeInfo(index) {
                var currentLi=menuList[index];
                var consigneeName=currentLi.getElementsByClassName('consigneeName')[0].innerHTML;
                var consigneeAddress=currentLi.getElementsByClassName('consigneeAddress')[0].innerHTML;
                var consigneePhone=currentLi.getElementsByClassName('consigneePhone')[0].innerHTML;
                datas.consigneeName=consigneeName;
                datas.consigneeAddress=consigneeAddress;
                datas.consigneePhone=consigneePhone;

            }

            function addNum() {/*增加商品数量*/
                var numInput = document.getElementsByClassName('number')[0];
                var currentNum = numInput.value;
                currentNum++;
                numInput.value = currentNum;
                /*购买商品的数量*/
                datas.quantity=currentNum;
                countMoney(currentNum,proDiscount);
            }
            function dedNum() {/*减少商品数量*/
                var numInput = document.getElementsByClassName('number')[0];
                var currentNum = numInput.value;
                currentNum--;
                if(currentNum<1){
                    currentNum=1;
                }
                numInput.value = currentNum;
                /*购买商品的数量*/
                datas.quantity=currentNum;
                countMoney(currentNum,proDiscount);
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

                if (i >=menuLisLength) {
                    i = menuLisLength;
                    menuList[i].style.borderColor = 'yellowgreen';
                } else {
                    i++;
                    menuList[i].style.borderColor = 'yellowgreen';
                }
            }

            function up() {
                if (i <= 0) {
                    i = 0;
                    menuList[i].style.borderColor = 'yellowgreen';
                }  else {
                    i--;
                    menuList[i].style.borderColor = ' yellowgreen';
                }
            }
        }
    })()
};
