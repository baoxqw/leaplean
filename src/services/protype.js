import request from '@/utils/request';

const baseUrl = '/wookong';

export async function queryRole(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdOperation/queryConditions`,{
    method:'POST',
    body: str,
  });
}


export async function fetchWork(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdProductionline/queryConditions`,{
    method:'POST',
    body: str,
  });
}

export async function fetchWorkChild(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdProductionlineMaterial/query`,{
    method:'POST',
    body: str,
  });
}

export async function ppProductOrder(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/ppProductOrder/queryOrder`,{
    method:'POST',
    body: str,
  });
}

export async function fetchArea(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdProductionregion/queryConditions`,{
    method:'POST',
    body: str,
  });
}
export async function addProtype(params) {
  const str = JSON.stringify(params);

  return request(`${baseUrl}/rest/bdOperation/add`,{
    method:'POST',
    body: str,
  });
}

export async function removeProtype(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdOperation/delete`,{
    method:'POST',
    body: str,
  });
}


export async function fetchStation(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdWorkunittype/queryConditions`,{
    method:'POST',
    body: str,
  });
}

