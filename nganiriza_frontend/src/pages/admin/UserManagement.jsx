import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import apiClient from '../../utils/apiClient';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    loadUsers();
  }, [page, searchTerm, roleFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        page_size: 20,
      };
      if (searchTerm) {
        params.search = searchTerm;
      }
      if (roleFilter) {
        params.role = roleFilter;
      }

      const response = await apiClient.get('/api/admin/users/', { params });
      setUsers(response.data.results || []);
      setTotalCount(response.data.count || 0);
    } catch (error) {
      console.error('Failed to load users:', error);
      setFeedback({ type: 'error', text: 'Failed to load users' });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (id) => {
    try {
      const response = await apiClient.get(`/api/admin/users/${id}/`);
      setSelectedUser(response.data);
    } catch (error) {
      console.error('Failed to load user details:', error);
      setFeedback({ type: 'error', text: 'Failed to load user details' });
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin':
        return 'admin-badge admin-badge-danger';
      case 'specialist':
        return 'admin-badge admin-badge-success';
      default:
        return 'admin-badge';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const totalPages = Math.ceil(totalCount / 20);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>User Management</h1>
          <p>View and manage all users in the system</p>
        </div>
      </div>

      {feedback && (
        <div className={`admin-feedback ${feedback.type}`}>
          {feedback.text}
        </div>
      )}

      <div className="admin-page-content">
        <div className="admin-filters-row">
          <div className="admin-search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="admin-filter-select"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="specialist">Specialist</option>
            <option value="user">User</option>
          </select>
        </div>

        {loading ? (
          <div className="admin-loading">Loading users...</div>
        ) : users.length > 0 ? (
          <>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Last Login</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.full_name || `${user.first_name} ${user.last_name}`.trim() || user.username}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={getRoleBadgeClass(user.role)}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        {user.is_active ? (
                          <span className="admin-badge admin-badge-success">Active</span>
                        ) : (
                          <span className="admin-badge admin-badge-warning">Inactive</span>
                        )}
                      </td>
                      <td>{formatDate(user.date_joined)}</td>
                      <td>{formatDate(user.last_login) || 'Never'}</td>
                      <td>
                        <button
                          onClick={() => handleViewDetails(user.id)}
                          className="admin-btn-icon"
                          aria-label="View user details"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="admin-pagination">
                <button
                  onClick={() => setPage(prev => Math.max(1, prev - 1))}
                  disabled={page === 1}
                  className="admin-btn-pagination"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={20} />
                  Previous
                </button>
                <span className="admin-pagination-info">
                  Page {page} of {totalPages} ({totalCount} total users)
                </span>
                <button
                  onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={page === totalPages}
                  className="admin-btn-pagination"
                  aria-label="Next page"
                >
                  Next
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="admin-empty-state">
            <p>No users found</p>
          </div>
        )}
      </div>

      {selectedUser && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <div className="admin-modal-header">
              <h2>User Details</h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="admin-modal-close"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="admin-modal-body">
              <div className="admin-detail-grid">
                <div>
                  <label>ID</label>
                  <p>{selectedUser.id}</p>
                </div>
                <div>
                  <label>Username</label>
                  <p>{selectedUser.username}</p>
                </div>
                <div>
                  <label>Full Name</label>
                  <p>{selectedUser.full_name || `${selectedUser.first_name} ${selectedUser.last_name}`.trim() || 'N/A'}</p>
                </div>
                <div>
                  <label>Email</label>
                  <p>{selectedUser.email}</p>
                </div>
                <div>
                  <label>Role</label>
                  <p>
                    <span className={getRoleBadgeClass(selectedUser.role)}>
                      {selectedUser.role}
                    </span>
                  </p>
                </div>
                <div>
                  <label>Status</label>
                  <p>
                    {selectedUser.is_active ? (
                      <span className="admin-badge admin-badge-success">Active</span>
                    ) : (
                      <span className="admin-badge admin-badge-warning">Inactive</span>
                    )}
                  </p>
                </div>
                <div>
                  <label>Is Staff</label>
                  <p>{selectedUser.is_staff ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <label>Is Superuser</label>
                  <p>{selectedUser.is_superuser ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <label>Date Joined</label>
                  <p>{formatDate(selectedUser.date_joined)}</p>
                </div>
                <div>
                  <label>Last Login</label>
                  <p>{formatDate(selectedUser.last_login) || 'Never'}</p>
                </div>
              </div>
              <div className="admin-modal-actions">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="admin-btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;

