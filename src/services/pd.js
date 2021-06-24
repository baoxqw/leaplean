import request from '@/utils/request';

const baseUrl = '/wookong';

export async function fetchTree(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/areacl`,{
    method:'POST',
    body: str,
  });
}

export async function newdataList(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/cubasdoc`,{
    method:'POST',
    body: str,
  });
}
export async function fetchPerson(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/psndoc`,{
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
export async function fetchPersonList(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/dept`,{
    method:'POST',
    body: str,
  });
}

export async function fetchPro(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/milestonenode/query`,{
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
export async function fetchProjectNode(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/projectmilestone/querybypidandtype`,{
    method:'POST',
    body: str,
  });
}

export async function fetchMerchant(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/areacl`,{
    method:'POST',
    body: str,
  });
}

export async function findMerchant(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/cubasdoc`,{
    method:'POST',
    body: str,
  });
}

export async function fetchContract(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pmContractH/query`,{
    method:'POST',
    body: str,
  });
}
