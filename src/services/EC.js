import request from '@/utils/request';

const baseUrl = '/wookong';

export async function queryEC(params) {
  return request(`${baseUrl}/rest/bdEquipmentcl/query`,{
    method:'POST',
    body: params,
  });
}
export async function addEC(params) {
  return request(`${baseUrl}/rest/bdEquipmentcl/add`,{
    method:'POST',
    body: params,
  });
}
export async function deleteEC(params) {
  return request(`${baseUrl}/rest/bdEquipmentcl/delete`,{
    method:'POST',
    body: params,
  });
}
