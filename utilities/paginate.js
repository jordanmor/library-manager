/* Once the active page is set, the pagination template renders 
a highlighted active page number using the .active CSS class */

function setActivePage(pages, activePage) {
  if (!activePage) {
    pages[0].active = true;
  } else {
    pages[activePage - 1].active = true;
  }
}

/* Returns an array of numbered objects a pug template can use 
to create numbered buttons for pagination */

function paginate(totalItems, pageLimit, currentPage) {
  // TotalItems = items downloaded from database
  const pageCount = Math.ceil(totalItems / pageLimit);
  let pages = [];
  for(let x = 1; x <= pageCount; x++) {
    pages.push({number: x});
  }
  if ( pages.length ) {
    setActivePage(pages, currentPage);
  }
  return pages; // Output example: [ {number: 1}, {number: 2}, {number: 3} ]
};

/* Determines the offset used by a GET request 
to the database when a paginated list is desired */

function setOffset(currentPage, pageLimit) {
  let offset = 0;
  if(currentPage) {
    if(currentPage != 1) {
      offset = (currentPage - 1) * pageLimit;
    }
  }
  return offset;
}

module.exports.paginate = paginate;
module.exports.setOffset = setOffset;