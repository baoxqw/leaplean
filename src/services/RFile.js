import request from '@/utils/request';

const baseUrl = '/wookong';

export async function fetchstore(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdWarehouseFile/queryConditions`,{
    method:'POST',
    body: str,
  });
}
export async function deletestore(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdWarehouseFile/delete`,{
    method:'POST',
    body: str,
  });
}
export async function findrespository(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdLocationFile/query`,{
    method:'POST',
    body: str,
  });
}
export async function addData(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdLocationFile/add`,{
    method:'POST',
    body: str,
  });
}

export async function addstore(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdWarehouseFile/add`,{
    method:'POST',
    body: str,
  });
}
export async function removenewdata(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdLocationFile/delete`,{
    method:'POST',
    body: str,
  });
}

export async function quickAdd(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdLocationFile/quickadd`,{
    method:'POST',
    body: str,
  });
}

