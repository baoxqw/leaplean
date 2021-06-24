import request from '@/utils/request';

const baseUrl = '/wookong';

export async function fetchpProcess(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/projectapproval/query`,{
    method:'POST',
    body: str,
  });
}

export async function fetchpHistoryProcess(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/historyprocess/query`,{
    method:'POST',
    body: str,
  });
}
export async function removeProcess(params) {
  const str = JSON.stringify(params);
  return request(`/rest/projectprocess/remove`,{
    method:'delete',
    body: str,
  });
}


export async function fetchBosom(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/projectmilestone/querybypidandtype`,{
    method:'POST',
    body: str,
  });
}

export async function hismarketFetch(params) {
  const str = JSON.stringify(params);
  return request(`/rest/hismarket/query`,{
    method:'POST',
    body: str,
  });
}
export async function updateProcess(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/updateProcess/add`,{
    method:'POST',
    body: str,
  });
}

export async function addProject(params) {
  return request(`${baseUrl}/rest/projectmilestone/add`,{
    method:'POST',
    body: params,
  });
}
export async function newProject(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/projectapproval/query`,{
    method:'POST',
    body: str,
  });
}
export async function addMarketProject(params) {
  return request(`/rest/marketingmilestone/add`,{
    method:'POST',
    body: params,
  });
}

export async function endApplication(params) {
  return request(`${baseUrl}/rest/pmProjectBcloseout/addwithattachment`,{
    method:'POST',
    body: params,
  });
}
export async function fetchPro(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/projectmilestone/queryunsubmitbypidandtype`,{
    method:'POST',
    body: str,
  });
}

export async function endhandle(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/projectapproval/commit`,{
    method:'POST',
    body: str,
  });
}

export async function endhandleMarket(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/projectapproval/commit`,{
    method:'POST',
    body: str,
  });
}

export async function endhandleSub(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/projectapproval/commit`,{
    method:'POST',
    body: str,
  });
}
