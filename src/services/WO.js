import request from '@/utils/request';

const baseUrl = '/wookong';

export async function fetchTree(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/dept`,{
    method:'POST',
    body: str,
  });
}

export async function bussTree(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/industryModelingModel/query`,{
    method:'POST',
    body: str,
  });
}

export async function newdataList(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/industryModelingWork/queryConditions`,{
    method:'POST',
    body: str,
  });
}
export async function removeRoleBussiness(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/industryModelingWork/delete`,{
    method:'POST',
    body: str,
  });
}
export async function addRoleBussiness(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/industryModelingWork/add`,{
    method:'POST',
    body: str,
  });
}


export async function addsubapprove(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/industryModelingWork/sender`,{
    method:'POST',
    body: str,
  });
}
