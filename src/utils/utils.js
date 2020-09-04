import {hex_md5} from '@/utils/md5';

export function ResizePhotoImg(event) {
    var obj = event.target
    var src = obj.src,datasrc = obj.getAttribute('data-src')
    if(datasrc&& datasrc != src){
        return ;
    }
    var m_W = window.getComputedStyle(obj.parentNode,null).getPropertyValue("width").replace("px","");
    var m_H = window.getComputedStyle(obj.parentNode,null).getPropertyValue("height").replace("px","");
    var ratio = m_W/m_H;
    var i_W = obj.width;
    var i_H = obj.height;
    var pos_W
    if(i_W>i_H*ratio){
        pos_W=((m_H/i_H)*i_W-m_W)/2
        obj.style.height = m_H + "px";
        obj.style.left = -pos_W + "px";	
    }else{
        pos_W=((m_W/i_W)*i_H-m_H)/2
        obj.style.width = m_W + "px";
        obj.style.top = -pos_W + "px";
    }
    return obj;
}

export function urlFun(_param){
    var _time = (new Date().getTime() / 1000).toString();
    var _noce = noce();
    var _appJson={
        "app":"Hzty001",                    //来源
        "filename":_param,                 //文件名称
        "ver":"1.0.0",                      //版本
        "noce":_noce,                       //随机数
        "unix":_time,                       //unix到秒
        "type":"face",                      //其他可能的数据
    }
    return sortMap(_appJson);
}

export function randomNum(){
    return parseInt(Math.random()*10);
}

function md5(appid,cmd,unixTime,noce,key,sessionId){
    return hex_md5("Company=hzty&Ver=1.0.0&Methord=MD5&AppID=" + appid + "&Cmd=" + cmd + "&UnixTime=" + unixTime + "&Noce=" + noce + "&AppKey=" + key + "&SessionId=" + sessionId);
}

function trim() {
    this.replace(/(^\s*)|(\s*$)/g, "");
}

function createParam(k, v) {
    return Object.create({ key: k, value: v });
}
function getMapValue(map, k) {

    for (var i = 0; i < map.length; i++) {
        var o = map[i];
        if (o.key == k) {
            return o.value;
        }
    }
    return null;
}

function sortMap(lst) {

    var kvMap = [];
    kvMap.push(createParam("tversion", "V1.0.0"));
    kvMap.push(createParam("tsource", "hangzhou"));
    kvMap.push(createParam("tsessionId", "FA568027-CE41-4D27-825E-02939FB3F572"));

    for (var i = 0; i < lst.length; i++) {
        var o = lst[i];

        if (o == undefined || o == null) {
            continue;
        }
        if (o.key == undefined) {
            continue;
        }
        if (o.value == undefined || o.value == null || o.value.trim() == "") {
            continue;
        }
        kvMap.push(o);
    }
    var keyArray = [];
    for (var i = 0; i < kvMap.length; i++) {
        keyArray.push(kvMap[i].key);
    }
    keyArray.sort();

    var strArray = [];

    for (var i = 0; i < keyArray.length; i++) {
        var v = getMapValue(kvMap, keyArray[i]);
        if (v == undefined || v == null) {
            continue;
        }
        strArray.push(keyArray[i] + "=" + v);
    }
    var src = strArray.join("&");

    return md5(src)
}

function noce() {
    return parseInt(Math.random() * 100);
}




