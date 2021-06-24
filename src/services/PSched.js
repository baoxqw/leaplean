import request from '@/utils/request';

const baseUrl = '/wookong';

export async function fetchanly(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/peProcessplan/queryorperson`,{
    method:'POST',
    body: str,
  });
}


export async function fetchTeam(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/peProcessplan/queryorteam`,{
    method:'POST',
    body: str,
  });
}





