import request from '@/utils/request';

const baseUrl = '/wookong';



export async function queryWorktype(params) {
  return request(`${baseUrl}/rest/bdWorkcalendrule/query`,{
    method:'POST',
    body: params,
  });
}

export async function deleterule(params) {
  return request(`${baseUrl}/rest/bdWorkcalendrule/delete`,{
    method:'POST',
    body: params,
  });
}

export async function newdata(params) {
  return request(`${baseUrl}/rest/bdWorkcalendrule/query`,{
    method:'POST',
    body: params,
  });
}
