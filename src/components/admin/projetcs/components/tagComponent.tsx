type Props = {
  tag: string
  onRemove?: () => void
  className?: string
}

export function TagComponent({
  tag,
  onRemove,
  className = '',
}: Props) {
  return (
    <span 
      className={
        `inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-gray-800 text-sm ${
          className
        }`
      }
    >
      {tag}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-2 text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      )}
    </span>
  )
}