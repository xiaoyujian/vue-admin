import request from '@/utils/request'

export const reqSpuList = (page, limit, category3Id) => request({ url: `/admin/product/${page}/${limit}`, method: 'get', params: { category3Id } })

export const reqSpuById = (spuId) => request({ url: `/admin/product/getSpuById/${spuId}`, method: 'get' })

export const reqTrademarkList = () => request({ url: '/admin/product/baseTrademark/getTrademarkList', method: 'get' })

export const reqSpuImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })

export const reqBaseSaleAttrList = () => request({ url: '/admin/product/baseSaleAttrList', method: 'get' })

export const reqAddOrUpdateSpu = (spuInfo) => {
  if (spuInfo.id) {
    return request({ url: `/admin/product/updateSpuInfo`, data: spuInfo, method: 'post' })
  } else {
    return request({ url: `/admin/product/saveSpuInfo`, data: spuInfo, method: 'post' })
  }
}

export const reqDelete = (spuId) => request({ url: `/admin/product/deleteSpu/${spuId}`, method: 'delete' })
