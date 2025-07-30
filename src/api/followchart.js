import service from "../utils/request";
import request from "@/utils/request";

// 关键词
// const path = process.env.VUE_APP_ENV === "production"? "" : "/api";
const path = "";

//  -分页列表查询
export function getList(data) {
  return service({
    url: path + "/flow/page",
    method: "post",
    data,
  });
}

//  -列表查询
export function getListAll(data) {
  return service({
    url: path + "/prompt/listAll",
    method: "post",
    data,
  });
}

//  详情
export function getDetail(data) {
  return service({
    url: path + "/patentSearch/detail",
    method: "post",
    data,
  });
}


//  编辑
export function editOne(data) {
  return service({
    url: path + "/prompt/edit",
    method: "post",
    data,
  });
}


//  更新状态
export function updateStatus(data) {
  return service({
    url: path + "/prompt/updateStatus",
    method: "post",
    data,
  });
}

//  增加
export function addOne(data) {
  return service({
    url: path + "/flow/add",
    method: "post",
    data,
  });
}

//  批量删除
export function deleteAll(ids) {
  return service({
    url: path + "/flow/delete",
    method: "POST",
    data: {
      ids: ids
    },
  });
}

//  删除
export function deleteOne(id) {
  return service({
    url: path + "/prompt/delete?id=" + id,
    method: "DELETE",
  });
}


//  根据id查询
export function queryById(id) {
  return service({
    url: path + "/prompt/queryById?id=" + id,
    method: "get",
  });
}

//  复制
export function promptCopy(params) {
  return service({
    url: path + "/prompt/copy",
    method: "get",
    params
  });
}

//  状态列表
export function getStatus(params) {
  return service({
    url: path + "/flow/status",
    method: "get",
    params
  });
}

//  查看流程图
export function getPlanById(id) {
  return service({
    url: path + `/flow/show/${id}`,
    method: "get",
  });
}
//  查看审核意见
export function getComment(id) {
  return service({
    url: path + `/flow/comment/${id}`,
    method: "get",
  });
}
//  提交流程图
export function getCommit(planId) {
  return service({
    url: path + `/flow/commit/${planId}`,
    method: "get",
  });
}

//  审核方案
export function review(data) {
  return service({
    url: path + `/flow/audit`,
    method: "post",
    data,
  });
}

//会话历史记录
export function   getHistoryList(data) {
  return request({
    url: `/flow/assistant`,
    method: "post",
    data,
    // responseType: "blob"
  });
}

//保存流程图
export function  saveFlow(data) {
  return request({
    url: `/flow/save`,
    method: "post",
    data,
    // responseType: "blob"
  });
}
