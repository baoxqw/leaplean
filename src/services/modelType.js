import request from '@/utils/request';

const baseUrl = '/wookong';

export async function queryMP(params) {
  return request(`${baseUrl}/rest/emMaintenanceplan/query`,{
    method:'POST',
    body: params,
  });
}

export async function addData(params) {
  return request(`${baseUrl}/rest/industryModelingModel/add`,{
    method:'POST',
    body: params,
  });
}
export async function newdatasss(params) {
  return request(`${baseUrl}/rest/industryModelingModel/query`,{
    method:'POST',
    body: params,
  });
}
export async function removenewdata(params) {
  return request(`${baseUrl}/rest/industryModelingModel/delete`,{
    method:'POST',
    body: params,
  });
}

export async function fetchPrepare(params) {
  return request(`${baseUrl}/rest/industryModelingDevelop/queryConditions`,{
    method:'POST',
    body: params,
  });
}
export async function removePrepare(params) {
  return request(`${baseUrl}/rest/industryModelingDevelop/delete`,{
    method:'POST',
    body: params,
  });
}

export async function addPrepare(params) {
  return request(`${baseUrl}/rest/industryModelingDevelop/add`,{
    method:'POST',
    body: params,
  });
}


