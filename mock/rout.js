import { parse } from 'url';

// mock userAdminDataSource
let fundDataSource = [];
for (let i = 0; i < 5; i += 1) {
  fundDataSource.push({
    key: i,
    routecode:i,
    routename: `工艺 ${i}`,
    mattername:'文档介绍',
    mattercode: `${2 * i}`,
    number: `${3 * i}`,
    version: `${1.1 * i}`,
    isDefault: '1',
    testtype:'测试',
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
        routecode:i,
        routename: `工艺 ${i}`,
        mattername:'文档介绍',
        mattercode: `${2 * i}`,
        number: `${3 * i}`,
        version: `${1.1 * i}`,
        isDefault: '1',
        testtype:'测试',
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

export default {
  'POST /rest/rout/fetch': postFund,
};
