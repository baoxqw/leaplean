import request from '@/utils/request';
// 代理路径
const baseUrl = '/wookong';
// 假数据接口


export async function queryScheme(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/qaUalityProblemHanding/query`,{
    method:'POST',
    body: str
  });
}
export async function childFetch(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/qaUalityProblemHandingB/query`,{
    method:'POST',
    body: str
  });
}

export async function fetchList(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/QualityIssuesProcessController/one`,{
    method:'POST',
    body: str
  });
}

export async function subapprove(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/QaUalityProblemHanding/sender`,{
    method:'POST',
    body: str
  });
}

export async function fetchVerify(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/QaUalityProblemHanding/queryPendingApproval`,{
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
  return request(`${baseUrl}/rest/QaUalityProblemHanding/approval`,{
    method:'POST',
    body: str,
  });
}

export async function fetchProcessId(params){
  return request(`${baseUrl}/rest/approval/querytaskIdbyprocessInstanceId/${params.id}`)
}
