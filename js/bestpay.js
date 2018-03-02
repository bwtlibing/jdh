/**
 * Created by admin on 2017/11/30.
 */

window.onload=function () {

    (function () {
        /*获取url携带的参数*/
        var parameter=urlData();
        console.log(parameter);
        var fromLaunch=parameter.fromLaunch;

        /*遥控器返回焦点框*/
        SwitchFocus();
        function SwitchFocus() {
            var menuList = document.getElementsByClassName('menu-item');
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
                if (keyCode == 39) {//右
                    right();
                }
                if (keyCode == 37) {//左
                    left();
                }
                if (keyCode == 38) {//上
                    up();
                }
                if (keyCode == 40) {//下
                    down();
                }
                if (keyCode == 13) {//ok键

                    menuList[i].style.borderColor = 'yellowgreen';

                    if (i=='0') {/*用户中心页面*/
                        window.location.href = '../user/user.html'
                    }
                    else if (i == '1') {/*合作商家页面*/
                        window.location.href = './bestpay_partner.html'
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
                if(i=='1'){
                    menuList[i].style.borderColor = 'yellowgreen';
                }else if(i=='0'){
                    i=1;
                    menuList[i].style.borderColor = 'yellowgreen';
                }
            }
            function up() {
                if (i <= 0) {
                    i = 0;
                    menuList[i].style.borderColor = 'yellowgreen';
                } else if(i=='1'){
                    i=0;
                    menuList[i].style.borderColor = 'yellowgreen';
                }
            }
        }
    })()
};
