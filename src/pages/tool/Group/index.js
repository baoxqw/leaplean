function  groupBy(array, f) {
  const groups = {};
  array.forEach(function (o) { //注意这里必须是forEach 大写
    const group = JSON.stringify(f(o));
    groups[group] = groups[group] || [];
    groups[group].push(o);
  });
  return Object.keys(groups).map(function (group) {
    return groups[group];
  });
}

export {
  groupBy
}
