import request from '@/utils/request';

const baseUrl = '/wookong';

export async function queryEC(params) {
  return request(`${baseUrl}/rest/bdEquipmentcl/query`,{
    method:'POST',
    body: params,
  });
}

export async function addfile(params) {
  return request(`${baseUrl}/rest/pmContractH/batchadd`,{
    method:'POST',
    body: params,
  });
}

export async function addfilekehu(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/cubasdoc/batchadd`,{
    method:'POST',
    body: str,
  });
}

export async function addList(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdMaterialBase/batchadd`,{
    method:'POST',
    body: str,
  });
}

export async function addListBOm(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdBom/batchsave`,{
    method:'POST',
    body: str,
  });
}
