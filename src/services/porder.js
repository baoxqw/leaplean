import request from '@/utils/request';

const baseUrl = '/wookong';

export async function addWuLiao(params) {
  return request(`${baseUrl}/rest/bdMaterialBase/add`,{
    method:'POST',
    body: params,
  });
}
export async function addPersonal(params) {
  return request(`${baseUrl}/rest/bd/psndoc/save`,{
    method:'POST',
    body: params,
  });
}


export async function findNum(params) {
  return request(`${baseUrl}/rest/ppProductOrder/queryMinTreeSub`,{
    method:'POST',
    body: params,
  });
}

export async function materailIssue(params) {
  return request(`${baseUrl}/rest/ppProductOrder/setMaterialDemand`,{
    method:'POST',
    body: params,
  });
}