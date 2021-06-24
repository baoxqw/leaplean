import request from '@/utils/request';

const baseUrl = '/wookong';

export async function queryRole(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdBom/query`,{
    method:'POST',
    body: str,
  });
}


export async function matype(params) {
  return request(`${baseUrl}/rest/bdInvcl/query`,{
    method:'POST',
    body: params,
  });
}


export async function findversion(params) {
  return request(`${baseUrl}/rest/bdBom/genversionno`,{
    method:'POST',
    body: params,
  });
}


export async function findbomlist(params) {
  return request(`${baseUrl}/rest/bdBom/query`,{
    method:'POST',
    body: params,
  });
}

export async function matypeinfor(params) {
  return request(`${baseUrl}/rest/bdInvcl/query`,{
    method:'POST',
    body: params,
  });
}
export async function fetchWork(params) {
  return request(`${baseUrl}/rest/bdWorkcenter/query`,{
    method:'POST',
    body: params,
  });
}

export async function fetchUnit(params) {
  return request(`${baseUrl}/rest/bdUcum/query`,{
    method:'POST',
    body: params,
  });
}


export async function addbom(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdBom/add`,{
    method:'POST',
    body: str,
  });
}

export async function deletebom(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdBom/delete`,{
    method:'POST',
    body: str,
  });
}

export async function fetchchild(params) {
  return request(`${baseUrl}/rest/bdBomB/query`,{
    method:'POST',
    body: params,
  });
}


export async function subti(params) {
  return request(`${baseUrl}/rest/bdBomB/batchadd`,{
    method:'POST',
    body: params,
  });
}
export async function fetchbomchild(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdBomB/query`,{
    method:'POST',
    body: str,
  });
}

export async function addchild(params) {
  return request(`${baseUrl}/rest/bdBomB/add`,{
    method:'POST',
    body: params,
  });
}


export async function deletechild(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdBomB/delete`,{
    method:'POST',
    body: str,
  });
}

export async function findrouttable(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdTechnology/query`,{
    method:'POST',
    body: str,
  });
}
export async function fetchbom(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdBom/query`,{
    method:'POST',
    body: str,
  });
}

export async function fetchbomtree(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdBom/query`,{
    method:'POST',
    body: str,
  });
}

export async function findbomtable(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdBom/query`,{
    method:'POST',
    body: str,
  });
}

export async function fetchbomall(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdBom/query`,{
    method:'POST',
    body: str,
  });
}

export async function finddefault(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdBom/querydefaultflagbymaterialid`,{
    method:'POST',
    body: str,
  });
}

export async function defaultChange(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdBom/setupdefaultversion`,{
    method:'POST',
    body: str,
  });
}
export async function fetchchildTwo(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdBomB/querywithbomid`,{
    method:'POST',
    body: str,
  });
}
export async function fetchMata(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdTechnology/querybyid`,{
    method:'POST',
    body: str,
  });
}

export async function fetchroutmater(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdInvcl/query`,{
    method:'POST',
    body: str,
  });
}
export async function fetchrout(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdTechnology/query`,{
    method:'POST',
    body: str,
  });
}

export async function findroutChild(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdTechnologyB/query`,{
    method:'POST',
    body: str,
  });
}

export async function fetchList(params) {
  return request(`${baseUrl}/rest/pm/queryattchment`,{
    method:'POST',
    body: params,
  });
}


export async function findVersion(params) {
  return request(`${baseUrl}/rest/bdBom/queryVersion`,{
    method:'POST',
    body: params,
  });
}