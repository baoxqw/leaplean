import request from '@/utils/request';

const baseUrl = '/wookong';

export async function fetchneed(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdMaterialDemand/query`,{
    method:'POST',
    body: str,
  });
}

export async function deleteneed(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdMaterialDemand/delete`,{
    method:'POST',
    body: str,
  });
}

export async function finddept(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/dept`,{
    method:'POST',
    body: str,
  });
}

export async function addneed(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdMaterialDemand/add`,{
    method:'POST',
    body: str,
  });
}

export async function fetchapproval(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdMaterialApply/query`,{
    method:'POST',
    body: str,
  });
}

export async function addapproval(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdMaterialApply/add`,{
    method:'POST',
    body: str,
  });
}

export async function fetchapprovalchild(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdMaterialApplyB/query`,{
    method:'POST',
    body: str,
  });
}

export async function TableChildData(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdMaterialApplyB/query`,{
    method:'POST',
    body: str,
  });
}

export async function deleteapproval(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdMaterialApply/delete`,{
    method:'POST',
    body: str,
  });
}

export async function addapprovalchild(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdMaterialApplyB/add`,{
    method:'POST',
    body: str,
  });
}

export async function deleteapprovalchild(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdMaterialApplyB/delete`,{
    method:'POST',
    body: str,
  });
}

export async function generateA(params) {
  return request(`${baseUrl}/rest/bdMaterialApply/add`,{
    method:'POST',
    body: params,
  });
}

export async function generateB(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdMaterialApplyB/batchadd`,{
    method:'POST',
    body: str,
  });
}

export async function addBaveDemand(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdMaterialDemand/batchadd`,{
    method:'POST',
    body: str,
  });
}

export async function fetchdispatch(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdMaterialDistribution/query`,{
    method:'POST',
    body: str,
  });
}
export async function adddispatch(params) {
  return request(`${baseUrl}/rest/bdMaterialDistribution/add`,{
    method:'POST',
    body: params,
  });
}
export async function deletedispatch(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdMaterialDistribution/delete`,{
    method:'POST',
    body: str,
  });
}

export async function fetchdispatchchild(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdMaterialDistributionB/query`,{
    method:'POST',
    body: str,
  });
}
export async function adddispatchchild(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdMaterialDistributionB/add`,{
    method:'POST',
    body: str,
  });
}

export async function adddispatchchildbatchadd(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdMaterialDistributionB/batchadd`,{
    method:'POST',
    body: str,
  });
}

export async function childBatchAdd(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdMaterialDistributionB/batchadd`,{
    method:'POST',
    body: str,
  });
}
export async function deletedispatchchild(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdMaterialDistributionB/delete`,{
    method:'POST',
    body: str,
  });
}

export async function TableSuperData(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdMaterialApply/query`,{
    method:'POST',
    body: str,
  });
}

export async function findChildData(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdMaterialApplyB/querybyid`,{
    method:'POST',
    body: str,
  });
}

export async function fetchstorage(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdWarehousing/query`,{
    method:'POST',
    body: str,
  });
}

export async function addstorage(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdWarehousing/add`,{
    method:'POST',
    body: str,
  });
}

export async function fetchstoragechild(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdWarehousingB/query`,{
    method:'POST',
    body: str,
  });
}
export async function addstoragechild(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdWarehousingB/add`,{
    method:'POST',
    body: str,
  });
}

export async function addneedBatch(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdMaterialDemand/batchadd`,{
    method:'POST',
    body: str,
  });
}
export async function deletestoragechild(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdWarehousingB/delete`,{
    method:'POST',
    body: str,
  });
}
export async function deletestorage(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdWarehousing/delete`,{
    method:'POST',
    body: str,
  });
}
export async function fetchstock(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdExistingStock/query`,{
    method:'POST',
    body: str,
  });
}

export async function addstock(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdExistingStock/add`,{
    method:'POST',
    body: str,
  });
}
export async function deletestock(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdExistingStock/delete`,{
    method:'POST',
    body: str,
  });
}

export async function findlocation(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdLocationFile/query`,{
    method:'POST',
    body: str,
  });
}
export async function addpie(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdDistributionList/add`,{
    method:'POST',
    body: str,
  });
}

export async function pailiaopiliang(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdDistributionList/batchadd`,{
    method:'POST',
    body: str,
  });
}

export async function kuwei(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdLocationFile/query`,{
    method:'POST',
    body: str,
  });
}
export async function queryStationWork(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdStation/query`,{
    method:'POST',
    body: str,
  });
}
export async function fetchbook(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdExistingStock/liushuizhang`,{
    method:'POST',
    body: str,
  });
}

export async function fetchaspx(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdExistingStock/taizhang`,{
    method:'POST',
    body: str,
  });
}

export async function addsave(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdExistingStock/add`,{
    method:'POST',
    body: str,
  });
}

export async function addsaveList(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdExistingStock/batchadd`,{
    method:'POST',
    body: str,
  });
}

export async function saveList(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdExistingStock/batchadd`,{
    method:'POST',
    body: str,
  });
}

export async function addsavenew(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdExistingStock/materialadd`,{
    method:'POST',
    body: str,
  });
}

export async function addsaveout(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdExistingStock/wareadd`,{
    method:'POST',
    body: str,
  });
}
export async function saveListNew(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdExistingStock/warebatchadd`,{
    method:'POST',
    body: str,
  });
}

export async function fetchstockend(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdExistingStock/amount`,{
    method:'POST',
    body: str,
  });
}

export async function approvalList(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdMaterialApplyB/batchadd`,{
    method:'POST',
    body: str,
  });
}

export async function addsubapprove(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdMaterialApply/sender`,{
    method:'POST',
    body: str,
  });
}

export async function fetchStockRedis(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdExistingStock/queryRedis`,{
    method:'POST',
    body: str,
  });
}



