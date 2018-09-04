function setActivePage(pages, activePage) {
  if (!activePage) {
    pages[0].active = true;
  } else {
    pages[activePage - 1].active = true;
  }
}

function paginate(totalItems, pageLimit, currentPage) {
  const pageCount = Math.ceil(totalItems / pageLimit);
  let pages = [];
  for(let x = 1; x <= pageCount; x++) {
    pages.push({number: x});
  }
  if ( pages.length ) {
    setActivePage(pages, currentPage);
  }
  return pages;
};

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