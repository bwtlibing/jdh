/**
 * Created by 18317 on 2017/10/24.
 */


var cook = GetCookie();
var epg_info = cook.epg_info;
var platform = getVal(epg_info, '<partner>', '</partner>');  /*播放平台华为或者中兴*/
var playStat = 1; // 播放状态 0:暂停 1:播放 2:停止

if (platform.indexOf("HW") > -1 || platform.indexOf("HUAWEI") > -1) {
    platform = "HUAWEI";
} else if (platform.indexOf("ZTE") > -1) {
    platform = 'ZTE';
}
var playIframe = getId('plyIfr');

function playPrepare(videoCode, playWidth, playHeight, playLeft, playTop) {
    playIframe.src = getVal(epg_info, '<page_url>', '</page_url>') + "?vas_info=<vas_action>play_trailer</vas_action><mediacode>" + videoCode + "</mediacode><mediatype>VOD</mediatype><width>" + playWidth + "</width><height>" + playHeight + "</height><left>" + playLeft + "</left><top>" + playTop + "</top>";
}

function playKeyPress(keyEvent) {
    if (keyEvent.keyCode == 0x0103) {
        // 增加音量
        adjustVolume('+');
    } else if (keyEvent.keyCode == 0x0104) {
        // 减少音量
        adjustVolume('-');
    } else if (keyEvent.keyCode == 0x0105) {
        // 静音
        muteVolume();
    } else if (keyEvent.keyCode == 0x0107 || keyEvent.keyCode == 51) {
        // 暂停或播放
        pauseOrPlay();
    } else if (keyEvent.keyCode == 0x010E) {
        // 暂停
        pause();
    }
}

// 暂停或播放
function pauseOrPlay() {
    if (playStat == 0) {
        resume();
    } else if (playStat == 1) {
        pause();
    }
}

// 暂停
function pause() {
    if (playStat == 1) {
        if (platform == "HUAWEI") {
            if (playIframe.contentWindow.mp) {
                playIframe.contentWindow.mp.pause();
            }
        } else if (platform == "ZTE") {
            if (playIframe.contentWindow.top && playIframe.contentWindow.top.mp) {
                playIframe.contentWindow.top.mp.pause();
            }
        }
        playStat = 0;
    }
}

// 继续播放
function resume() {
    if (playStat == 0) {
        if (platform == "HUAWEI") {
            if (playIframe.contentWindow.mp) {
                playIframe.contentWindow.mp.resume();
            }
        } else if (platform == "ZTE") {
            if (playIframe.contentWindow.top && playIframe.contentWindow.top.mp) {
                playIframe.contentWindow.top.mp.resume();
            }
        }
        playStat = 1;
    }
}


// 停止并隐藏视频
function stop() {
    if (platform == "HUAWEI") {
        if (playIframe.contentWindow.mp) {
            playIframe.contentWindow.mp.stop();
            playStat = 2;
        }
    } else if (platform == "ZTE") {
        if (playIframe.contentWindow.top && playIframe.contentWindow.top.mp) {
            playIframe.contentWindow.top.mp.stop();
            playStat = 2;
        }
    }
}

// 显示并重播视频
function replay() {
    if (platform == "HUAWEI") {
        if (playIframe.contentWindow.play) {
            playIframe.contentWindow.play();
            playStat = 1;
        }
    } else if (platform == "ZTE") {
        if (playIframe.contentWindow.top && playIframe.contentWindow.top.mp) {
            playIframe.contentWindow.top.mp.playFromStart();
            playIframe.contentWindow.top.mp.setVideoDisplayMode(0);
            playIframe.contentWindow.top.mp.refreshVideoDisplay();
            playStat = 1;
        }
    }
}

// 调整音量
function adjustVolume(flag) {
    if (playIframe.contentWindow.adjustVolumeByEPG) {
        playIframe.contentWindow.adjustVolumeByEPG(flag);
    }
}

// 静音
function muteVolume() {
    if (playIframe.contentWindow.muteByEPG) {
        playIframe.contentWindow.muteByEPG();
    }
}