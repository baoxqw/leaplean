import request from '@/utils/request';

const baseUrl = '/wookong';



export async function queryMP(params) {
  return request(`${baseUrl}/rest/emMaintenanceplan/query`,{
    method:'POST',
    body: params,
  });
}
export async function addMP(params) {
  return request(`${baseUrl}/rest/emMaintenanceplan/add`,{
    method:'POST',
    body: params,
  });
}
export async function deleteMP(params) {
  return request(`${baseUrl}/rest/emMaintenanceplan/delete`,{
    method:'POST',
    body: params,
  });
}

export async function childFetch(params) {
  return request(`${baseUrl}/rest/emEquipmentMaintenance/query`,{
    method:'POST',
    body: params,
  });
}

export async function addChild(params) {
  return request(`${baseUrl}/rest/emMaintenanceplanProject/batchadd`,{
    method:'POST',
    body: params,
  });
}

export async function childFetchList(params) {
  return request(`${baseUrl}/rest/emMaintenanceplanProject/query`,{
    method:'POST',
    body: params,
  });
}
export async function childFetchListEnd(params) {
  return request(`${baseUrl}/rest/emMaintenanceplanAnnal/query`,{
    method:'POST',
    body: params,
  });
}
export async function findprojectdata(params) {
  return request(`${baseUrl}/rest/emMaintenanceplanMaintain/query`,{
    method:'POST',
    body: params,
  });
}
export async function addChildComme(params) {
  return request(`${baseUrl}/rest/emMaintenanceplanAnnal/batchadd`,{
    method:'POST',
    body: params,
  });
}
export async function addend(params) {
  return request(`${baseUrl}/rest/emMaintenanceplanAnnal/add`,{
    method:'POST',
    body: params,
  });
}
export async function deleteend(params) {
  return request(`${baseUrl}/rest/emMaintenanceplanAnnal/delete`,{
    method:'POST',
    body: params,
  });
}
