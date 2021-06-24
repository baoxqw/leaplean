import request from '@/utils/request';

const baseUrl = '/wookong';

export async function queryRout(params) {
  return request(`${baseUrl}/rest/bdTechnology/query`,{
    method:'POST',
    body: params,
  });
}

export async function addRout(params) {
  return request(`${baseUrl}/rest/bdTechnology/add`,{
    method:'POST',
    body: params,
  });
}

export async function deleteRout(params) {
  return request(`${baseUrl}/rest/bdTechnology/delete`,{
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



export async function childAddRout(params) {
  return request(`${baseUrl}/rest/bdTechnologyB/add`,{
    method:'POST',
    body: params,
  });
}


export async function genversionnoRout(params) {
  return request(`${baseUrl}/rest/bdTechnology/genversionno`,{
    method:'POST',
    body: params,
  });
}

export async function materialIdRout(params) {
  return request(`${baseUrl}/rest/bdTechnology/query`,{
    method:'POST',
    body: params,
  });
}

export async function addChild(params) {
  return request(`${baseUrl}/rest/bdTechnologyB/batchadd`,{
    method:'POST',
    body: params,
  });
}

export async function defaultRout(params) {
  return request(`${baseUrl}/rest/bdTechnology/setupdefaultversion`,{
    method:'POST',
    body: params,
  });
}

export async function isVersionRout(params) {
  return request(`${baseUrl}/rest/bdTechnology/querydefaultflagbymaterialid`,{
    method:'POST',
    body: params,
  });
}



export async function upload(params) {
  return request(`${baseUrl}/rest/attachment/upload`,{
    method:'POST',
    body: params,
  });
}



export async function uploadlist(params) {
  return request(`${baseUrl}/rest/attachment/queryByTypeandId`,{
    method:'POST',
    body: params,
  });
}


export async function fetchList(params) {
  return request(`${baseUrl}/rest/pm/queryattchment`,{
    method:'POST',
    body: params,
  });
}

export async function deleteend(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pm/delattachment`,{
    method:'POST',
    body: str,
  });
}
