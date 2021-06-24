import request from '@/utils/request';

const baseUrl = '/wookong';

export async function queryLine(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdProductionline/query`,{
    method:'POST',
    body: str,
  });
}
export async function queryDuty(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/qaInspectionTask/query`,{
    method:'POST',
    body: str,
  });
}
export async function deleteSelf(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/qaInspectionTask/delete`,{
    method:'POST',
    body: str,
  });
}
export async function addself(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/qaInspectionTask/add`,{
    method:'POST',
    body: str,
  });
}
export async function sourcefetch(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/qaInspectionSample/query`,{
    method:'POST',
    body: str,
  });
}
export async function addsource(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/qaInspectionSample/add`,{
    method:'POST',
    body: str,
  });
}
export async function childFetch(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/qaInspectionData/query`,{
    method:'POST',
    body: str,
  });
}
export async function addbook(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/qaInspectionData/add`,{
    method:'POST',
    body: str,
  });
}
export async function deleteChild(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/qaInspectionData/delete`,{
    method:'POST',
    body: str,
  });
}
export async function deleteSource(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/qaInspectionSample/delete`,{
    method:'POST',
    body: str,
  });
}
export async function addproject(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/qaCheckItem/add`,{
    method:'POST',
    body: str,
  });
}
export async function fetchproject(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/qaCheckItem/query`,{
    method:'POST',
    body: str,
  });
}
export async function deleteproject(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/qaCheckItem/delete`,{
    method:'POST',
    body: str,
  });
}
export async function addFile(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pm/updateprojectwithattachment`,{
    method:'POST',
    body: params,
  });
}
export async function fetchList(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pm/queryattchment`,{
    method:'POST',
    body: params,
  });
}

export async function deleteend(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pm/delattachment`,{
    method:'POST',
    body: str,
  });
}
export async function addProList(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/qaInspectionSample/batchadd`,{
    method:'POST',
    body: str,
  });
}











