import request from '@/utils/request';

const baseUrl = '/wookong';

export async function fetchpNetfund(params) {
  const str = JSON.stringify(params);
  return request(`/rest/fetchpNetfund/query`,{
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
