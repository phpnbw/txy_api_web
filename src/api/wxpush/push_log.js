import request from '@/utils/request'

//管理员添加
export function adminAdd(ruleForm) {
  return request({
    url: '/Admin/adminAdd',
    method: 'post',
    data: ruleForm
  })
}

//获取实例列表
export function pushLogList(params) {
  return request({
    url: 'Txy/hostList',
    method: 'get',
    params: params
  })
}

//获取可重装系统的列表
export function newOsList(params) {
  return request({
    url: 'Txy/osList',
    method: 'get',
    params: params
  })
}

//开机
export function osOpen(params) {
  return request({
    url: 'Txy/osOpen',
    method: 'get',
    params: params
  })
}

//关机
export function osClose(params) {
  return request({
    url: 'Txy/osClose',
    method: 'get',
    params: params
  })
}
//获取防火墙规则列表
export function firewallList(params) {
  return request({
    url: 'Txy/firewallList',
    method: 'get',
    params: params
  })
}
//删除指定防火墙规则
export function firewallDel(params) {
  return request({
    url: 'Txy/firewallDel',
    method: 'post',
    params: params
  })
}
//添加指定防火墙规则
export function firewallAdd(params) {
  return request({
    url: 'Txy/createFirewall',
    method: 'post',
    params: params
  })
}
//管理员详情
export function adminDetail(params) {
  return request({
    url: 'Admin/adminDetail',
    method: 'get',
    params: params
  })
}

//管理员编辑
export function adminEdit(ruleForm) {
  return request({
    url: 'Admin/adminEdit',
    method: 'put',
    data: ruleForm
  })
}

//管理员删除
export function adminDelete(ruleForm) {
  return request({
    url: 'Admin/adminDelete',
    method: 'delete',
    data: ruleForm
  })
}