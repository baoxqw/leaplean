import request from '@/utils/request';

const baseUrl = '/wookong';

export async function queryView(params) {
  return request(`${baseUrl}/rest/factory/genfactorystructure`,{
    method:'POST',
    body: params,
  });
}










