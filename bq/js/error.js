/**
 * Created by admin on 2017/10/12.
 */
window.onload=function () {

    (function () {


        /*遥控器返回焦点框*/
        SwitchFocus();
        function SwitchFocus() {
            var menuList = document.getElementsByClassName('menu-item');
            var i = 0;
            menuList[i].style.border = '3px solid #FF8331';
            menuList[i].style.borderRadius = '5px';
            window.document.onkeypress=document.onirkeypress  = function (event) {
                event = event ? event : window.event;
                var keyCode = event.which ? event.which : event.keyCode;

                if ((keyCode < 37 || keyCode > 40) && keyCode != 13) {
                    if (keyCode == 8 || keyCode == 24 || keyCode == 32||keyCode==48) {/*返回键*/
                        window.history.go(-2);
                    }
                    return;
                }

                if (keyCode == 13) {//ok键
                    menuList[i].style.borderColor = 'yellowgreen';
                    if (i == '0') {
                        window.history.go(-2);
                    }
                }
            };
        }
    })()
};