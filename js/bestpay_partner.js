/**
 * Created by admin on 2017/11/30.
 */

window.onload=function () {

    (function () {
        /*获取url携带的参数*/
        var parameter=urlData();
        var fromLaunch=parameter.fromLaunch;
        var currentPage=1;
        var totalPage=undefined;/*总页数*/
        getPartner();
        function getPartner() {/*获取合作商家*/
            ajaxJson({
                type: 'get',
                url: 'sellerYzf/list',
                async: true,
                data:{},
                params: {
                    page: currentPage,
                    pageSize:10
                },
                success: function (result) {
                    if(result.resultCode==0){
                        console.log(result);
                        totalPage=result.data.totalPage;
                        partnerHtml (result.data.pageData)
                    }else if(result.resultCode==10){
                            alertBox('用户登录超时')
                    }
                },
                error: function (status) {
                    window.location.href='../error.html';
                }
            });
        }
        function selectionTextNum(resultNum,maxLength) {/*判断字数的多少*/
            var result;
            if(resultNum.length<maxLength){
                result=resultNum
            }else {
                result=resultNum.substring(0,(maxLength-2)/2)+'...'+resultNum.substring(resultNum.length-(maxLength-2)/2,resultNum.length);
            }
            return  result;
        }

        function partnerHtml (data) {
                var  liList=getClass('liList');
                for (var y=0;y<10;y++){
                    liList[y].innerHTML='<img class="newplot" src="../../img/queSheng.png" alt="">'
                }
                for (var i=0;i<data.length;i++){
                    liList[i].innerHTML='<img class="showImg" src='+data[i].sellerImage+' alt="">'+
                        '<div class="textInfo"><!--文本介绍-->'+
                        '<p class="supName">'+
                        '<img src="../../img/bestpay-img/supermarket.png" alt="">'+
                        '<span class="name">'+selectionTextNum(data[i].sellerName,17)+'</span>'+
                        '</p>'+
                        '<p class="introduction">'+
                        '<span class="desInfo">'+selectionTextNum(data[i].businessScope,12)+'</span>'+
                        '<span class="time">'+data[i].businessTime+'</span>'+
                        '</p>'+
                        '<p class="supAddress">'+
                        '<span class="addressInfo">'+selectionTextNum(data[i].businessAddress,18)+'</span>'+
                        '<img src="../../img/bestpay-img/address.png" alt="">'+
                        '</p>'+
                        '</div>';
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
                var alertbox=getId('alertModal');/*隐藏弹出框*/
                if(alertbox.style.display=='block'){
                    alertbox.style.display='none';
                    menuList[i].style.borderColor = 'yellowgreen';
                    return;
                }
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
                    else if (i == '1') {/*上一页*/
                        currentPage--;
                        if(currentPage<=1){
                            currentPage=1;
                            alertBox('已到首页了');
                            return;
                        }
                        getPartner();
                    }else if(i == '2'){/*下一页*/
                        currentPage++;
                        if(currentPage>totalPage){
                            currentPage=totalPage;
                            alertBox('没有更多数据了');
                            return;
                        }
                        getPartner();
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
                if(i=='1'||i=='2'){
                    menuList[i].style.borderColor = 'yellowgreen';
                }else if(i=='0'){
                    i=2;
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
                } else if(i=='1'||i=='2'){
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
