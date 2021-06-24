import request from '@/utils/request';

const baseUrl = '/wookong';

export async function fetchpApproval(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/projectapproval/query`,{
    method:'POST',
    body: str,
  });
}
export async function removeApproval(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/projectapproval/remove`,{
    method:'POST',
    body: str,
  });
}

export async function approvalAdd(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/projectapproval/add`,{
    method:'POST',
    body: str,
  });
}
export async function fetchProjectNode(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/projectmilestone/querybypidandtype`,{
    method:'POST',
    body: str,
  });
}

export async function fetchMarketNode(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/projectmilestone/querybypidandtype`,{
    method:'POST',
    body: str,
  });
}
export async function proAdd(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/milestone/add`,{
    method:'POST',
    body: str,
  });
}

export async function deleteNode(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/projectmilestone/remove`,{
    method:'POST',
    body: str,
  });
}

export async function endHandle(params) {
  const str = JSON.stringify(params);

  return request(`${baseUrl}/rest/projectapproval/commit`,{
    method:'POST',
    body: str,
  });
}
