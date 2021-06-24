import request from '@/utils/request';

const baseUrl = '/wookong';

export async function queryRole(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdOperation/query`, {
    method: 'POST',
    body: str,
  });
}


export async function matype(params) {
  return request(`${baseUrl}/rest/bdInvcl/query`, {
    method: 'POST',
    body: params,
  });
}

export async function queryMatemanage(params) {
  return request(`${baseUrl}/rest/bdMaterialBase/query`, {
    method: 'POST',
    body: params,
  });
}


export async function queryWorktype(params) {
  return request(`${baseUrl}/rest/emStageProject/queryConditions`, {
    method: 'POST',
    body: params,
  });
}


export async function deleteWorktype(params) {
  return request(`${baseUrl}/rest/emStageProject/delete`, {
    method: 'POST',
    body: params,
  });
}

export async function addWorktype(params) {
  return request(`${baseUrl}/rest/emStageProject/add`, {
    method: 'POST',
    body: params,
  });
}

export async function childFetch(params) {
  return request(`${baseUrl}/rest/emStageProjectB/query`, {
    method: 'POST',
    body: params,
  });
}

export async function addchild(params) {
  return request(`${baseUrl}/rest/emStageProjectB/add`, {
    method: 'POST',
    body: params,
  });
}

export async function queryArea(params) {
  return request(`${baseUrl}/rest/bdOperation/query`, {
    method: 'POST',
    body: params,
  });
}

export async function fetchWork(params) {
  return request(`${baseUrl}/rest/bdWorkcenter/query`, {
    method: 'POST',
    body: params,
  });
}

export async function deleteChild(params) {
  return request(`${baseUrl}/rest/emStageProjectB/delete`, {
    method: 'POST',
    body: params,
  });
}
