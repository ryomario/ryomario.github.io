import { useProjectTags } from "@/contexts/projectsContext"
import { IProject } from "@/types/IProject"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { TagComponent } from "./tagComponent"

type Props = {
  tags?: IProject['project_tags']
  onChange?: (tags: IProject['project_tags']) => void
}

export function InputProjectTags({
  tags = [],
  onChange = () => {},
}: Props) {
  const availableTags = useProjectTags()
  const [filteredSuggestions, setFilteredSuggestions] = useState<IProject['project_tags']>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  const {
    formState: { errors },
    control,
    resetField,
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
  } = useForm({
    defaultValues: {
      newTag: '',
      tags: tags,
    },
  })

  const inputValue = watch('newTag','')

  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'tags',
  })

  const suggestions = useMemo(() => availableTags.filter(({tag_name}) => fields.findIndex(t => tag_name == t.tag_name) == -1),[availableTags,fields])

  useEffect(() => {
    onChange(fields)
  },[fields])

  const onSubmit = handleSubmit(({ newTag }) => {
    append({ tag_name: newTag.trim() })
    setValue('newTag','')
  })
  
  useEffect(() => {
    // Filter suggestions based on input
    const filtered = inputValue 
    ? suggestions.filter(({tag_name:suggestion}) =>
      suggestion.toLowerCase().includes(inputValue.toLowerCase())
    )
    : suggestions;
    setFilteredSuggestions(filtered);
    setActiveSuggestion(0);
  }, [inputValue, suggestions]);

  useEffect(() => {
    // Handle clicks outside the component
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node) &&
          dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('newTag',e.target.value);
    setShowSuggestions(true);
  };
  
  const handleClick = (suggestion: string) => {
    setValue('newTag',suggestion);
    setFilteredSuggestions([]);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // CTRL + Space to show all suggestions
    if (e.ctrlKey && e.code === 'Space') {
      e.preventDefault();
      setFilteredSuggestions(suggestions);
      setShowSuggestions(true);
      return;
    }
    // Arrow down
    if (e.key === 'ArrowDown') {
      if (activeSuggestion < filteredSuggestions.length - 1) {
        setActiveSuggestion(activeSuggestion + 1);
      }
    }
    // Arrow up
    else if (e.key === 'ArrowUp') {
      if (activeSuggestion > 0) {
        setActiveSuggestion(activeSuggestion - 1);
      }
    }
    // Enter
    else if (e.key === 'Enter') {
      e.preventDefault();
      if(filteredSuggestions.length == 0 || !showSuggestions) {
        return onSubmit()
      }
      if (filteredSuggestions.length > 0) {
        setValue('newTag',filteredSuggestions[activeSuggestion].tag_name);
        setShowSuggestions(false);
      }
    }
    // Escape
    else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleFocus = () => {
    if (inputValue && filteredSuggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const inputId = useMemo(() => `project-tag-input-${Math.random().toString(36).substring(2, 9)}`,[])

  return <div className="mb-3">
    <label htmlFor={inputId}
      className={[
        "block mb-2 text-sm font-medium",
        (errors.newTag ? "text-red-700 dark:text-red-500":"text-gray-900 dark:text-white")
      ].join(' ')}>Project Tags</label>
    <div className="relative flex gap-2 mb-2">
      <input
        type="text"
        {...register('newTag', { required: true, validate: {
          checkNotExist: async (newTag, { tags }) => {
            if(!newTag.trim()) return 'Empty tag'
            if(tags.findIndex(({tag_name}) => tag_name == newTag.trim()) != -1) return `Tag "${newTag.trim()}" already exist!`
            return true
          }
        } })}
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        ref={inputRef}
        placeholder="Add a tag"
        className={[
          "border text-sm rounded-lg block w-full p-2.5",
          (errors.newTag ? 
            "bg-red-50 border-red-500 text-red-900 placeholder-red-400 focus:outline-red-500 dark:bg-gray-700 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
            : "bg-gray-50 border-gray-300 text-gray-900 dark:placeholder-gray-400 focus:outline-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:outline-blue-500 dark:focus:border-blue-500"
          )
        ].join(' ')}
        // Disable browser autocomplete
        autoComplete="off"
        // Additional attributes for maximum compatibility
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        // Random name/id to prevent browser from remembering
        name={inputId}
        id={inputId}
      />
      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul
          ref={dropdownRef}
          className="absolute top-full z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {filteredSuggestions.map(({tag_name: suggestion}, index) => (
            <li
              key={suggestion}
              onClick={() => handleClick(suggestion)}
              className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${
                index === activeSuggestion ? 'bg-blue-100' : ''
              }`}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
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
        <TagComponent
          key={id}
          tag={tag_name}
          onRemove={() => remove(index)}
        />
      ))}
    </div>
  </div>
}