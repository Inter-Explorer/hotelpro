import { useEffect, useState } from 'react';
import { api } from '../api.js';

// "All Users" tab: every registered user.
export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/auth/users').then(setUsers).catch((err) => setError(err.message));
  }, []);

  return (
    <>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-light">
            <tr><th>Name</th><th>Email</th><th>Phone</th><th>Type</th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td><td>{u.email}</td><td>{u.phone}</td><td>{u.userType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
