import request from '@/utils/request';

const baseUrl = '/wookong';

export async function queryRole(params) {
  return request(`${baseUrl}/rest/bdOperation/query`,{
    method:'POST',
    body: params,
  });
}










