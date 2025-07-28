import { Message } from 'element-ui';
/**
 * @desc 阿里云oss图片按比例缩放
 */
export function getOSSImgResize(src, height) {
  const ossFlag = src.includes("oss-cn");
  const h = height ? parseInt(height, 10) : 300;
  return ossFlag
    ? `${src}?x-oss-process=image/resize,h_${h},m_lfit,limit_0`
    : src;
}

// 数组头部添加“全部”选项
export function addAllOption(arr) {
  if (Array.isArray(arr)) {
    return [{ label: '全部', value: '全部' }].concat([...arr]);
  }
  return arr;
}

/**
 * @desc 文件导出
 * @param {Blob} blobData 文件数据
 * @param {String} fileName 文件名称
 * @param {String} type 导出数据类型
 */

export function downloadFile(blobData, fileName, type) {
  // let blob = new Blob([blobData.data], { type: type || 'application/vnd.ms-excel' });
  let blob = new Blob([blobData.data], { type: type || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  // console.log('blob',blob);
  const reader = new FileReader();
  reader.onload = function () {
    try {
      // json能解析: 后台返回的原始数据，说明出错
      const resData = JSON.parse(this.result);
      Message({
        type: 'error',
        message: resData.msg,
      });
    } catch {
      const href = URL.createObjectURL(blob);
      _downloadLink(href, fileName);
    }
  };

  reader.readAsText(blob);
}
// 导出word文件
export function downloadWordFile(blobData, fileName) {
  let blob = new Blob([blobData.data], { type: 'application/msword' });
  const reader = new FileReader();
  reader.onload = function () {
    try {
      // json能解析: 后台返回的原始数据，说明出错
      const resData = JSON.parse(this.result);
      Message({
        type: 'error',
        message: resData.msg,
      });
    } catch {
      const href = URL.createObjectURL(blob);
      _downloadLink(href, fileName);
    }
  };

  reader.readAsText(blob);
}

function _downloadLink(url, fileName) {
  const aDom = document.createElement('a');
  aDom.style.display = 'none';
  aDom.href = url;
  aDom.setAttribute('download', fileName);
  document.body.appendChild(aDom);
  aDom.click();
  document.body.removeChild(aDom);

  Message({
    type: 'success',
    message: '导出成功！',
  });
  // this.$notify.success('导出成功');
}

// 下载含有url的文件
export function downloadUrlFile(url, fileName) {
  const url2 = url.replace(/\\/g, '/');
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url2, true);
  xhr.responseType = 'blob';
  //xhr.setRequestHeader('Authorization', 'Basic a2VybWl0Omtlcm1pdA==');
  // 为了避免大文件影响用户体验，建议加loading
  xhr.onload = () => {
    if (xhr.status === 200) {
      // 获取文件blob数据并保存
      saveAs(xhr.response, fileName);
    }
  };
  xhr.send();
}
// 封装blob对象
function dataURLToBlob(base64Str, mimeTypeStr) {
  let bstr = window.atob(base64Str); // 解码 base-64 编码的字符串，base-64 编码使用方法是 btoa()
  let length = bstr.length;
  let u8arr = new Uint8Array(length); // 创建初始化为0的，包含length个元素的无符号整型数组
  while (length--) {
    u8arr[length] = bstr.charCodeAt(length); // 返回在指定的位置的字符的 Unicode 编码
  }
  return new Blob([u8arr], { type: mimeTypeStr }); // 返回一个blob对象
}

// 后端返回base64公共导出
export function downloadFileByBase64(base64Str, mimeTypeStr, fileName){
  let myBlob = dataURLToBlob(base64Str, mimeTypeStr)
  let myUrl = window.URL.createObjectURL(myBlob)
  download(myUrl, fileName)
}
// 创建一个a标签，并做点击下载事件
function download(hrefUrl, fileName){
  let a = document.createElement('a')
  a.href = hrefUrl
  a.download = fileName // 下载后文件名
  document.body.appendChild(a)
  a.click() // 点击下载
  document.body.removeChild(a) // 下载完成移除元素
}
function saveAs(data, name) {
  const urlObject = window.URL || window.webkitURL || window;
  const export_blob = new Blob([data]);
  const save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
  save_link.href = urlObject.createObjectURL(export_blob);
  save_link.download = name;
  save_link.click();
}

export function downloadFileByI(url) {
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none'; // 防止影响页面
  iframe.style.height = 0; // 防止影响页面
  iframe.src = url;
  document.body.appendChild(iframe); // 这一行必须，iframe挂在到dom树上才会发请求
  // 5分钟之后删除（onload方法对于下载链接不起作用，就先抠脚一下吧）
  setTimeout(() => {
    iframe.remove();
  }, 5 * 60 * 1000);
}

export function colorRgb(color16, opacity) {
  // 16进制颜色值的正则
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  // 把颜色值变成小写
  let color = color16.toLowerCase();
  if (reg.test(color)) {
    // 如果只有三位的值，需变成六位，如：#fff => #ffffff
    if (color.length === 4) {
      var colorNew = '#';
      for (let i = 1; i < 4; i += 1) {
        colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1));
      }
      color = colorNew;
    }
    // 处理六位的颜色值，转为RGB
    const colorChange = [];
    for (let i = 1; i < 7; i += 2) {
      colorChange.push(parseInt('0x' + color.slice(i, i + 2)));
    }

    opacity = opacity === undefined ? 1 : opacity;
    return 'rgba(' + colorChange.join(',') + `,${opacity}` + ')';
  } else {
    return color;
  }
}
