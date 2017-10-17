const AWS_BUCKET = process.env.REACT_APP_AWS_BUCKET
const AWS_PREFIX = process.env.REACT_APP_IMAGES_PREFIX

const generateObjectImageUrls = (object) => {
  // temp fix for imageSecret missing on some images
  if (!object) {
    return {}
  }

  if (!object.imageSecret) {
    return object
  }

  const awsUrlWithoutProt = `s3.amazonaws.com/${AWS_BUCKET}/${AWS_PREFIX}`
  const awsUrl = `https://${awsUrlWithoutProt}`
  const newObject = Object.assign({}, object)

  newObject.imageUrlSmall = `${awsUrl}/${object.id}_${object.imageSecret}_n.jpg`
  newObject.imageUrlOriginal = `${awsUrl}/${object.id}_${object.imageOriginalSecret}_o.jpg`
  newObject.imageUrlForWufoo = `${awsUrlWithoutProt}/${object.id}_${object.imageOriginalSecret}`
  newObject.imageUrlLarge = `${awsUrl}/${object.id}_${object.imageSecret}_b.jpg`

  return newObject
}

const sanitizeEnsembleIndex = (object) => {
  let index = object.ensembleIndex

  object.ensembleIndex = index ? index.split(',')[0] : null

  return object
}

export const parseObject = (object) => {
  object = generateObjectImageUrls(object)
  object = sanitizeEnsembleIndex(object)

  return object
}
