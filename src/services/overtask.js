import request from '@/utils/request';

const baseUrl = '/wookong';

export async function queryStation(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/qaOverdueRetest/query`,{
    method:'POST',
    body: str,
  });
}


export async function addself(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/qaOverdueRetest/add`,{
    method:'POST',
    body: str,
  });
}
export async function deleteSelf(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/qaOverdueRetest/delete`,{
    method:'POST',
    body: str,
  });
}
export async function childFetch(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/qaTestProject/query`,{
    method:'POST',
    body: str,
  });
}
export async function addchild(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/qaTestProject/add`,{
    method:'POST',
    body: str,
  });
}
export async function deleteChild(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/qaTestProject/delete`,{
    method:'POST',
    body: str,
  });
}
