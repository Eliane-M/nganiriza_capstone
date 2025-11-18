import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, MapPin, Search, X } from 'lucide-react';
import AdminMapView from '../../assets/components/admin/AdminMapView';
import apiClient from '../../utils/apiClient';

const MapManagement = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProvider, setEditingProvider] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'clinic',
    phone: '',
    province: '',
    district: '',
    sector: '',
    open_hours: '',
    verified: false,
    latitude: null,
    longitude: null,
  });

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/admin/service-providers/');
      setProviders(response.data || []);
    } catch (error) {
      console.error('Failed to load providers:', error);
      setFeedback({ type: 'error', text: 'Failed to load clinics' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleMapClick = (position) => {
    setSelectedPosition(position);
    // Round to 6 decimal places to match backend DecimalField(max_digits=9, decimal_places=6)
    setFormData(prev => ({
      ...prev,
      latitude: parseFloat(position[0].toFixed(6)),
      longitude: parseFloat(position[1].toFixed(6))
    }));
    setShowForm(true);
    setEditingProvider(null);
  };

  const handleClinicClick = (clinic) => {
    handleEdit(clinic);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    if (!editingProvider && (!formData.latitude || !formData.longitude)) {
      setFeedback({ type: 'error', text: 'Please click on the map to select a location' });
      return;
    }

    try {
      // Round coordinates to 6 decimal places
      const lat = formData.latitude || editingProvider?.latitude;
      const lng = formData.longitude || editingProvider?.longitude;
      
      const payload = {
        ...formData,
        latitude: lat ? parseFloat(parseFloat(lat).toFixed(6)) : null,
        longitude: lng ? parseFloat(parseFloat(lng).toFixed(6)) : null,
      };

      if (editingProvider) {
        await apiClient.patch(`/api/admin/service-providers/${editingProvider.id}/update/`, payload);
        setFeedback({ type: 'success', text: 'Clinic updated successfully' });
      } else {
        await apiClient.post('/api/admin/service-providers/create/', payload);
        setFeedback({ type: 'success', text: 'Clinic added successfully' });
      }
      
      setShowForm(false);
      setEditingProvider(null);
      setSelectedPosition(null);
      setFormData({
        name: '',
        type: 'clinic',
        phone: '',
        province: '',
        district: '',
        sector: '',
        open_hours: '',
        verified: false,
        latitude: null,
        longitude: null,
      });
      loadProviders();
    } catch (error) {
      setFeedback({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to save clinic' 
      });
    }
  };

  const handleEdit = (provider) => {
    setEditingProvider(provider);
    setFormData({
      name: provider.name || '',
      type: provider.type || 'clinic',
      phone: provider.phone || '',
      province: provider.province || '',
      district: provider.district || '',
      sector: provider.sector || '',
      open_hours: provider.open_hours || '',
      verified: provider.verified || false,
      latitude: provider.latitude || provider.position?.[0] || null,
      longitude: provider.longitude || provider.position?.[1] || null,
    });
    if (provider.position) {
      setSelectedPosition(provider.position);
    }
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this clinic?')) {
      return;
    }

    try {
      await apiClient.delete(`/api/admin/service-providers/${id}/delete/`);
      setFeedback({ type: 'success', text: 'Clinic deleted successfully' });
      loadProviders();
    } catch (error) {
      setFeedback({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to delete clinic' 
      });
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProvider(null);
    setSelectedPosition(null);
    setFormData({
      name: '',
      type: 'clinic',
      phone: '',
      province: '',
      district: '',
      sector: '',
      open_hours: '',
      verified: false,
      latitude: null,
      longitude: null,
    });
  };

  const filteredProviders = providers.filter(provider =>
    provider.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const clinicTypes = ['clinic', 'hotline', 'counselor', 'NGO', 'hospital', 'youth clinic'];

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Map Management</h1>
          <p>Add and manage health clinics and service providers</p>
        </div>
      </div>

      {feedback && (
        <div className={`admin-feedback ${feedback.type}`}>
          {feedback.text}
        </div>
      )}

      <div className="admin-map-management-layout">
        <div className="admin-map-section">
          <div className="admin-map-header">
            <h3>Click on the map to add a clinic</h3>
            <p>Click anywhere on the map to set the clinic location</p>
          </div>
          <div className="admin-map-wrapper">
            <AdminMapView
              clinics={providers}
              onClinicClick={handleClinicClick}
              onMapClick={handleMapClick}
              selectedPosition={selectedPosition}
            />
          </div>
        </div>

        <div className="admin-clinics-list-section">
          <div className="admin-search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search clinics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="admin-loading">Loading clinics...</div>
          ) : filteredProviders.length > 0 ? (
            <div className="admin-clinics-list">
              {filteredProviders.map((provider) => (
                <div key={provider.id} className="admin-clinic-item">
                  <div className="admin-clinic-item-info">
                    <h4>{provider.name}</h4>
                    <p className="admin-clinic-item-type">{provider.type}</p>
                    {provider.open_hours && (
                      <p className="admin-clinic-item-hours">{provider.open_hours}</p>
                    )}
                  </div>
                  <div className="admin-clinic-item-actions">
                    <button
                      onClick={() => handleEdit(provider)}
                      className="admin-btn-icon"
                      aria-label="Edit clinic"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(provider.id)}
                      className="admin-btn-icon admin-btn-icon-danger"
                      aria-label="Delete clinic"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="admin-empty-state">
              <MapPin size={48} />
              <p>No clinics found</p>
              <p className="admin-empty-hint">Click on the map to add your first clinic</p>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <div className="admin-form-modal">
          <div className="admin-form-content">
            <div className="admin-form-header-row">
              <h2>{editingProvider ? 'Edit Clinic' : 'Add New Clinic'}</h2>
              <button
                onClick={handleCancel}
                className="admin-form-close-btn"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            {selectedPosition && !editingProvider && (
              <div className="admin-form-location-info">
                <MapPin size={16} />
                <span>Location: {selectedPosition[0].toFixed(6)}, {selectedPosition[1].toFixed(6)}</span>
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="admin-form-group">
                <label htmlFor="name">Clinic Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter clinic name"
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="type">Type *</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  {clinicTypes.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+250 78 123 4567"
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label htmlFor="province">Province</label>
                  <input
                    type="text"
                    id="province"
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    placeholder="e.g., Kigali City"
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="district">District</label>
                  <input
                    type="text"
                    id="district"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    placeholder="e.g., Gasabo"
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label htmlFor="sector">Sector</label>
                <input
                  type="text"
                  id="sector"
                  name="sector"
                  value={formData.sector}
                  onChange={handleInputChange}
                  placeholder="e.g., Remera"
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="open_hours">Opening Hours</label>
                <input
                  type="text"
                  id="open_hours"
                  name="open_hours"
                  value={formData.open_hours}
                  onChange={handleInputChange}
                  placeholder="e.g., Mon-Fri 9AM-5PM"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-checkbox-label">
                  <input
                    type="checkbox"
                    name="verified"
                    checked={formData.verified}
                    onChange={handleInputChange}
                  />
                  <span>Verified</span>
                </label>
              </div>

              <div className="admin-form-actions">
                <button type="button" onClick={handleCancel} className="admin-btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  {editingProvider ? 'Update' : 'Create'} Clinic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default MapManagement;

