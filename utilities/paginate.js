module.exports = function(totalItems, pageLimit) {
  const pages = Math.ceil(totalItems / pageLimit);
  let pagesArray = [];
  for(let x = 1; x <= pages; x++) {
    pagesArray.push(x);
  }
  return pagesArray;
};