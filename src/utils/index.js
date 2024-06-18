import axios from "axios";
import bigNumber from "bignumber.js";

export function openUrl(url) {
  if (typeof window !== "object") return;
  const tempWin = window.open("_blank");
  if (tempWin) {
    tempWin.opener = null;
    tempWin.location.href = url;
  }
}

/**
* @description: 字符串加密
* @param {*}
* @return {*}
*/
export function encodeStr(str) {
  if (typeof window !== "object") return str;
  return window.btoa(window.encodeURIComponent(str));
}

/**
* @description: 字符串解密
* @param {*}
* @return {*}
*/
export function decodeStr(str) {
  if (typeof window !== "object") return str;
  return window.decodeURIComponent(window.atob(str));
}

/**
* @description:  local store set
* @param {string} key
* @param {string} value
* @return {*}
*/
export function setLocalStore(key, value) {
  localStorage.setItem(key, value);
}

/**
* @description:  local store get
* @param {string} key
* @param {string} value
* @return {*}
*/
export function getLocalStore(key) {
  return localStorage.getItem(key) || "";
}

/**
 * @description:  local store set
 * @param {string} key
 * @param {string} value
 * @return {*}
 */
export function setSessionStore(key, value) {
  sessionStorage.setItem(key, value);
}

/**
* @description:  local store get
* @param {string} key
* @param {string} value
* @return {*}
*/
export function getSessionStore(key) {
  return sessionStorage.getItem(key) || "";
}

/**
 * @description: 导出
 * @param {string} val: 数值
 */
export const exportExcel = (url, params, fileName) => {
  axios
    .get(url, {
      params: params,
      headers: { certificate: sessionStorage.getItem("token") },
      responseType: "blob",
    })
    .then((res) => {
      download(res.data, fileName);
    })
    .catch(function (error) {
      console.log(error);
    });
};

function download(data, fileName) {
  if (!data) {
    return;
  }
  let url = window.URL.createObjectURL(new Blob([data]));
  let link = document.createElement("a");
  link.style.display = "none";
  link.href = url;
  link.setAttribute("download", fileName + ".xlsx");

  document.body.appendChild(link);
  link.click();
};

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null;
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
  let date;
  if (typeof time === 'object') {
    date = time;
  } else {
    if (typeof time === 'string') {
      if (/^[0-9]+$/.test(time)) {
        // support "1548221490638"
        time = parseInt(time);
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/');
      }
    }

    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  };
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value];
    }
    return value.toString().padStart(2, '0');
  });
  return time_str;
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000;
  } else {
    time = +time;
  }
  const d = new Date(time);
  const now = Date.now();

  const diff = (now - d) / 1000;

  if (diff < 30) {
    return '刚刚';
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前';
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前';
  } else if (diff < 3600 * 24 * 2) {
    return '1天前';
  }
  if (option) {
    return parseTime(time, option);
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    );
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url;
  const search = url.substring(url.lastIndexOf('?') + 1);
  const obj = {};
  const reg = /([^?&=]+)=([^?&=]*)/g;
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1);
    let val = decodeURIComponent($2);
    val = String(val);
    obj[name] = val;
    return rs;
  });
  return obj;
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength(str) {
  // returns the byte length of an utf8 string
  let s = str.length;
  for (var i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i);
    if (code > 0x7f && code <= 0x7ff) s++;
    else if (code > 0x7ff && code <= 0xffff) s += 2;
    if (code >= 0xdc00 && code <= 0xdfff) i--;
  }
  return s;
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
  const newArray = [];
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
}

/**
 * @param {Object} json
 * @returns {Array}
 */
export function param(json) {
  if (!json) return '';
  return cleanArray(
    Object.keys(json).map((key) => {
      if (json[key] === undefined) return '';
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
    })
  ).join('&');
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ');
  if (!search) {
    return {};
  }
  const obj = {};
  const searchArr = search.split('&');
  searchArr.forEach((v) => {
    const index = v.indexOf('=');
    if (index !== -1) {
      const name = v.substring(0, index);
      const val = v.substring(index + 1, v.length);
      obj[name] = val;
    }
  });
  return obj;
}

/**
 * @param {string} val
 * @returns {string}
 */
export function html2Text(val) {
  const div = document.createElement('div');
  div.innerHTML = val;
  return div.textContent || div.innerText;
}

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source) {
  if (typeof target !== 'object') {
    target = {};
  }
  if (Array.isArray(source)) {
    return source.slice();
  }
  Object.keys(source).forEach((property) => {
    const sourceProperty = source[property];
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty);
    } else {
      target[property] = sourceProperty;
    }
  });
  return target;
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
  if (!element || !className) {
    return;
  }
  let classString = element.className;
  const nameIndex = classString.indexOf(className);
  if (nameIndex === -1) {
    classString += '' + className;
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length);
  }
  element.className = classString;
}

/**
 * @param {string} type
 * @returns {Date}
 */
export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90;
  } else {
    return new Date(new Date().toDateString());
  }
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result;

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp;

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function (...args) {
    context = this;
    timestamp = +new Date();
    const callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone');
  }
  const targetObj = source.constructor === Array ? [] : {};
  Object.keys(source).forEach((keys) => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys]);
    } else {
      targetObj[keys] = source[keys];
    }
  });
  return targetObj;
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
  return Array.from(new Set(arr));
}

/**
 * @returns {string}
 */
export function createUniqueString() {
  const timestamp = +new Date() + '';
  const randomNum = parseInt((1 + Math.random()) * 65536) + '';
  return (+(randomNum + timestamp)).toString(32);
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls;
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
    ele.className = ele.className.replace(reg, ' ');
  }
}

// 时间转换字符串
export function timeForStr(time, str) {

  if (!time) {
    return "--"
  }

  const date = new Date(time);
  str = str.replace(/yyyy|YYYY/, date.getFullYear());
  str = str.replace(
    /yy|YY/,
    date.getYear() % 100 > 9
      ? (date.getYear() % 100).toString()
      : '0' + (date.getYear() % 100)
  );
  var month = date.getMonth() + 1;
  str = str.replace(/MM/, month > 9 ? month.toString() : '0' + month);
  str = str.replace(/M/g, month);

  str = str.replace(
    /dd|DD/,
    date.getDate() > 9 ? date.getDate().toString() : '0' + date.getDate()
  );
  str = str.replace(/d|D/g, date.getDate());

  str = str.replace(
    /hh|HH/,
    date.getHours() > 9 ? date.getHours().toString() : '0' + date.getHours()
  );
  str = str.replace(/h|H/g, date.getHours());
  str = str.replace(
    /mm/,
    date.getMinutes() > 9
      ? date.getMinutes().toString()
      : '0' + date.getMinutes()
  );
  str = str.replace(/m/g, date.getMinutes());

  str = str.replace(
    /ss|SS/,
    date.getSeconds() > 9
      ? date.getSeconds().toString()
      : '0' + date.getSeconds()
  );
  str = str.replace(/s|S/g, date.getSeconds());
  return str;
}

/**
 * 下载导出excel
 * @param {*} code
 * @param {*} data
 */
export function downloddExcel(code, data) {
  if (code === 200 && data.sheets.length) {
    import('@/vendor/Export2Excel').then((excel) => {
      excel.export_json_to_multiexcel({
        multiSheet: data.sheets,
        filename: data.file_name,
      });
    });
  } else {
    this.$message({
      showClose: true,
      message: '导出数据为空',
      type: 'warning',
    });
    this.loading = false;
  }
}

/**
 * 筛选数组对象中null
 * @param {*} arry
 */
export function filterValueNull(arry, str = '--') {
  if (Array.isArray(arry)) {
    return arry.map((d) => {
      if (Object.keys(d).length) {
        for (const item in d) {
          if (d[item] === null) {
            d[item] = str;
          } else if (typeof d[item] === 'number') {
            d[item] = numberToFixed(d[item]);
          }
        }
      }
      return d;
    });
  } else {
    return arry;
  }
}
/**
 * 保留小数位
 * @param {*} num
 * @param {*} digit
 */
export function numberToFixed(num = '', digit = 8) {
  const arr = num.toString().split('.');
  const integer = arr[0];
  const decimal = arr[1];
  let last = integer;

  if (digit && decimal) {
    last = integer + '.' + String(decimal).substr(0, digit);
  }
  return last;
}
/**
 * 调用导出excel
 */
export function downLoad(res) {
  const { code, data } = res;
  if (code === 200 && data.sheets && data.sheets.length) {
    import('@/vendor/Export2Excel').then((excel) => {
      excel.export_json_to_multiexcel({
        multiSheet: data.sheets,
        filename: data.file_name,
      });
    });
  } else {
    this.$message({
      showClose: true,
      message: '导出数据为空',
      type: 'warning',
    });
  }
}

/**
 * 将图片转为Base64
 */
export function imageBase64(img) {
  var canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, img.width, img.height);
  var dataURL = canvas.toDataURL('image/png');
  return dataURL;
}

/**
 * 获取图片的Base64
 */
export function getImgBase64(imgUrl) {
  var base64 = '';
  var img = new Image();
  img.src = imgUrl;
  img.onload = function () {
    base64 = imageBase64(img);
  };
}

/**
 * 计算时间差 并转换为 dd hh:mm:ss
 * @param {Date} time1
 * @param {Date} time2
 */
export function timeDifferenceFun(time1, time2) {
  if (time1 && time2) {
    const difference = new Date(time2).getTime() - new Date(time1).getTime();
    let _time = '';
    const day = parseInt(difference / (1000 * 60 * 60 * 24));
    const h = parseInt((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = parseInt((difference % (1000 * 60 * 60)) / (1000 * 60));
    const s = parseInt((difference % (1000 * 60)) / 1000);
    if (day > 0) {
      _time += `${day}d`;
    }
    if (h > 0) {
      if (h < 10) {
        _time += ` 0${h}:`;
      } else {
        _time += ` ${h}:`;
      }
    } else {
      _time += ` 00:`;
    }
    if (m > 0) {
      if (m < 10) {
        _time += `0${m}:`;
      } else {
        _time += `${m}:`;
      }
    } else {
      _time += `00:`;
    }
    if (s > 0) {
      if (s < 10) {
        _time += `0${s}`;
      } else {
        _time += `${s}`;
      }
    } else {
      _time += `00`;
    }
    return _time;
  }
  return '--';
}


/**
 * @description: 精确小数点
 * @param {string} number：为你要转换的数字
 * @param {string} format：要保留几位小数；譬如要保留2位，则值为2
 * @param {string} zerFill:是否补零。不需要补零可以不填写此参数
 */
export const accurateDecimal = (number, format, zeroFill) => {
  //判断非空
  if (!isEmpty(number)) {
    //正则匹配:正整数，负整数，正浮点数，负浮点数
    if (!/^\d+(\.\d+)?$|^-\d+(\.\d+)?$/.test(number)) return number;
    let n = 1;
    for (let i = 0; i < format; i++) {
      n = n * 10;
    }

    // 向下取整
    number = Math.floor(Number(new bigNumber(number).multipliedBy(n)));
    number = new bigNumber(number).div(n);
    let str = number.toString();

    //是否补零
    if (zeroFill) {
      let index;
      if (str.indexOf(".") == -1) {
        index = format;
        str += ".";
      } else {
        index = format - (str.length - 1 - str.indexOf("."));
      }

      for (let i = 0; i < index; i++) {
        str += "0";
      }
    }
    return str;
  }
  return number;
};

//非空验证
function isEmpty(ObjVal) {
  if ((ObjVal == null || typeof (ObjVal) == "undefined") || (typeof (ObjVal) == "string" && ObjVal == "" && ObjVal != "undefined")) {
    return true;
  } else {
    return false;
  }
}

/**
 * 图片url链接转base64
 * @param {String} url 图片链接
 * @returns 转base64后的值或者报错信息
 */
export const imgUrlToBase64 = (url) => {
  return new Promise((resolve, reject) => {
    if (!url) {
      reject('请传入url内容');
    }

    if (/\.(png|jpe?g|gif|svg)(\?.*)?$/.test(url)) {
      // 图片地址
      const image = new Image();
      // 设置跨域问题
      image.setAttribute('crossOrigin', 'anonymous');
      // 图片地址
      image.src = url;
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0, image.width, image.height);
        // 获取图片后缀
        const ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
        // 转base64
        const dataUrl = canvas.toDataURL(`image/${ext}`);
        resolve(dataUrl || '');
      }
    } else {
      // 非图片地址
      reject('非(png/jpe?g/gif/svg等)图片地址');
    }
  });
};


/**
* 读取图片（或文件）转成base64
* @param {Object} file 图片文件的file，一般是文件上传的file信息
* @returns 转base64后的base64图片地址，或错误信息
*/
export const readImgToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    try {

      // 读取信息
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // 转base64结果
        const base64Url = reader.result;
        resolve(base64Url);
      }

      reader.onerror = (err) => {
        reject(err);
      }

    } catch (error) {
      reject(error);
    }
  });
}