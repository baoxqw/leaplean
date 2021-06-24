import request from '@/utils/request';

const baseUrl = '/wookong';

export async function queryLine(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdProductionline/queryConditions`,{
    method:'POST',
    body: str,
  });
}


export async function fetchWorkCon(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdWorkcenter/queryRedis`,{
    method:'POST',
    body: str,
  });
}

export async function childAdd(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdProductionlineMaterial/add`,{
    method:'POST',
    body: str,
  });
}

export async function childDelete(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdProductionlineMaterial/delete`,{
    method:'POST',
    body: str,
  });
}

export async function fetchWorkConditions(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdWorkcenter/queryConditions`,{
    method:'POST',
    body: str,
  });
}

export async function addLine(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdProductionline/add`,{
    method:'POST',
    body: str,
  });
}

export async function queryChild(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdProductionlineMaterial/query`,{
    method:'POST',
    body: str,
  });
}

export async function deleteLine(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdProductionline/delete`,{
    method:'POST',
    body: str,
  });
}

export async function fetchMaterial(params) {
  return request(`${baseUrl}/rest/bdInvcl/query`,{
    method:'POST',
    body: params,
  });
}




