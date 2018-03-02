/**
 * Created by admin on 2017/12/8.
 */
var cook=GetCookie();
function isEmptyObject(obj) {
    for(var key in obj ){
        return false
    }
    return true
}
if(!isEmptyObject(cook)){
    console.log("cook是非空的");
    var epg_info = cook.epg_info;
    var platform = getVal(epg_info, '<partner>', '</partner>');  /*播放平台华为或者中兴*/
    // var playStat = 1; // 播放状态 0:暂停 1:播放 2:停止
    if (platform.indexOf("HW") > -1 || platform.indexOf("HUAWEI") > -1) {
        platform = "HUAWEI";
    } else if (platform.indexOf("ZTE") > -1) {
        platform = 'ZTE';
    }
}else {
    console.log("cook是空的")
}

function VideoPlay(id, width, height, left, top,videoCode,parentId) {  /*创建视频播放对象*/
    this.playStat=1;
    this.id = id;
    this.width = width;
    this.height =height;
    this.left=left;
    this.top=top;
    this.element={};
    this.videoCode=videoCode;
    this.createEle(parentId);
}

VideoPlay.prototype = {
    createEle:function (parentId) {
        var parentEle=getId(parentId);
        this.element=document.createElement('iframe');/*创建子元素iframe*/
        this.element.width=this.width;
        this.element.height=this.height;
        this.element.frameBorder='0';
        this.element.style.position='absolute';
        this.element.id=this.id;
        this.element.src=getVal(epg_info,'<page_url>', '</page_url>') + "?vas_info=<vas_action>play_trailer</vas_action><mediacode>" + this.videoCode + "</mediacode><mediatype>VOD</mediatype><width>" + this.width + "</width><height>" + this.height + "</height><left>" + this.left + "</left><top>" + this.top + "</top>";
        parentEle.appendChild(this.element);/*往父元素添加子元素*/
    },
    pause:function () {/*暂停键*/
        console.log('pause暂停函数');
        if (this.playStat == 1) {
            if (platform == "HUAWEI") {
                if ( this.element.contentWindow.mp) {
                    this.element.contentWindow.mp.pause();
                }
            } else if (platform == "ZTE") {
                if ( this.element.contentWindow.top && this.element.contentWindow.top.mp) {
                    this.element.contentWindow.top.mp.pause();
                }
            }
            this.playStat = 0;
        }
    },
    resume:function () {/*续播键*/
        console.log('resume续播函数');
        if (this.playStat == 0) {
            if (platform == "HUAWEI") {
                if ( this.element.contentWindow.mp) {
                    this.element.contentWindow.mp.resume();
                }
            } else if (platform == "ZTE") {
                if ( this.element.contentWindow.top &&  this.element.contentWindow.top.mp) {
                    this.element.contentWindow.top.mp.resume();
                }
            }
            this.playStat = 1;
        }
    },
    pauseOrPlay:function () {/*暂停或者续播*/
        console.log('pauseOrPlay暂停或者续播的函数');
        if (this.playStat == 0) {
            this.resume();
        } else if (this.playStat == 1) {
            this.pause();
        }
    },
    /*------------------------------*/
    stop:function () {/*隐藏并暂停视频*/
        console.log('stop暂停并隐藏视频');
        if (platform == "HUAWEI") {
            if ( this.element.contentWindow.mp) {
                this.element.contentWindow.mp.stop();
                this.playStat = 2;
            }
        } else if (platform == "ZTE") {
            if ( this.element.contentWindow.top &&  this.element.contentWindow.top.mp) {
                this.element.contentWindow.top.mp.stop();
                this.playStat = 2;
            }
        }
    },
    replay:function () {/*显示并重播视频*/
        console.log("显示并重播视频");
        if (platform == "HUAWEI") {
            if ( this.element.contentWindow.play) {
                this.element.contentWindow.play();
                this.playStat = 1;
            }
        } else if (platform == "ZTE") {
            if ( this.element.contentWindow.top &&  this.element.contentWindow.top.mp) {
                this.element.contentWindow.top.mp.playFromStart();
                this.element.contentWindow.top.mp.setVideoDisplayMode(0);
                this.element.contentWindow.top.mp.refreshVideoDisplay();
                this.playStat = 1;
            }
        }
    },
    adjustVolume:function (flag) {/*调整音量*/
        console.log('调整音量');
        if ( this.element.contentWindow.adjustVolumeByEPG) {
            this.element.contentWindow.adjustVolumeByEPG(flag);
        }
    },
    muteVolume:function () {/*静音*/
        console.log('静音函数');
        if ( this.element.contentWindow.muteByEPG) {
            this.element.contentWindow.muteByEPG();
        }
    },
    playKeyPress:function (keyEvent) {/*音量的增加和减少*/
        console.log('音量的增加和减少函数');
        if (keyEvent.keyCode == 0x0103) {
            // 增加音量
            this.adjustVolume('+');
        } else if (keyEvent.keyCode == 0x0104) {
            // 减少音量
            this.adjustVolume('-');
        } else if (keyEvent.keyCode == 0x0105) {
            // 静音
            this.muteVolume();
        } else if (keyEvent.keyCode == 0x0107 || keyEvent.keyCode == 51) {
            // 暂停或播放
            this.pauseOrPlay();
        } else if (keyEvent.keyCode == 0x010E) {
            // 暂停
            this.pause();
        }
    }
};

// var video1=new VideoPlay('one',300,300,100,100,'source/video.mp4','videoBox');








