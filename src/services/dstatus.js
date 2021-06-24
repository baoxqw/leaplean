import request from '@/utils/request';

const baseUrl = '/wookong';

export async function queryRole(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdEquipmentstatus/queryConditions`,{
    method:'POST',
    body: str,
  });
}


export async function adddevice(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdEquipmentstatus/add`,{
    method:'POST',
    body: str,
  });
}

export async function removedevice(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdEquipmentstatus/delete`,{
    method:'POST',
    body: str,
  });
}
