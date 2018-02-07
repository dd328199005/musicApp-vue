export function addClass(el, className) {
  if (hasClass(el, className)) return
  el.classList.add(className)  
}

export function hasClass(el, className) {
  return el.classList.contains(className)
}