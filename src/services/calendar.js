import request from '@/utils/request';

const baseUrl = '/wookong';



export async function newdata(params) {
  return request(`${baseUrl}/rest/bdMaterialBase/query`,{
    method:'POST',
    body: params,
  });
}

export async function calendarAdd(params) {
  return request(`${baseUrl}/rest/bdWorkcalendar/add`,{
    method:'POST',
    body: params,
  });
}


export async function ruleadd(params) {
  return request(`${baseUrl}/rest/bdWorkcalendrule/add`,{
    method:'POST',
    body: params,
  });
}


export async function detailadd(params) {
  return request(`${baseUrl}/rest/bdWorkcalendardate/add`,{
    method:'POST',
    body: params,
  });
}

export async function calendarFetch(params) {
  return request(`${baseUrl}/rest/bdWorkcalendar/query`,{
    method:'POST',
    body: params,
  });
}

export async function calendarDelete(params) {
  return request(`${baseUrl}/rest/bdWorkcalendar/delete`,{
    method:'POST',
    body: params,
  });
}


export async function fetchType(params) {
  return request(`${baseUrl}/rest/bdHolidaycl/query`,{
    method:'POST',
    body: params,
  });
}

export async function fetchWork(params) {
  return request(`${baseUrl}/rest/bdWorkcalendrule/query`,{
    method:'POST',
    body: params,
  });
}

export async function detailAdd(params) {
  return request(`${baseUrl}/rest/bdWorkcalendar/add`,{
    method:'POST',
    body: params,
  });
}

export async function detailBir(params) {
  return request(`${baseUrl}/rest/bdWorkcalendar/generate`,{
    method:'POST',
    body: params,
  });
}
export async function addDefinition(params) {
  return request(`${baseUrl}/rest/bdHoliday/add`,{
    method:'POST',
    body: params,
  });
}
export async function findCalend(params) {
  return request(`${baseUrl}/rest/bdWorkcalendardate/query`,{
    method:'POST',
    body: params,
  });
}

export async function workcalendardate(params) {
  return request(`${baseUrl}/rest/bdWorkcalendardate/add`,{
    method:'POST',
    body: params,
  });
}
export async function addchild(params) {
  return request(`${baseUrl}/rest/bdWorkcalendardetails/add`,{
    method:'POST',
    body: params,
  });
}
export async function childFetch(params) {
  return request(`${baseUrl}/rest/bdWorkcalendardetails/query`,{
    method:'POST',
    body: params,
  });
}
export async function deleteChild(params) {
  return request(`${baseUrl}/rest/bdWorkcalendardetails/delete`,{
    method:'POST',
    body: params,
  });
}
