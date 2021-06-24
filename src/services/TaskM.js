import request from '@/utils/request';

const baseUrl = '/wookong';

export async function queryTask(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/ppTaskManagement/queryConditions`,{
    method:'POST',
    body: str,
  });
}


export async function childSourceQuery(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/ppTaskManagement/querySource`,{
    method:'POST',
    body: str,
  });
}

export async function addMerge(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/ppTaskManagement/mergeId`,{
    method:'POST',
    body: str,
  });
}

export async function workList(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/ppTaskManagement/query`,{
    method:'POST',
    body: str,
  });
}

export async function childFetchProduct(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/ppTaskManagement/productList`,{
    method:'POST',
    body: str,
  });
}

export async function addLower(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/ppProductOrder/addTask`,{
    method:'POST',
    body: str,
  });
}
export async function changeStatus(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/ppTaskManagement/setTaskStatus`,{
    method:'POST',
    body: str,
  });
}