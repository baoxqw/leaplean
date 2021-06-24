import request from '@/utils/request';

const baseUrl = '/wookong';



export async function queryHoliday(params) {
  return request(`${baseUrl}/rest/bdHoliday/query`,{
    method:'POST',
    body: params,
  });
}

export async function deleteHoliday(params) {
  return request(`${baseUrl}/rest/bdHoliday/delete`,{
    method:'POST',
    body: params,
  });
}
export async function findHoliday(params) {
  return request(`${baseUrl}/rest/bdHoliday/query`,{
    method:'POST',
    body: params,
  });
}
