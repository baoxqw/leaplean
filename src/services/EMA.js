import request from '@/utils/request';

const baseUrl = '/wookong';

export async function fetchRepairPiece(params) {
  return request(`${baseUrl}/rest/emSpareparts/query`,{
    method:'POST',
    body: params,
  });
}
export async function addpeice(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/emSpareparts/add`,{
    method:'POST',
    body: str,
  });
}

export async function deletepeice(params) {
  return request(`${baseUrl}/rest/emSpareparts/delete`,{
    method:'POST',
    body: params,
  });
}

