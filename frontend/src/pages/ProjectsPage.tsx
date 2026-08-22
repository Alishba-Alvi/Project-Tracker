import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  useGetMyProjectsQuery,
  useCreateProjectMutation,
  useLogoutUserMutation,
} from '../app/api'

function ProjectsPage() {
  const { data: projects, isLoading, error } = useGetMyProjectsQuery()
  const [createProject, { isLoading: isCreating, error: createError }] =
    useCreateProjectMutation()
  const [logoutUser] = useLogoutUserMutation()

  const [key, setKey] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createProject({ key, name, description }).unwrap()
      setKey('')
      setName('')
      setDescription('')
    } catch (err) {
      // error state already captured by createError
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>Your Projects</h1>
        <button onClick={() => logoutUser()}>Log out</button>
      </div>

      <h2>Create a project</h2>
      <form onSubmit={handleCreate}>
        <div>
          <label>Key (2-5 uppercase letters)</label>
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value.toUpperCase())}
            maxLength={5}
            required
          />
        </div>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        {createError && (
          <p style={{ color: 'red' }}>
            Could not create project — check the key is unique and correctly
            formatted.
          </p>
        )}
        <button type="submit" disabled={isCreating}>
          {isCreating ? 'Creating...' : 'Create Project'}
        </button>
      </form>

      <h2>Existing projects</h2>
      {isLoading && <p>Loading projects...</p>}
      {error && <p style={{ color: 'red' }}>Failed to load projects.</p>}
      {projects && projects.length === 0 && <p>You have no projects yet.</p>}
      {projects && projects.length > 0 && (
        <ul>
          {projects.map((project) => (
            <li key={project.id}>
              <strong>{project.key}</strong> — {project.name}
              {project.description && <p>{project.description}</p>}
              <Link to={`/projects/${project.id}/members`}>Manage members</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ProjectsPage
