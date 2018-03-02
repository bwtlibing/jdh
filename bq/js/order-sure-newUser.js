/**
 * Created by admin on 2017/9/21.
 */
window.onload=function () {
    (function () {
        var parameter=urlData();
        var productId=parameter.productId;

        /*新用户订单确认二维码图片生成 ajax接口*/
        createOrderQRcode();
        function createOrderQRcode() {

            var orderQRcode=getId('newUser-QRcode');

            ajaxJson({ type:'post',
                url:'order/build-order-code-image',
                async:true,
                data:{},
                params:{
                    product_id:productId
                },
                success:function (result) {
                    if( result.resultCode=='0'){
                        orderQRcode.src=result.data;
                    }else if(result.resultCode=='10'){
                        alertBox('用户登录超时');
                    }else {
                        alertBox('请返回菜单页');
                    }
                },
                error:function (status) {
                    console.log(status);
                }
            });
        }
        /*遥控器返回焦点框*/
        SwitchFocus();
        function SwitchFocus() {
            var menuList = document.getElementsByClassName('menu-item');
            var i = 0;
            menuList[i].style.border = '3px solid yellowgreen';

            window.document.onkeypress=document.onirkeypress = function (event) {
                event = event ? event : window.event;
                var keyCode = event.which ? event.which : event.keyCode;
                if((keyCode<37||keyCode>40)&&keyCode!=13){
                    if (keyCode == 8 || keyCode == 24 || keyCode == 32){/*返回键*/
                        window.history.back();
                    }
                    return;
                }
                var alertBox=getId('alertModal');/*提示信息弹出框*/
                if(alertBox.style.display=='block'){
                    alertBox.style.display='none';
                    menuList[i].style.borderColor = 'yellowgreen';
                    return;
                }

                if (keyCode == 13) {//ok键
                    menuList[i].style.borderColor = 'yellowgreen';
                    if (i=='0'){
                        window.location.href='../user/user.html'
                    }
                }
            };
        }
    })()
};