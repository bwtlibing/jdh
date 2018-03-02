/**
 * Created by admin on 2017/11/27.
 */
window.onload=function () {
    (function () {
        /*获取url携带的参数*/
        var parameter=urlData();
        var id=parameter.ecological_hall_id;
        var position=parameter.position;
        var fromLaunch=parameter.fromLaunch;
         /*获取生态馆详细介绍*/
        biodomeDetailIntroduce();
        function biodomeDetailIntroduce () {
            ajaxJson({ type:'get',
                url:'ecologicalHall/get-ecological-culture-detail',
                async:true,
                data:{},
                params:{
                    ecological_hall_id:id,
                    position:position
                },
                success:function (result) {
                    if(result.resultCode=='0'){
                        detailHtml(result.data);
                    }
                },
                error:function (status) {
                    window.location.href='./views/error.html';
                }
            });
        }
        function detailHtml(data) {
            textHtml('detailIntro',data.introduce);

            var bigImg=getId('bigImg');
            bigImg.src=subLink(data.introduceImages[0]);

            var smallImg=getClass('smallImg');
            for(var i=0;i<data.introduceImages.length;i++){
                smallImg[i].src=subLink(data.introduceImages[i]);
            }
        }
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
                    imageSwitcher();
                }
                if (keyCode == 37) {//左
                    left();
                    imageSwitcher();
                }
                if (keyCode == 38) {//上
                    up();
                    imageSwitcher();
                }
                if (keyCode == 40) {//下
                    down();
                    imageSwitcher();
                }
                if(keyCode==13){
                    if (i == '0') {
                        window.location.href = '../user/user.html';
                    }
                }
            };
            function imageSwitcher() {/*切换图片*/
                if(i>=2){
                    var bigImg = getId('bigImg');
                    bigImg.src =  menuList[i].src;
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
                if (i >=menuLisLength) {
                    i = menuLisLength;
                    menuList[i].style.borderColor = 'yellowgreen';
                }else if(i=='1'||i=='2'||i=='3'||i=='4'||i=='5'){
                    menuList[i].style.borderColor = 'yellowgreen';
                }else {
                    i++;
                    menuList[i].style.borderColor = 'yellowgreen';
                }
            }
            function up() {
                if (i <= 0) {
                    i = 0;
                    menuList[i].style.borderColor = 'yellowgreen';
                } else if(i=='1'||i=='2'||i=='3'||i=='4'||i=='5'){
                    i=0;
                    menuList[i].style.borderColor = 'yellowgreen';
                } else {
                    i--;
                    menuList[i].style.borderColor = ' yellowgreen';
                }
            }
        }
    })()
};












