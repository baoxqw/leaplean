import request from '@/utils/request';
// 代理路径
const baseUrl = '/wookong';
// 假数据接口
export async function findPlan(params) {
  const str = JSON.stringify(params);
  return request('/rest/wm/queryicmproject',{
    method:'POST',
    body: str
  });
}
