import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function SignUp() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '', phone: '', userType: 'ordinary', adminCode: '',
  });
  const [error, setError] = useState('');

  // One handler for all inputs: uses the input's "name" to update the right field.
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      return setError('Password and confirm password do not match');
    }
    try {
      await signup(form);
      alert('Account created successfully');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-5">
        <h2 className="mb-3">Register for the Account</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input className="form-control mb-3" name="name" placeholder="Name"
            value={form.name} onChange={handleChange} required />
          <input className="form-control mb-3" name="email" type="email" placeholder="Email"
            value={form.email} onChange={handleChange} required />
          <input className="form-control mb-3" name="password" type="password" placeholder="Password (min 6 characters)"
            value={form.password} onChange={handleChange} required minLength={6} />
          <input className="form-control mb-3" name="confirmPassword" type="password" placeholder="Confirm password"
            value={form.confirmPassword} onChange={handleChange} required />
          <input className="form-control mb-3" name="phone" placeholder="Phone (10 digits)"
            value={form.phone} onChange={handleChange} required pattern="[0-9]{10}" />
          <select className="form-select mb-3" name="userType" value={form.userType} onChange={handleChange}>
            <option value="ordinary">Ordinary (customer)</option>
            <option value="admin">Admin</option>
          </select>
          {form.userType === 'admin' && (
            <input className="form-control mb-3" name="adminCode" type="password" placeholder="Admin code (given by the hotel owner)"
              value={form.adminCode} onChange={handleChange} required />
          )}
          <button className="btn btn-primary w-100">Register</button>
        </form>
        <p className="mt-3">Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}
