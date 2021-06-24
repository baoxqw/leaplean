import request from '@/utils/request';

const baseUrl = '/wookong';

export async function queryTeam(params) {
  return request(`${baseUrl}/rest/bdTeam/query`,{
    method:'POST',
    body: params,
  });
}
export async function fetchDept(params) {
  return request(`${baseUrl}/rest/bd/dept`,{
    method:'POST',
    body: params,
  });
}
export async function teamAdd(params) {
  return request(`${baseUrl}/rest/bdTeam/add`,{
    method:'POST',
    body: params,
  });
}

export async function teamDelete(params) {
  return request(`${baseUrl}/rest/bdTeam/delete`,{
    method:'POST',
    body: params,
  });
}
