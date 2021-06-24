import request from '@/utils/request';

const baseUrl = '/wookong';

export async function fetchpReview(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/projectapproval/queryaudittaskbyuserid`,{
    method:'POST',
    body: str,
  });
}
export async function removeReview(params) {
  const str = JSON.stringify(params);
  return request(`/rest/projectreview/remove`,{
    method:'post',
    body: str,
  });
}

export async function reviewUpdate(params) {
  const str = JSON.stringify(params);
  return request(`/rest/projectreview/check`,{
    method:'POST',
    body: str,
  });
}

export async function detailcheck(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/approval/queryprocessbyid`,{
    method:'POST',
    body: str,
  });
}
//提交意见
export async function subresult(params){
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/approval/agree`,{
    method:'POST',
    body:str
  })
}

export async function subrefuse(params){
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/approval/reject`,{
    method:'POST',
    body:str
  })
}
