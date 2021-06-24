import request from '@/utils/request';

const baseUrl = '/wookong';

export async function Processperson(params) {
  return request(`${baseUrl}/rest/peProcessperson/batchadd`,{
    method:'POST',
    body: params,
  });
}
