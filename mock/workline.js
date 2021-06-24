import { parse } from 'url';

// mock userAdminDataSource
let fundDataSource = [];
for (let i = 0; i < 5; i += 1) {
  fundDataSource.push({
    key: i,
    productionlinenumber:i,
    productionlinename: `编码 ${i}`,
    workcentername:'流动介绍',
    workcenternumber: `${2 * i}`,
    materialcoding: `${3 * i}`,
    isCheckpoint: '1',
    materialname: '物料',
    status:'初始状态',
  });
}
let workDataSource = [];
for (let i = 0; i < 5; i += 1) {
  workDataSource.push({
    key: i,
    workunitnumber:i,
    workunitname: `工作单元 ${i}`,
    workcentername: `中心 ${i}`,
    typecoding: `${2 * i}`,
    materialcoding: `${3 * i}`,
    areacode: `${5 * i}`,
    areaname: `${3 * i}`,
    isCheckpoint: '1',
    status:'初始状态',
  });
}
function postFund(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { method, name, desc, key } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      fundDataSource = fundDataSource.filter(item => key.indexOf(item.key) === -1);
      break;
    case 'post':
      const i = Math.ceil(Math.random() * 10000);
      fundDataSource.unshift({
        key: i,
        productionlinenumber:i,
        productionlinename: `编码 ${i}`,
        workcentername:'流动介绍',
        workcenternumber: `${2 * i}`,
        materialcoding: `${3 * i}`,
        isCheckpoint: '1',
        materialname: '天气',
        status:'初始状态',
      });
      break;
    case 'update':
      fundDataSource = fundDataSource.map(item => {
        if (item.key === key) {
          Object.assign(item, { desc, name });
          return item;
        }
        return item;
      });
      break;
    default:
      break;
  }

  const result = {
    resData: fundDataSource,
    total: fundDataSource.length,
  };

  return res.json(result);
}
function postWork(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { method, name, desc, key } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      workDataSource = workDataSource.filter(item => key.indexOf(item.key) === -1);
      break;
    case 'post':
      const i = Math.ceil(Math.random() * 10000);
      workDataSource.unshift({
        key: i,
        workunitnumber:i,
        workunitname: `工作单元 ${i}`,
        workcentername: `中心 ${i}`,
        typecoding: `${2 * i}`,
        materialcoding: `${3 * i}`,
        areacode: `${5 * i}`,
        areaname: `${3 * i}`,
        isCheckpoint: '1',
        status:'初始状态',
      });
      break;
    case 'update':
      workDataSource = workDataSource.map(item => {
        if (item.key === key) {
          Object.assign(item, { desc, name });
          return item;
        }
        return item;
      });
      break;
    default:
      break;
  }

  const result = {
    resData: workDataSource,
    total: workDataSource.length,
  };

  return res.json(result);
}
export default {
  'POST /rest/workline/fetch': postFund,
  'POST /rest/unitworking/fetch': postWork,
};
