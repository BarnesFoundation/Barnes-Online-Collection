import bodybuilder from 'bodybuilder'
import { BARNES_SETTINGS } from './barnesSettings'
import { META_TITLE } from './constants'

export const getArtObjectUrlFromId = (objectId, slug) => {
  slug = slug || ''

  return `/objects/${objectId}/${slug}`
}

export const getMetaTagsFromObject = (object) => {
  const metaTitle = `${META_TITLE} — ${object.culture || object.people}: ${object.title}`
  const metaImage = object.imageUrlSmall

  if (!object || !object.id) {
    return null
  }

  return {
    title: metaTitle,
    image: metaImage
  }
}

export const getObjectRequestBody = (object) => {
  let body = bodybuilder()
    .filter('exists', 'imageSecret')
    .from(0).size(25)

  return body
}

export const getObjectsRequestBody = (fromIndex = 0) => {
  let body = bodybuilder()
    .sort('_score', 'desc')
    .filter('exists', 'imageSecret')
    .from(fromIndex).size(BARNES_SETTINGS.size)
  return body
}
