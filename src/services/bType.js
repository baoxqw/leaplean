import request from '@/utils/request';

const baseUrl = '/wookong';

export async function queryWorktype(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdequipmenttype/queryConditions`,{
    method:'POST',
    body: str,
  });
}

export async function addWorktype(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdequipmenttype/add`,{
    method:'POST',
    body: str,
  });
}

export async function deleteWorktype(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdequipmenttype/delete`,{
    method:'POST',
    body: str,
  });
}





