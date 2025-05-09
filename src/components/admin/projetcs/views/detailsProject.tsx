import { useEffect, useState } from "react"
import { Modal } from "../components/modal"
import { IProject } from "@/types/IProject"
import * as RepoProjects_server from "@/db/repositories/RepoProjects.server"
import { date2string } from "@/lib/date"

type Props = {
  project_id: number
  open: boolean
  onClose?: () => void
}

export function TableAdminProjectDetails({
  project_id,
  open,
  onClose = () => {},
}: Props) {
  const [project, setProject] = useState<IProject|null>(null)
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if(open) {
      RepoProjects_server.getOne(project_id).then(data => setProject(data))
        .catch(() => setProject(null))
    }
  },[open,project_id])

  return <>
    <Modal
      open={open}
      onClose={onClose}
      clickOutside
      title="Details Project"
      actions={<>
        {/* @TODO redirect to edit form */}
        <button onClick={onClose} type="button" className="py-2.5 px-5 bg-blue-600 text-white text-sm font-medium rounded-lg focus:outline-none border border-gray-200 hover:bg-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 transition-colors">
          Edit
        </button>
        {/* @TODO delete project */}
        <button onClick={onClose} type="button" className="ms-2 py-2.5 px-5 bg-gray-100 text-red-600 text-sm font-medium rounded-lg focus:outline-none border border-gray-200 hover:bg-gray-200 focus:z-10 focus:ring-4 focus:ring-gray-100 transition-colors">
          Delete
        </button>
      </>}
    >
      {project && <>
        {/* Header */}
        <header className="mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-2 text-sm text-gray-600">
            <span className={`px-2 py-1 rounded-md text-xs font-semibold uppercase ${
              project.published 
                ? 'bg-green-100 text-green-800' 
                : 'bg-amber-100 text-amber-800'
            }`}>
              {project.published ? 'Published' : 'Draft'}
            </span>
            <span className="text-sm">
              Created: {date2string(project.createdAt, false)}
            </span>
            <span className="text-sm">
              Updated: {date2string(project.updatedAt, false)}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{project.project_title}</h1>
        </header>
        {/* Preview Image */}
        {project.project_preview && (
          <div className="my-6">
            <img 
              src={project.project_preview}
              alt={`Preview of ${project.project_title}`}
              className="max-w-full max-h-80 object-contain rounded-lg shadow-sm border border-gray-200"
            />
          </div>
        )}
        {/* Tags Section */}
        {project.project_tags.length > 0 && (
          <div className="my-6">
            <div className="flex flex-wrap gap-2">
              {project.project_tags.map(tag => (
                <span 
                  key={tag.tag_name}
                  className="inline-block px-2.5 py-0.5 bg-gray-200 rounded-full text-xs text-gray-700"
                >
                  #{tag.tag_name}
                </span>
              ))}
            </div>
          </div>
        )}
        {/* Description Section */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">Description</h2>
          <div className="text-gray-700 text-sm leading-relaxed space-y-3">
            {project.project_desc.split('\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      </>}
    </Modal>
  </>
}