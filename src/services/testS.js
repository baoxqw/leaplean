import request from '@/utils/request';

const baseUrl = '/wookong';

export async function queryStation(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/qaExamine/query`,{
    method:'POST',
    body: str,
  });
}


export async function addself(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/qaExamine/add`,{
    method:'POST',
    body: str,
  });
}
export async function deleteSelf(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/qaExamine/delete`,{
    method:'POST',
    body: str,
  });
}
export async function childFetch(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/qaExamineProject/query`,{
    method:'POST',
    body: str,
  });
}
export async function addchild(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/qaExamineProject/add`,{
    method:'POST',
    body: str,
  });
}
export async function deleteChild(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/qaExamineProject/delete`,{
    method:'POST',
    body: str,
  });
}
