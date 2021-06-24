import request from '@/utils/request';


const baseUrl = '/wookong';

export async function addMaterial(params) {
  return request(`${baseUrl}/rest/bdInvcl/add`,{
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
export async function queryScheme(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdMaterialApply/query`,{
    method:'POST',
    body: str
  });
}
export async function fetchAdvice(params) {
  return request(`${baseUrl}/rest/approval/queryCommentsByProcessbyid`,{
    method:'POST',
    body: params,
  });
}
export async function detailcheck(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/approval/queryprocessbyid`,{
    method:'POST',
    body: str,
  });
}

export async function submitCheck(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdMaterialApply/approval`,{
    method:'POST',
    body: str,
  });
}
