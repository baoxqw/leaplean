import request from '@/utils/request';

const baseUrl = '/wookong';

export async function queryDC(params) {
  return request(`${baseUrl}/rest/emEquipment/query`,{
    method:'POST',
    body: params,
  });
}
export async function addDC(params) {
  return request(`${baseUrl}/rest/emEquipment/add`,{
    method:'POST',
    body: params,
  });
}
export async function deleteDC(params) {
  return request(`${baseUrl}/rest/emEquipment/delete`,{
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

export async function deleteChild(params) {
  return request(`${baseUrl}/rest/emEquipmentMaintenance/delete`,{
    method:'POST',
    body: params,
  });
}

export async function addChild(params) {
  return request(`${baseUrl}/rest/emEquipmentMaintenance/add`,{
    method:'POST',
    body: params,
  });
}

export async function fetchWorkunit(params) {
  return request(`${baseUrl}/rest/bdWorkunit/query`,{
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
