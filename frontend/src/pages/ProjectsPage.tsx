import { useLogoutUserMutation } from '../app/api';

function ProjectsPage() {
  const [logoutUser] = useLogoutUserMutation();

  return (
    <div>
      <h1>Projects (coming soon)</h1>
      <button onClick={() => logoutUser()}>Log out</button>
    </div>
  );
}

export default ProjectsPage;