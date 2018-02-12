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