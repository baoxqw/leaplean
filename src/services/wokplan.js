import request from '@/utils/request';

const baseUrl = '/wookong';

export async function setStatus(params) {
  return request(`${baseUrl}/rest/peProcessplan/setbanzu`,{
    method:'POST',
    body: params,
  });}
