import request from '@/utils/request';

const baseUrl = '/wookong';

export async function queryRole(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdWorkcenter/queryConditions`,{
    method:'POST',
    body: str,
  });
}

export async function addwork(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdWorkcenter/add`,{
    method:'POST',
    body: str,
  });
}

export async function deletework(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdWorkcenter/delete`,{
    method:'POST',
    body: str,
  });
}





