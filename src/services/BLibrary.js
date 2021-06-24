import request from '@/utils/request';

const baseUrl = '/wookong';

export async function queryBatch(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdScmBatchcode/queryConditions`,{
    method:'POST',
    body: str,
  });
}
export async function adddevice(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdScmBatchcode/add`,{
    method:'POST',
    body: str,
  });
}

export async function removedevice(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdScmBatchcode/delete`,{
    method:'POST',
    body: str,
  });
}







