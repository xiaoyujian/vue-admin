import request from '@/utils/request'

export const reqTradeMarkList = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' })

export const reqAddTrademark = (tmForm) => request({ url: '/admin/product/baseTrademark/save', data: tmForm, method: 'post' })

export const reqUpdateTrademark = (tmForm) => request({ url: '/admin/product/baseTrademark/update', data: tmForm, method: 'put' })

export const reqDeleteTrademark = (id) => request({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'delete' })
