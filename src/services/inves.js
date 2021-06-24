import request from '@/utils/request';
// 代理路径
const baseUrl = '/wookong';
// 假数据接口


export async function queryInvestDecision(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/wm/queryicmproject`,{
    method:'POST',
    body: str
  });
}
