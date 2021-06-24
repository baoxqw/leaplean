import request from '@/utils/request';

const baseUrl = '/wookong';

export async function queryPro(params) {
  return request(`${baseUrl}/rest/ppProductNotice/queryConditions`,{
    method:'POST',
    body: params,
  });
}
export async function addProduct(params) {
  return request(`${baseUrl}/rest/ppProductNotice/add`,{
    method:'POST',
    body: params,
  });
}
export async function deleteProduct(params) {
  return request(`${baseUrl}/rest/ppProductNotice/delete`,{
    method:'POST',
    body: params,
  });
}
export async function findtree(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/industryModelingModel/query`,{
    method:'POST',
    body: str,
  });
}
export async function fetchMata(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/industryModelingWork/query`,{
    method:'POST',
    body: str,
  });
}
