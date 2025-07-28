import request from '@/utils/request'

/**
 *  数据生成问答对
 */


/**
 * 获取问答对列表
 * @param data
 * @returns {*}
 */

export function getList(data) {
  return request({
    url: '/generate/pairs/list',
    method: 'get',
    params: data
  })
}


/**
 * 问答对确认
 * @param data
 * @returns {*}
 */

export function confirm(data) {
  return request({
    url: '/generate/pairs/confirm',
    method: 'post',
    data: data
  })
}
