import request from '@/utils/request';

const baseUrl = '/wookong';

export async function queryStation(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/ppProductOrder/query`,{
    method:'POST',
    body: str,
  });
}

export async function findChild(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/peProcessplan/query`,{
    method:'POST',
    body: str,
  });
}
export async function fetchtablechild(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/peProcessplan/queryMids`,{
    method:'POST',
    body: str,
  });
}
export async function fetchtable(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/peTechprocesscard/query`,{
    method:'POST',
    body: str,
  });
}

export async function addteamsource(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/peProcessplanTeam/batchadd`,{
    method:'POST',
    body: str,
  });
}
export async function addSuperData(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/peProcessplan/setarrstatus`,{
    method:'POST',
    body: str,
  });
}

export async function setStatus(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/peProcessplan/setstepstatus`,{
    method:'POST',
    body: str,
  });
}

export async function changeSuper(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/peTechprocesscard/setarrstatus`,{
    method:'POST',
    body: str,
  });
}

export async function deleteSuper(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/peProcessplan/delete`,{
    method:'POST',
    body: str,
  });
}
export async function updateSuper(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/peProcessplan/add`,{
    method:'POST',
    body: str,
  });
}
export async function findprocess(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/peProcessplan/add`,{
    method:'POST',
    body: str,
  });
}
export async function findprocessSuper(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/peProcessplan/queryperson`,{
    method:'POST',
    body: str,
  });
}
export async function findprocessChild(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/peProcessplan/queryperson`,{
    method:'POST',
    body: str,
  });
}

export async function findlist(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/peTechprocesscard/queryliucheng`,{
    method:'POST',
    body: str,
  });
}

export async function findIssuesDetail(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/peProcessplan/qualityissues`,{
    method:'POST',
    body: str,
  });
}
export async function addissuesword(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/qaUalityProblemHanding/add`,{
    method:'POST',
    body: str,
  });
}



export async function addmethods(params) {
  return request(`${baseUrl}/rest/peProcessplan/querystatus`,{
    method:'POST',
    body: params,
  });
}
export async function addmodel(params) {
  return request(`${baseUrl}/rest/peProcessplan/querystatus`,{
    method:'POST',
    body: params,
  });
}
export async function endmethods(params) {
  return request(`${baseUrl}/rest/peProcessperson/updatestatus`,{
    method:'POST',
    body: params,
  });
}

export async function findworking(params) {
  return request(`${baseUrl}/rest/peProcessperson/querytask`,{
    method:'POST',
    body: params,
  });
}

export async function changemethods(params) {
  return request(`${baseUrl}/rest/ppProductOrder/setTime`,{
    method:'POST',
    body: params,
  });
}

export async function checklist(params) {
  return request(`${baseUrl}/rest/peProcessplan/process`,{
    method:'POST',
    body: params,
  });
}

export async function fetchFileList(params) {
  return request(`${baseUrl}/rest/pm/queryattchment`,{
    method:'POST',
    body: params,
  });
}









