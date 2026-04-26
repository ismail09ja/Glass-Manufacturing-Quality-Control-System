import { useState } from 'react';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Save, Key } from 'lucide-react';
import API from '../utils/api';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.put('/auth/profile', {
        name: formData.name,
        email: formData.email
      });
      setUser(data);
      localStorage.setItem('glass_qc_user', JSON.stringify(data));
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header title="My Profile" />
      <div className="page-header">
        <div>
          <h1>Profile Settings</h1>
          <p className="page-header-sub">Manage your account information and preferences</p>
        </div>
      </div>

      <div className="charts-grid" style={{ gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.5fr)' }}>
        {/* User Card */}
        <div className="glass-panel animate-in">
          <div className="panel-body" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div className="profile-avatar-large">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <h2 style={{ marginTop: 20 }}>{user?.name}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 30 }}>{user?.email}</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left' }}>
              <div className="info-item">
                <Shield size={16} />
                <span>Role: <strong>{user?.role}</strong></span>
              </div>
              <div className="info-item">
                <User size={16} />
                <span>ID: <code>{user?._id}</code></span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="glass-panel animate-in">
          <div className="panel-header">
            <h3>Update Information</h3>
          </div>
          <div className="panel-body">
            <form onSubmit={handleUpdateProfile}>
              <div className="form-group">
                <label>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--text-tertiary)' }} />
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    style={{ paddingLeft: 40 }}
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--text-tertiary)' }} />
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    style={{ paddingLeft: 40 }}
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                <Save size={18} /> {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .profile-avatar-large {
          width: 100px;
          height: 100px;
          background: var(--gradient-primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          font-weight: 800;
          color: white;
          margin: 0 auto;
          box-shadow: var(--shadow-glow-cyan);
        }
        .info-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: var(--bg-glass);
          border-radius: var(--radius-md);
          font-size: 14px;
        }
        .info-item svg {
          color: var(--accent-cyan);
        }
      `}} />
    </>
  );
};

export default ProfilePage;
