function paginate(totalItems, pageLimit) {
  const pages = Math.ceil(totalItems / pageLimit);
  let pagesArray = [];
  for(let x = 1; x <= pages; x++) {
    pagesArray.push({number: x});
  }
  return pagesArray;
};

function setActivePage(pages, activePage) {
  if (!activePage) {
    pages[0].active = true;
  } else {
    pages[activePage - 1].active = true;
  }
}

function setOffset(pageNum, pageLimit) {
  let offset = 0;
  if(pageNum) {
    if(pageNum != 1) {
      offset = (pageNum - 1) * pageLimit;
    }
  }
  return offset;
}

module.exports.paginate = paginate;
module.exports.setActivePage = setActivePage;
module.exports.setOffset = setOffset;