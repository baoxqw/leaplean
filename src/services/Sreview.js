import request from '@/utils/request';

const baseUrl = '/wookong';

export async function queryStation(params) {
  return request(`${baseUrl}/rest/bdStation/queryConditions`,{
    method:'POST',
    body: params,
  });
}

export async function addStation(params) {
  return request(`${baseUrl}/rest/bdStation/add`,{
    method:'POST',
    body: params,
  });
}

export async function deleteStation(params) {
  return request(`${baseUrl}/rest/bdStation/delete`,{
    method:'POST',
    body: params,
  });
}

export async function queryArea(params) {
  return request(`${baseUrl}/rest/bdProductionregion/queryConditions`,{
    method:'POST',
    body: params,
  });
}



export async function fetchVerify(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/QaUalityProblemHanding/queryPendingApproval`,{
    method:'POST',
    body: str
  });
}



export async function submitCheck(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/QaUalityProblemHanding/approval2`,{
    method:'POST',
    body: str
  });
}



