import { useRef } from "react"
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { DragItem, ImageType, ItemTypes } from "./types"

type ImageItemProps = {
  id: string
  image: ImageType
  index: number
  moveImage: (dragIndex: number, hoverIndex: number) => void
  removeImage: () => void
}

export function ImageItem({
  id,
  image,
  index,
  moveImage,
  removeImage,
}: ImageItemProps) {
  const ref = useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.IMAGE,
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop<DragItem, void, unknown>({
    accept: ItemTypes.IMAGE,
    hover(item, monitor) {
      if (!ref.current) return;
      
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      
      if (!clientOffset) return;
      
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveImage(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  })

  drag(drop(ref))

  return (
    <div
      ref={ref}
      className={`relative group rounded-lg overflow-hidden shadow-md transition-transform ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
      style={{ cursor: 'move' }}
    >
      <img 
        src={image.preview ?? '/images/placeholder-image.jpg'} 
        alt={`preview-${image.file?.name ?? "placeholder-image.jpg"}`}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
        <span className="text-white text-md font-bold bg-black bg-opacity-50 rounded-full px-3 py-1 truncate">
          {id}
        </span>
      </div>
      <button
        type="button"
        onClick={removeImage}
        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>
    </div>
  )
}
