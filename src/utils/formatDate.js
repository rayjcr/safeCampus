export default (time, fmt) => {
    fmt = fmt || 'yyyy-MM-dd hh:mm';
    let date = new Date(parseInt(time));
    let o = {
        'y+': date.getFullYear(),
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    }
    for(let k in o){
        if(new RegExp(`(${k})`).test(fmt)){
            let str = o[k] + '';
            str = str.length > 1 ? str : 0 + str;
            fmt = fmt.replace(RegExp.$1, str);
        }
    }

    return fmt;
}
