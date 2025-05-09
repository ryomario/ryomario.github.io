import { useCallback, useEffect, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"

type Props = {
  tags?: { tag_name: string }[]
  onChange?: (tags: { tag_name: string }[]) => void
}

export function InputProjectTags({
  tags = [],
  onChange = () => {},
}: Props) {
  const {
    clearErrors,
    formState: { errors },
    setError,
    control,
    watch,
    resetField,
    register,
    handleSubmit,
  } = useForm({
    defaultValues: {
      newTag: '',
      tags: tags,
    },
  })

  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'tags',
  })
  useEffect(() => {
    onChange(fields)
  },[fields])

  const onSubmit = handleSubmit(({ newTag }) => {
    append({ tag_name: newTag.trim() })
    resetField('newTag')
  })

  const newTag = watch('newTag')

  useEffect(() => {
    remove(0)
  }, [remove])

  return <div className="mb-3">
    <label htmlFor="project-tag"
      className={[
        "block mb-2 text-sm font-medium",
        (errors.newTag ? "text-red-700 dark:text-red-500":"text-gray-900 dark:text-white")
      ].join(' ')}>Project Tags</label>
    <div className="flex gap-2 mb-2">
      <input
        id="project-tag"
        type="text"
        {...register('newTag', { required: true, validate: {
          checkNotExist: async (newTag, { tags }) => {
            if(!newTag.trim()) return 'Empty tag'
            if(tags.findIndex(({tag_name}) => tag_name == newTag.trim()) != -1) return `Tag "${newTag.trim()}" already exist!`
            return true
          }
        } })}
        onKeyDown={e => e.code == 'Enter' && onSubmit()}
        placeholder="Add a tag"
        className={[
          "border text-sm rounded-lg block w-full p-2.5",
          (errors.newTag ? 
            "bg-red-50 border-red-500 text-red-900 placeholder-red-400 focus:outline-red-500 dark:bg-gray-700 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
            : "bg-gray-50 border-gray-300 text-gray-900 dark:placeholder-gray-400 focus:outline-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:outline-blue-500 dark:focus:border-blue-500"
          )
        ].join(' ')}
      />
      <button
        type="button"
        onClick={onSubmit}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Add
      </button>
    </div>
    {errors.newTag && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.newTag.message}</p>}
    <div className="flex flex-wrap gap-2">
      {fields.map(({tag_name, id}, index) => (
        <span 
          key={id}
          className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm"
        >
          {tag_name}
          <button
            type="button"
            onClick={() => remove(index)}
            className="ml-2 text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </span>
      ))}
    </div>
  </div>
}