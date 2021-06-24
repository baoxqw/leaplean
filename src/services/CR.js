import request from '@/utils/request';

const baseUrl = '/wookong';

export async function fetchCA(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/projectcloseout/onaudit/query`,{
    method:'POST',
    body: str,
  });
}

export async function addself(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/ppCodeRule/add`,{
    method:'POST',
    body: str,
  });
}


export async function fetch(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/ppCodeRule/query`,{
    method:'POST',
    body: str,
  });
}

export async function remove(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/ppCodeRule/delete`,{
    method:'POST',
    body: str,
  });
}


