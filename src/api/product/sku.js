import request from '@/utils/request'

export const reqSpuImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })

export const reqSpuSaleAttr = (spuId) => request({ url: `/admin/product/spuSaleAttrList/${spuId}`, method: 'get' })

export const reqAttrInfoList = (category1Id, category2Id, category3Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' })

export const reqSaveSkuFormData = (skuInfo) => request({ url: '/admin/product/saveSkuInfo', method: 'post', data: skuInfo })

export const reqFindBySpuId = (spuId) => request({ url: `/admin/product/findBySpuId/${spuId}`, method: 'get' })

export const reqGetSkuData = (page, limit) => request({ url: `/admin/product/list/${page}/${limit}`, method: 'get' })

export const reqCancelSale = (skuId) => request({ url: `/admin/product/cancelSale/${skuId}`, method: 'get' })

export const reqOnSale = (skuId) => request({ url: `/admin/product/onSale/${skuId}`, method: 'get' })

export const reqGetSkuById = (skuId) => request({ url: `/admin/product/getSkuById/${skuId}`, method: 'get' })

export const reqDeleteSku = (skuId) => request({ url: `/admin/product/deleteSku/${skuId}`, method: 'delete' })
