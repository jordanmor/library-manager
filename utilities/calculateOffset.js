module.exports = function(pageNum, pageLimit) {
  let offset = 0;
  if(pageNum) {
    if(pageNum != 1) {
      offset = (pageNum - 1) * pageLimit;
    }
  }
  return offset;
}