import request from "@/utils/request";

/**
 *
 *  任务给规划
 */


//大模型对话
export function chatBot(data) {
  return request({
    url: `/assistant/conversation`,
    method: "post",
    data,
    // responseType: "blob"
  });
}



//会话列表
export function getList(params) {
  return request({
    url: `/assistant/list`,
    method: "get",
    params,
    // responseType: "blob"
  });
}

//会话历史记录
export function getHistoryList(data) {
  return request({
    url: `/assistant/page`,
    method: "post",
    data,
    // responseType: "blob"
  });
}



//语音输入
export function upVoice(data) {
  return request({
    url: `/assistant/voice`,
    method: "post",
    data,
    // responseType: "blob"
  });
}

//语音指令
export function voiceToCommand(data) {
  return request({
    url: `/assistant/command`,
    method: "post",
    data,
    // responseType: "blob"
  });
}



//删除会话历史记录
export function deleteMeet(data) {
  return request({
    url: `/assistant/delete`,
    method: "post",
    data,
    // responseType: "blob"
  });
}


//删除单条会话历史记录
export function deleteRecord(data) {
  return request({
    url: `/assistant/delete/record`,
    method: "post",
    data,
  });
}

