import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // stop the browser from reloading the page
    setError('');
    try {
      const user = await login(email, password);
      // Admin goes to the admin dashboard, everyone else to the user dashboard
      navigate(user.userType === 'admin' ? '/admin' : '/rooms');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-5">
        <h2 className="mb-3">Login for the Account</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input className="form-control mb-3" type="email" placeholder="Email address"
            value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="form-control mb-3" type="password" placeholder="Password"
            value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button className="btn btn-primary w-100">Login</button>
        </form>
        <p className="mt-3">Don't have an account? <Link to="/signup">SignUp</Link></p>
      </div>
    </div>
  );
}
