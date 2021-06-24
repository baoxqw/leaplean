import request from '@/utils/request';

const baseUrl = '/wookong';



export async function queryMaterial(params) {
  return request(`${baseUrl}/rest/bdInvcl/query`,{
    method:'POST',
    body: params,
  });
}

export async function newdatasss(params) {
  return request(`${baseUrl}/rest/bdHolidaycl/query`,{
    method:'POST',
    body: params,
  });
}

export async function addData(params) {
  return request(`${baseUrl}/rest/bdHolidaycl/add`,{
    method:'POST',
    body: params,
  });
}

export async function removenewdata(params) {
  return request(`${baseUrl}/rest/bdHolidaycl/delete`,{
    method:'POST',
    body: params,
  });
}
