export function addClass(el, className) {
  if (hasClass(el, className)) return
  el.classList.add(className)  
}

export function hasClass(el, className) {
  return el.classList.contains(className)
}

export function getData(el, name, val) {
  if (val) {
    el.dataset[name] = val
  } else {
    return el.dataset[name]
  }
}

// 浏览器兼容方法
let elementStyle = document.createElement('div').style

let vendor = (() => {
  let transformName = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }
  
  for (let key in transformName) {
    if (elementStyle[transformName[key]] !== undefined) {
      return key
    }
  }
  return false
})() // 检查浏览器支持情况

export function prefixStyle(style) {
  if (vendor === false) {
    return false
  }
  if (vendor === 'standard') {
    return style
  } 
  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}