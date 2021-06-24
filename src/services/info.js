import { stringify } from 'qs';
import request from '@/utils/request';
import storage from '@/utils/storage'
// 代理路径
const baseUrl = '/wookong';
// 假数据接口

export async function queryInfo(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/post/queryPostProjectBasicInfoById`,{
    method:'POST',
    body: str
  });
}

export async function queryCoinmarketcap(params) {
  return request(`/bb/v1/cryptocurrency/quotes/latest?${stringify(params)}`,{
    headers:{
      'X-CMC_PRO_API_KEY':'4630e928-3a45-4884-b586-507f55eefced'
    }
  })
}

export async function queryHuobi(params) {
  return request(`/aa/market/trade?${stringify(params)}`)
}

export async function queryBinance(params) {
  return request(`/cc/api/v3/ticker/price?${stringify(params)}`)
}

export async function queryOkex(params) {
  const { ticker,symbol } = params;
  return request(`/dd/api/spot/v3/instruments/${ticker}-${symbol}/ticker`)
}

export async function addInfo(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/post/projectexit`,{
    method:'POST',
    body: str
  });
}

export async function findInfo(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/queryprojectexit`,{
    method:'POST',
    body: str
  });
}

export async function querySelect(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/projectexit/queryById`,{
    method:'POST',
    body: str
  });
}


export async function huobiFindHuobi(params) {
  return request(`/aa/v1/common/currencys`)
}
