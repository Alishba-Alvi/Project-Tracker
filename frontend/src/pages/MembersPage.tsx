import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  useGetProjectMembersQuery,
  useAddProjectMemberMutation,
  useRemoveProjectMemberMutation,
  useLazySearchUserByEmailQuery,
} from '../app/api';

function MembersPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: members, isLoading, error } = useGetProjectMembersQuery(projectId!);
  const [addMember, { isLoading: isAdding, error: addError }] = useAddProjectMemberMutation();
  const [removeMember] = useRemoveProjectMemberMutation();
  const [searchUser, { data: foundUser, isFetching: isSearching, error: searchError }] =
    useLazySearchUserByEmailQuery();

  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'lead' | 'member' | 'viewer'>('member');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchUser(email);
  };

  const handleAdd = async () => {
    if (!foundUser) return;
    try {
      await addMember({ projectId: projectId!, userId: foundUser.id, projectRole: role }).unwrap();
      setEmail('');
    } catch (err) {
      // handled by addError
    }
  };

  const handleRemove = async (targetUserId: string) => {
    try {
      await removeMember({ projectId: projectId!, userId: targetUserId }).unwrap();
    } catch (err) {
      alert('Could not remove this member — you may not have permission, or they may be the last Lead.');
    }
  };

  return (
    <div>
      <Link to="/projects">← Back to projects</Link>
      <h1>Project Members</h1>

      {isLoading && <p>Loading members...</p>}
      {error && <p style={{ color: 'red' }}>Failed to load members (you may not have access to this project).</p>}

      {members && (
        <ul>
          {members.map((m) => (
            <li key={m.id}>
              {m.userId} — {m.projectRole}{' '}
              <button onClick={() => handleRemove(m.userId)}>Remove</button>
            </li>
          ))}
        </ul>
      )}

      <h2>Add a member</h2>
      <form onSubmit={handleSearch}>
        <div>
          <label>Search by email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isSearching}>
          {isSearching ? 'Searching...' : 'Search'}
        </button>
      </form>

      {searchError && <p style={{ color: 'red' }}>No user found with that email.</p>}

      {foundUser && (
        <div>
          <p>
            Found: <strong>{foundUser.name}</strong> ({foundUser.email})
          </p>
          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value as typeof role)}>
            <option value="lead">Lead</option>
            <option value="member">Member</option>
            <option value="viewer">Viewer</option>
          </select>
          <button onClick={handleAdd} disabled={isAdding}>
            {isAdding ? 'Adding...' : `Add ${foundUser.name} to project`}
          </button>
          {addError && <p style={{ color: 'red' }}>Could not add member — they may already be in this project.</p>}
        </div>
      )}
    </div>
  );
}

export default MembersPage;