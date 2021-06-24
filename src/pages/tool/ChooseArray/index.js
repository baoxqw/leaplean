function sortArr(arr, str) {
      var _arr = [],
            _t = [],
         // 临时的变量
      _tmp;

   // 按照特定的参数将数组排序将具有相同值得排在一起
    arr = arr.sort(function(a, b) {
        var s = a[str],
            t = b[str];
      return s < t ? -1 : 1;
    });

   if ( arr.length ){
        _tmp = arr[0][str];
    }
   // console.log( arr );
     // 将相同类别的对象添加到统一个数组
    for (var i in arr) {
       
         if ( arr[i][str] === _tmp ){
         
           _t.push( arr[i] );
       } else {
            _tmp = arr[i][str];
           _arr.push( _t );
            _t = [arr[i]];
        }
    }
    // 将最后的内容推出新数组
    _arr.push( _t );
    return _arr;
 }

export {
  sortArr
}
