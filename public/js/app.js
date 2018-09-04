$( document ).ready(function() {

  // Active links
  const regex = /^\/[a-z]*/;
  const basePathname = window.location.pathname.match(regex)[0];
  // Active main nav link
  $(`#main-nav a[href="${basePathname}"]`).addClass('active-link');
  // Active filter link on books and loans page
  $(`#filters a[href="${window.location.pathname}"]`).addClass('active-link');

  // Error handler for search function
  $('form.search').on('submit', function(e) {
    
    if ($('form.search select').val() === '' || $('#searchInput').val() === '') {
      $('.search-errors').remove();
      let html = '<div class="search-errors"><p class="errors">';

      if ($('form.search select').val() === '' && $('#searchInput').val() === '') {
        e.preventDefault();
        html += 'Please select a keyword and enter a search query'; 
        $('#searchInput').addClass('errors-bd');
      } else if ($('form.search select').val() === '') {
        e.preventDefault();
        html += 'Please select a keyword';
      } else if ($('#searchInput').val() === '') {
        e.preventDefault();
        html += 'Please enter a search query'; 
        $('#searchInput').addClass('errors-bd');
      }

      html += '</p></div>';
      $('form .search-container').before(html);
    }
  });

});