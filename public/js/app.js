$( document ).ready(function() {
  const regex = /^\/[a-z]*/;
  const basePathname = window.location.pathname.match(regex)[0];
  // Active main nav link
  $(`#main-nav a[href="${basePathname}"]`).addClass('active');
  // Active filter link on books and loans page
  $(`#filters a[href="${window.location.pathname}"]`).addClass('active');
});