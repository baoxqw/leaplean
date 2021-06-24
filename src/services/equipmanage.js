import request from '@/utils/request';

const baseUrl = '/wookong';

export async function queryLine(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdProductionline/query`,{
    method:'POST',
    body: str,
  });
}
export async function fetchProduct(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/emRepairorder/query`,{
    method:'POST',
    body: str,
  });
}
export async function addself(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/emRepairorder/add`,{
    method:'POST',
    body: str,
  });
}
export async function deleteSelf(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/emRepairorder/delete`,{
    method:'POST',
    body: str,
  });
}
export async function addrepair(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/emMaintenancereport/add`,{
    method:'POST',
    body: str,
  });
}
export async function fetchrepair(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/emMaintenancereport/query`,{
    method:'POST',
    body: str,
  });
}
export async function deleteRepair(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/emMaintenancereport/delete`,{
    method:'POST',
    body: str,
  });
}













