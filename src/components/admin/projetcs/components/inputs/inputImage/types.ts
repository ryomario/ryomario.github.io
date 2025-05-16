export type ImageType =  {
  file?: File
  preview?: string
}

export type ImageItem = {
  id: number
  image: ImageType
}

export type DragItem = {
  id: number
  index: number
  type: string
}

export const ItemTypes = {
  IMAGE: 'image',
}