import request from '@/utils/request';

const baseUrl = '/wookong';

export async function queryWorktype(params) {
  return request(`${baseUrl}/rest/bdWorkunittype/queryConditions`,{
    method:'POST',
    body: params,
  });
}

export async function addWorktype(params) {
  return request(`${baseUrl}/rest/bdWorkunittype/add`,{
    method:'POST',
    body: params,
  });
}

export async function deleteWorktype(params) {
  return request(`${baseUrl}/rest/bdWorkunittype/delete`,{
    method:'POST',
    body: params,
  });
}







