import { parse } from 'url';

// mock userAdminDataSource
let fundDataSource = [];
for (let i = 0; i < 5; i += 1) {
  fundDataSource.push({
    key: i,
    processcode:i,
    processname: `编码 ${i}`,
    description:'文档介绍',
    centercode: `${2 * i}`,
    isCheckpoint: '1',
    isJunctionpoint:'0',
    isCountingpoint:'1',
  });
}
let workDataSource = [];
for (let i = 0; i < 5; i += 1) {
  workDataSource.push({
    key: i,
    workcentercode:i,
    workcentername: `工作 ${i}`,
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
        processcode:i,
        processname: `编码 ${i}`,
        description:'文档介绍',
        centercode: `${2 * i}`,
        isCheckpoint: '1',
        isJunctionpoint:'0',
        isCountingpoint:'1',
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
        workcentercode:i,
        workcentername: `工作 ${i}`,
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
  'POST /rest/protype/fetch': postFund,
  'POST /rest/worktype/fetch': postWork,
};
