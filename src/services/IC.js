import request from '@/utils/request';

const baseUrl = '/wookong';



export async function queryMaterial(params) {
  return request(`${baseUrl}/rest/bdInvcl/query`,{
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