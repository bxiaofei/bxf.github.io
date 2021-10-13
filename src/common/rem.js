/* eslint-disable */
(function (doc, win) {
  let docEl = doc.documentElement
  let resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'
  let recalc = function () {
    var clientWidth = docEl.clientWidth
    if (!clientWidth) return
    if (window.innerWidth > 768) {
      // docEl.style.fontSize = 100 * (clientWidth / 375) + 'px'
      docEl.style.fontSize = 16 + 'px'
      return
    }
    docEl.style.fontSize = 100 * (clientWidth / 375) + 'px'
  }
  if (!doc.addEventListener) return
  win.addEventListener(resizeEvt, recalc, false)
  doc.addEventListener('DOMContentLoaded', recalc, false)
})(document, window)
