import request from '@/utils/request';

const baseUrl = '/wookong';

export async function fetchPrepareList(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/ppProjectPlan/query`,{
    method:'POST',
    body: str,
  });
}


  



  
