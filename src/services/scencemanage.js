import request from '@/utils/request';

const baseUrl = '/wookong';

export async function queryLine(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdProductionline/query`,{
    method:'POST',
    body: str,
  });
}











