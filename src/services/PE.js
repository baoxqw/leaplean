import request from '@/utils/request';

const baseUrl = '/wookong';

export async function tree(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/ppProjectPlan/queryTraceability`,{
    method:'POST',
    body: str,
  });
}


export async function findChild(params) {
    const str = JSON.stringify(params);
    return request(`${baseUrl}/rest/ppProjectPlan/queryProjectCode`,{
      method:'POST',
      body: str,
    });
  }


export async function TaskCode(params) {
    const str = JSON.stringify(params);
    return request(`${baseUrl}/rest/ppProjectPlan/queryTaskCode`,{
      method:'POST',
      body: str,
    });
  }
  
  export async function findRight(params) {
    const str = JSON.stringify(params);
    return request(`${baseUrl}/rest/ppProjectPlan/queryTraceabilityTask`,{
      method:'POST',
      body: str,
    });
  }
  
  export async function findRightPlan(params) {
    const str = JSON.stringify(params);
    return request(`${baseUrl}/rest/ppProjectPlan/queryPlanTask`,{
      method:'POST',
      body: str,
    });
  }

  
  export async function findRightTask(params) {
    const str = JSON.stringify(params);
    return request(`${baseUrl}/rest/ppProjectPlan/queryBomTask`,{
      method:'POST',
      body: str,
    });
  }
  
  export async function findRightAll(params) {
    const str = JSON.stringify(params);
    return request(`${baseUrl}/rest/ppTaskManagement/query`,{
      method:'POST',
      body: str,
    });
  }




  



  
