$( document ).ready(function() {

  // Active links
  const regex = /^\/[a-z]*/;
  const basePathname = window.location.pathname.match(regex)[0];
  // Active main nav link
  $(`#main-nav a[href="${basePathname}"]`).addClass('active-link');
  // Active filter link on books and loans page
  $(`#filters a[href="${window.location.pathname}"]`).addClass('active-link');

  // Error handler for search fields
  $('form.search').on('submit', function(e) {
    const $searchInput = $('#searchInput');
    const $select = $('form.search select');

    if ($select.val() === '' || $searchInput.val() === '') {

      e.preventDefault();
      $('.search-errors').remove();
      let html = '<div class="search-errors"><p class="errors">';

      if ($select.val() === '' && $searchInput.val() === '') {
        html += 'Please select a keyword and enter a search query'; 
      } else if ($select.val() === '') {
        html += 'Please select a keyword';
      } else if ($searchInput.val() === '') {
        html += 'Please enter a search query'; 
      }

      html += '</p></div>';
      $searchInput.addClass('errors-bd');
      $('form .search-container').before(html);
    }

  });

});