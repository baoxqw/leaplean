import request from '@/utils/request';

const baseUrl = '/wookong';

export async function fetchPrepareList(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/ppProjectPlan/queryConditions`,{
    method:'POST',
    body: str,
  });
}

export async function addlist(params) {
    const str = JSON.stringify(params);
    return request(`${baseUrl}/rest/ppProjectPlan/add`,{
      method:'POST',
      body: str,
    });
  }


  export async function fetchMata(params) {
    const str = JSON.stringify(params);
    return request(`${baseUrl}/rest/industryModelingWork/query`,{
      method:'POST',
      body: str,
    });
  }

  export async function addself(params) {
    const str = JSON.stringify(params);
    return request(`${baseUrl}/rest/ppProjectPlan/add`,{
      method:'POST',
      body: str,
    });
  }

  export async function deleteSelf(params) {
    const str = JSON.stringify(params);
    return request(`${baseUrl}/rest/ppProjectPlan/delete`,{
      method:'POST',
      body: str,
    });
  }

  export async function childFetch(params) {
    const str = JSON.stringify(params);
    return request(`${baseUrl}/rest/ppProjectPlanList/query`,{
      method:'POST',
      body: str,
    });
  }
  export async function newdataType(params) {
    const str = JSON.stringify(params);
    return request(`${baseUrl}/rest/industryModelingModel/query`,{
      method:'POST',
      body: str,
    });
  }
  export async function addchild(params) {
    const str = JSON.stringify(params);
    return request(`${baseUrl}/rest/ppProjectPlanList/add`,{
      method:'POST',
      body: str,
    });
  }

  export async function deleteChild(params) {
    const str = JSON.stringify(params);
    return request(`${baseUrl}/rest/ppProjectPlanList/delete`,{
      method:'POST',
      body: str,
    });
  }


  export async function fetchWork(params) {
    const str = JSON.stringify(params);
    return request(`${baseUrl}/rest/emStageProject/query`,{
      method:'POST',
      body: str,
    });
  }

  export async function childFetchProject(params) {
    const str = JSON.stringify(params);
    return request(`${baseUrl}/rest/emStageProjectB/query`,{
      method:'POST',
      body: str,
    });
  }

  export async function childFetchProjectStage(params) {
    const str = JSON.stringify(params);
    return request(`${baseUrl}/rest/ppProjectPlanStage/query`,{
      method:'POST',
      body: str,
    });
  }

  export async function addStation(params) {
    const str = JSON.stringify(params);
    return request(`${baseUrl}/rest/ppProjectPlan/pmrp`,{
      method:'POST',
      body: str,
    });
  }

  export async function addNeed(params) {
    const str = JSON.stringify(params);
    return request(`${baseUrl}/rest/ppProjectPlan/balance`,{
      method:'POST',
      body: str,
    });
  }

  export async function addselfStage(params) {
    const str = JSON.stringify(params);
    return request(`${baseUrl}/rest/ppProjectPlanStage/add`,{
      method:'POST',
      body: str,
    });
  }

  export async function newdataDept(params) {
    const str = JSON.stringify(params);
    return request(`${baseUrl}/rest/bd/dept`,{
      method:'POST',
      body: str,
    });
  }


  export async function findPlan(params) {
    const str = JSON.stringify(params);
    return request(`${baseUrl}/rest/ppProjectPlan/queryCode`,{
      method:'POST',
      body: str,
    });
  }
