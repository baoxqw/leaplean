import request from '@/utils/request';

const baseUrl = '/wookong';



export async function queryWorktype(params) {
  return request(`${baseUrl}/rest/bdWorkcalendardate/query`,{
    method:'POST',
    body: params,
  });
}


export async function deletedetail(params) {
  return request(`${baseUrl}/rest/bdWorkcalendardate/delete`,{
    method:'POST',
    body: params,
  });
}
