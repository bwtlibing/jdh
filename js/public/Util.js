/**
 * Created by admin on 2017/9/19.
 */
(function () {


    /**
     * 以className获取元素
     * @param className
     * @returns {NodeList}
     */
    function getClass(className) {
        var element=document.getElementsByClassName(className);
        return element;
    }
    window.getClass=getClass;
    /**
     * 以id获取元素
     * @param id
     * @returns {Element}
     */

    function getId(id) {
        var element=document.getElementById(id);
        return element;
    }
    window.getId=getId;

    /**
     * 原生ajax封装
     * @param obj
     *
     *
     */
   /* var obj={
        type:'get',
        url:'',
        async:true,
        data:{},
        params:{},
        success:function (result) {
            console.log(result);
        },
        error:function (status) {
            console.log(status);
        }
    };*/
    /*参数转换格式*/
    function toData(data){
        if (data == null){
            return data;
        }
        var arr = [];
        for (var i in data){
            var str = i+"="+data[i];
            arr.push(str);
        }
        return arr.join("&");
    }
    function ajaxJson(obj){
        //指定提交方式的默认值
        obj.type = obj.type || "get";
        //设置是否异步，默认为true(异步)
        obj.async = obj.async || true;
        //设置数据的默认值
        obj.data = obj.data || null;
        if (window.XMLHttpRequest){
            //非ie
            var ajax = new XMLHttpRequest();
        }else{
            //ie
            var ajax = new ActiveXObject("Microsoft.XMLHTTP");
        }

        var joint;
        if(obj.params){
            joint="?" + toData(obj.params);
        } else {
            joint='';
        }
        // var url = obj.url + "?" + toData(obj.params);

        //var protocolPort='http://166.111.130.11:9011/IPTVEMall/';
        var protocolPort='/IPTVEMall/';


        var url = protocolPort+obj.url + joint;

        //区分get和post
        if (obj.type == "post"){
            ajax.open("post",url,obj.async);
            ajax.setRequestHeader("Content-Type", "application/json");
            ajax.send(obj.data);
        }else{
            ajax.open("get",url,obj.async);
            ajax.send();
        }

        ajax.onreadystatechange = function (){
            if (ajax.readyState == 4){
                if (ajax.status == 200){
                    if (obj.success){
                        obj.success(JSON.parse(ajax.responseText));
                    }
                }else{
                    if (obj.error){
                        obj.error(ajax.status);
                    }
                }
            }
        }
    }
    /**
     * url带参数的转换
     * @returns {{}}
     */

   function urlData() {
       var objResult={};/*上传的参数对象*/
       var data=decodeURI(window.location.search).slice(1);

       var arrData=data.split("&");
       for(var i=0;i<arrData.length;i++){
           var temp=arrData[i].split("=");
           if(temp[0]){
               objResult[temp[0]]=temp[1];
           }
       }
       return objResult;
   }

    window.getClass=getClass;
    window.getId=getId;
    window.ajaxJson=ajaxJson;
    window.urlData=urlData;


    function textHtml (idName,data) {
        /*商品名称*/
        var element = getId(idName);
        element.innerHTML = data;
    }

    window.textHtml=textHtml;
    function alertBox(info) {
        var alertBox=getId('alertModal');
        var detailInfo=getClass('detailInfo')[0];
        alertBox.style.display='block';
        detailInfo.innerHTML=info;
    }
    window.alertBox=alertBox;
function disAlert() {
    var alertBox=getId('alertModal');
    if(alertBox.style.display=='block'){
        alertBox.style.display='none';
        return;
    }
}
    window.disAlert=disAlert;
    /*获取cook*/
    function GetCookie() {
        var objResult={};
        var aCookie = document.cookie.split("; ");
        console.log(aCookie);
        for (var i=0; i < aCookie.length; i++) {
            var temp = aCookie[i].split("=");
            if(temp[0]){
                objResult[temp[0]]=temp[1];
            }
        }
        return objResult;
    }
    //var cook=  GetCookie();
    window.GetCookie=GetCookie;
    //console.log(cook);

    /**
     * 获取xml的标签的数值；
     * @param data
     * @param startame
     * @param endName
     * @returns {string}
     */
    function getVal(data,startame,endName){
        //var start= epg.indexOf('<page_url>');
        //var length='<page_url>'.length;
        //var end= data.lastIndexOf('</page_url>');
        if(data){
            var start= data.indexOf(startame);
            var length=startame.length;
            var end= data.lastIndexOf(endName);
            var result=data.substring(start+length,end);
            return result;
        }
    }
    window.getVal=getVal;
    /**
     * 设置属性
     * @param element
     * @param key
     * @param value
     */
    function setAttrs(element,key,value) {
        element.setAttribute(key,value); // 设置
    }
    window.setAttrs=setAttrs;
    /**
     * 获取属性值
     * @param element
     * @param key
     * @returns {string}
     */
    function getAttrs(element,key) {
        return  element.attributes[key].value
    }
    window.getAttrs=getAttrs;

    function isFromLaunch() {
        var objResult={};/*上传的参数对象*/
        var url=window.location.href;
        var index= url.indexOf('fromLaunch');
        if(index>=0){
            var arrData=url.slice(index).split('=');
            objResult[arrData[0]]=arrData[1];
        }
        if(objResult.fromLaunch=='true'){
            console.log('fromLaunch为真的');
            return "true"
        }
    }
    // window.isFromLaunch=isFromLaunch;

    function subLink (value) {
        var result='';
        var start='http://sx.iptv.bwton.com'.length;
        result=value.substr(start);
        console.log(result);
        return result
    }
    window.subLink=subLink;

})();