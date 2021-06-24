import request from '@/utils/request';

const baseUrl = '/wookong';



export async function newdata(params) {
  return request(`${baseUrl}/rest/bdMaterialBase/query`,{
    method:'POST',
    body: params,
  });
}

export async function matype(params) {
  return request(`${baseUrl}/rest/bdInvcl/query`,{
    method:'POST',
    body: params,
  });
}

export async function maunit(params) {
  return request(`${baseUrl}/rest/bdUcum/query`,{
    method:'POST',
    body: params,
  });
}

export async function submitData(params) {
  return request(`${baseUrl}/rest/bdMaterialBase/add`,{
    method:'POST',
    body: params,
  });
}
export async function addMaterial(params) {
  return request(`${baseUrl}/rest/bdInvcl/add`,{
    method:'POST',
    body: params,
  });
}

export async function deleteMaterial(params) {
  return request(`${baseUrl}/rest/bdInvcl/delete`,{
    method:'POST',
    body: params,
  });
}

export async function removeDM(params) {
  return request(`${baseUrl}/rest/bdMaterialBase/delete`,{
    method:'POST',
    body: params,
  });
}
export async function queryMatemanage(params) {
  return request(`${baseUrl}/rest/bdMaterialBase/queryConditions`,{
    method:'POST',
    body: params,
  });
}
///rest/bdMaterialBase/queryRedis
export async function fetchMataCon(params) {
  return request(`${baseUrl}/rest/bdMaterialBase/queryRedis`,{
    method:'POST',
    body: params,
  });
}
export async function fetchUcum(params) {
  return request(`${baseUrl}/rest/bdUcum/queryConditions`,{
    method:'POST',
    body: params,
  });
}

export async function addMatemanage(params) {
  return request(`${baseUrl}/rest/bdMaterialBase/add`,{
    method:'POST',
    body: params,
  });
}

export async function addMatemanageList(params) {
  return request(`${baseUrl}/rest/bdMaterialBase/batchadd`,{
    method:'POST',
    body: params,
  });
}
export async function deleteMatemanage(params) {
  return request(`${baseUrl}/rest/bdMaterialBase/delete`,{
    method:'POST',
    body: params,
  });
}


export async function queryConditions(params) {
  return request(`${baseUrl}/rest/bdMaterialBase/queryConditions`,{
    method:'POST',
    body: params,
  });
}

export async function newdataList(params) {
  return request(`${baseUrl}/rest/bd/cubasdoc/queryConditions`,{
    method:'POST',
    body: params,
  });
}
