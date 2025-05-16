"use client"

import { useRouter } from "next/navigation"
import { FormInputProject } from "../components/formInputProject"

export function AddProjectSection() {
  const router = useRouter()
  return (
    <div className="relative overflow-hidden">
      <header className="flex items-center">
        <button
          className="flex items-center text-gray-600 hover:text-gray-900"
          onClick={() => router.back()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </button>
        <h1 className="text-xl font-semibold ml-4">Add Project</h1>
      </header>
      <main className="mt-8">
        <FormInputProject
          onSaved={() => router.push('/admin/projects')}
        />
      </main>
    </div>
  )
}