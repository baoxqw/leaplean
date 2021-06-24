import request from '@/utils/request';

const baseUrl = '/wookong';

export async function fetchProduct(params) {
  return request(`${baseUrl}/rest/bdProductionline/query`,{
    method:'POST',
    body: params,
  });
}

export async function addProduct(params) {
  return request(`${baseUrl}/rest/bdProductionregion/add`,{
    method:'POST',
    body: params,
  });
}

export async function queryArea(params) {
  return request(`${baseUrl}/rest/bdProductionregion/queryConditions`,{
    method:'POST',
    body: params,
  });
}

export async function deleteArea(params) {
  return request(`${baseUrl}/rest/bdProductionregion/delete`,{
    method:'POST',
    body: params,
  });
}







