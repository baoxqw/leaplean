import request from '@/utils/request';
import { stringify } from 'qs';
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

export async function subapprove2(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/QaUalityProblemHanding/sender2`,{
    method:'POST',
    body: str
  });
}

export async function fetchVerify(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/approval/queryaudittaskbyuserid`,{
    method:'POST',
    body: str
  });
}

export async function queryRoleUser(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/wxminiprogram/sm/role/role_user`,{
    method:'POST',
    body: str
  });
}

export async function lookDetail(params) {
  return request(`${baseUrl}/createProcessDiagramPic?processId=${params.processId}`);
}
export async function fetchMataQu(params) {
  return request(`${baseUrl}/rest/bdMaterialBase/queryConditions`,{
    method:'POST',
    body: params,
  });
}

export async function matypeQu(params) {
  return request(`${baseUrl}/rest/bdInvcl/query`,{
    method:'POST',
    body: params,
  });
}
