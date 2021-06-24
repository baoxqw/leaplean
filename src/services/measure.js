import request from '@/utils/request';

const baseUrl = '/wookong';

export async function queryRole(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdUcum/queryConditions`,{
    method:'POST',
    body: str,
  });
}

export async function addmeasure(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdUcum/add`,{
    method:'POST',
    body: str,
  });
}

export async function removemeasure(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdUcum/delete`,{
    method:'POST',
    body: str,
  });
}





