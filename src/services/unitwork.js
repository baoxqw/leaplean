import request from '@/utils/request';

const baseUrl = '/wookong';

export async function queryUnitwork(params) {
  return request(`${baseUrl}/rest/bdWorkunit/query`,{
    method:'POST',
    body: params,
  });
}

export async function fetchRegion(params) {
  return request(`${baseUrl}/rest/bdProductionregion/queryConditions`,{
    method:'POST',
    body: params,
  });
}



export async function addUnitwork(params) {
  return request(`${baseUrl}/rest/bdWorkunit/add`,{
    method:'POST',
    body: params,
  });
}

export async function deleteUnitwork(params) {
  return request(`${baseUrl}/rest/bdWorkunit/delete`,{
    method:'POST',
    body: params,
  });
}





