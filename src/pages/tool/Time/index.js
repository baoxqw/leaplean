function isDateIntersection(start1, end1, start2, end2) { var startdate1 = new Date(start1.replace("-", "/").replace("-", "/")); var enddate1 = new Date(end1.replace("-", "/").replace("-", "/")); var startdate2 = new Date(start2.replace("-", "/").replace("-", "/")); var enddate2 = new Date(end2.replace("-", "/").replace("-", "/")); if (startdate1 >= startdate2 && startdate1 <= enddate2) { return true; } if (enddate1 >= startdate2 && enddate1 <= enddate2) { return true; } if (startdate1 <= startdate2 && enddate1 >= enddate2) { return true; } return false; }
function GetDateDiff(startTime, endTime, diffType) {
  //将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式
  startTime = startTime.replace(/\-/g, "/");
  endTime = endTime.replace(/-/g, "/");

  //将计算间隔类性字符转换为小写
  diffType = diffType.toLowerCase();
  var sTime = new Date(startTime);      //开始时间
  var eTime = new Date(endTime);  //结束时间
  //作为除数的数字
  var divNum = 1;
  switch (diffType) {
    case "second":
      divNum = 1000;
      break;
    case "minute":
      divNum = 1000 * 60;
      break;
    case "hour":
      divNum = 1000 * 3600;
      break;
    case "day":
      divNum = 1000 * 3600 * 24;
      break;
    default:
      break;
  }
  return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(divNum));
}
export {
  isDateIntersection,
  GetDateDiff
}
