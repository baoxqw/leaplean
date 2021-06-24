import request from '@/utils/request';

const baseUrl = '/wookong';

export async function queryStation(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/ppProductOrder/queryConditions`,{
    method:'POST',
    body: str,
  });
}
export async function findbom(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdBom/query`,{
    method:'POST',
    body: str,
  });
}
export async function findrout(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdTechnology/query`,{
    method:'POST',
    body: str,
  });
}


export async function addProder(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/ppProductOrder/add`,{
    method:'POST',
    body: str,
  });
}


export async function deleteProder(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/ppProductOrder/cancel`,{
    method:'POST',
    body: str,
  });
}

export async function materialIdRout(params) {
  return request(`${baseUrl}/rest/bdTechnology/query`,{
    method:'POST',
    body: params,
  });
}

export async function findChild(params) {
  return request(`${baseUrl}/rest/bdTechnologyB/query`,{
    method:'POST',
    body: params,
  });
}
export async function changest(params) {
  return request(`${baseUrl}/rest/ppProductOrder/setStatus`,{
    method:'POST',
    body: params,
  });
}



export async function batchadd(params) {
  return request(`${baseUrl}/rest/peProcessplan/batchadd`,{
    method:'POST',
    body: params,
  });
}

export async function fetchonPerson(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/ppProductOrder/delete`,{
    method:'POST',
    body: str,
  });
}

export async function addproduct(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/ppOrderReleasr/add`,{
    method:'POST',
    body: str,
  });
}
export async function findSmall(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/ppProductParts/query`,{
    method:'POST',
    body: str,
  });
}


export async function materailSet(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/ppProductOrder/queryPurchase`,{
    method:'POST',
    body: str,
  });
}

export async function fetchTest(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/QaUalityProblemHanding/queryPendingApproval`,{
    method:'POST',
    body: str,
  });
}



