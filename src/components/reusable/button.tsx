import { Link } from "@/i18n/routing"

type Props = {
  text: string
  label?: string
  href?: string
}

export function Button({ text, label = "Button", href }: Props) {
  const className = "text-md font-general-medium bg-indigo-500 hover:bg-indigo-600 text-white shadow-sm rounded-md sm:mx-4 px-5 py-2.5 duration-300"

  return (<>
    {href ? <Link className={className} href={href} aria-label={label}>
      {text}
    </Link> : <button className={className} aria-label={label}>
      {text}
    </button>}
  </>
  )
}