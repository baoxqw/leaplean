import request from '@/utils/request';

const baseUrl = '/wookong';



export async function fetchBM(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pmInvoiceH/query`,{
    method:'POST',
    body: str,
  });
}

export async function addBM(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pmInvoiceH/add`,{
    method:'POST',
    body: str,
  });
}

export async function updateBM(params) {
  const str = JSON.stringify(params);
  return request(`/rest/bm/update`,{
    method:'POST',
    body: str,
  });
}

export async function deleteBM(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pmInvoiceH/delete`,{
    method:'POST',
    body: str,
  });
}

export async function fetchClientTree(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/areacl`,{
    method:'POST',
    body: str,
  });
}
export async function findClientTable(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/cubasdoc`,{
    method:'POST',
    body: str,
  });
}

export async function fetchDept(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/dept`,{
    method:'POST',
    body: str,
  });
}

export async function findPerson(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/psndoc`,{
    method:'POST',
    body: str,
  });
}

export async function findId(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pmInvoiceB/query`,{
    method:'POST',
    body: str,
  });
}

export async function childadd(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pmInvoiceB/add`,{
    method:'POST',
    body: str,
  });
}

export async function deleteChild(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pmInvoiceB/delete`,{
    method:'POST',
    body: str,
  });
}

export async function fetchProject(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/projectapproval/query`,{
    method:'POST',
    body: str,
  });
}
