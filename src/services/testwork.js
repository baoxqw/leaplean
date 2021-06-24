import request from '@/utils/request';

const baseUrl = '/wookong';

export async function queryStation(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/qaTestTask/query`,{
    method:'POST',
    body: str,
  });
}


export async function addself(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/qaTestTask/add`,{
    method:'POST',
    body: str,
  });
}
export async function deleteSelf(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/qaTestTask/delete`,{
    method:'POST',
    body: str,
  });
}
export async function childFetch(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/qaRecordTestData/query`,{
    method:'POST',
    body: str,
  });
}
export async function addchild(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/qaRecordTestData/add`,{
    method:'POST',
    body: str,
  });
}
export async function deleteChild(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/qaRecordTestData/delete`,{
    method:'POST',
    body: str,
  });
}

export async function addsample(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/qaSampleInformation/add`,{
    method:'POST',
    body: str,
  });
}
export async function fetchsample(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/qaSampleInformation/query`,{
    method:'POST',
    body: str,
  });
}
export async function deletesample(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/qaSampleInformation/delete`,{
    method:'POST',
    body: str,
  });
}
export async function deletetype(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/qaTestType/delete`,{
    method:'POST',
    body: str,
  });
}
export async function deletedevice(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/qaTestEquipment/delete`,{
    method:'POST',
    body: str,
  });
}


export async function addtestdate(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/qaTestType/batchadd`,{
    method:'POST',
    body: str,
  });
}
export async function addtestdevice(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/qaTestEquipment/batchadd`,{
    method:'POST',
    body: str,
  });
}
export async function fetchtestdate(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/qaTestType/query`,{
    method:'POST',
    body: str,
  });
}
export async function fetchdevice(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/qaTestEquipment/query`,{
    method:'POST',
    body: str,
  });
}
