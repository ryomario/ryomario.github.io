"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

type Props = {
  label: string
  href: string
  active?: boolean
}

export function AdminTabLink({
  label,
  href,
  active,
}: Props) {
  const pathname = usePathname()
  if(typeof active != 'boolean') {
    const paths = pathname.split('/').filter(path => !!path)
    const href_paths = href.split('/').filter(path => !!path)
    active = pathname.startsWith(href) && paths.length == href_paths.length
  }
  return <Link
    href={href}
    role="tab"
    className={[
      "inline-block p-4 border-b-2 rounded-t-lg",
      (active ? 
        'text-blue-600 border-blue-300 dark:text-blue-300'
        : 'hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
      ),
    ].join(' ')}
  >
    {label}
  </Link>
}