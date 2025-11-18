import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit, Trash2, BookOpen, Search, Eye } from 'lucide-react';
import Editor from '../../assets/components/Editor';
import apiClient from '../../utils/apiClient';
import Quill from 'quill';

const LearningResourceManagement = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const editorRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    body_md: '',
    locale: 'eng',
    tags: [],
    is_published: false,
  });

  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      // Load all articles (including unpublished) for admin
      const response = await apiClient.get('/api/dashboard/articles/admin/all/', {
        params: { page_size: 100 }
      });
      setArticles(response.data.results || []);
    } catch (error) {
      console.error('Failed to load articles:', error);
      setFeedback({ type: 'error', text: 'Failed to load articles' });
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

  const handleEditorChange = (change) => {
    if (editorRef.current) {
      const html = editorRef.current.getHTML();
      setFormData(prev => ({
        ...prev,
        body_md: html
      }));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    if (!formData.title.trim()) {
      setFeedback({ type: 'error', text: 'Title is required' });
      return;
    }

    if (!formData.body_md.trim()) {
      setFeedback({ type: 'error', text: 'Content is required' });
      return;
    }

    try {
      const payload = {
        ...formData,
        body_md: editorRef.current?.getHTML() || formData.body_md,
      };

      if (editingArticle) {
        await apiClient.patch(`/api/dashboard/articles/${editingArticle.id}/update/`, payload);
        setFeedback({ type: 'success', text: 'Article updated successfully' });
      } else {
        await apiClient.post('/api/dashboard/articles/create/', payload);
        setFeedback({ type: 'success', text: 'Article created successfully' });
      }
      
      setShowForm(false);
      setEditingArticle(null);
      setFormData({
        title: '',
        body_md: '',
        locale: 'eng',
        tags: [],
        is_published: false,
      });
      if (editorRef.current) {
        editorRef.current.setHTML('');
      }
      loadArticles();
    } catch (error) {
      setFeedback({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to save article' 
      });
    }
  };

  const handleEdit = (article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title || '',
      body_md: article.body_md || '',
      locale: article.locale || 'eng',
      tags: article.tags || [],
      is_published: article.is_published || false,
    });
    setShowForm(true);
    
    // Set editor content after a brief delay to ensure editor is ready
    setTimeout(() => {
      if (editorRef.current && article.body_md) {
        editorRef.current.setHTML(article.body_md);
      }
    }, 100);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this article?')) {
      return;
    }

    try {
      await apiClient.delete(`/api/dashboard/articles/${id}/delete/`);
      setFeedback({ type: 'success', text: 'Article deleted successfully' });
      loadArticles();
    } catch (error) {
      setFeedback({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to delete article' 
      });
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingArticle(null);
    setFormData({
      title: '',
      body_md: '',
      locale: 'eng',
      tags: [],
      is_published: false,
    });
    if (editorRef.current) {
      editorRef.current.setHTML('');
    }
  };

  const handlePreview = () => {
    setPreviewMode(!previewMode);
  };

  const filteredArticles = articles.filter(article =>
    article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.body_md?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const commonTags = ['puberty', 'relationships', 'contraception', 'sti', 'menstruation', 'health', 'reproductive'];

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Learning Resources</h1>
          <p>Create and manage educational articles</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="admin-btn-primary"
          aria-label="Add new article"
        >
          <Plus size={20} />
          Add Article
        </button>
      </div>

      {feedback && (
        <div className={`admin-feedback ${feedback.type}`}>
          {feedback.text}
        </div>
      )}

      {showForm && (
        <div className="admin-form-modal">
          <div className="admin-form-content admin-form-content-large">
            <h2>{editingArticle ? 'Edit Article' : 'Create New Article'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="admin-form-group">
                <label htmlFor="title">Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter article title"
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label htmlFor="locale">Language *</label>
                  <select
                    id="locale"
                    name="locale"
                    value={formData.locale}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="eng">English</option>
                    <option value="kny">Kinyarwanda</option>
                    <option value="fr">Français</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-checkbox-label">
                    <input
                      type="checkbox"
                      name="is_published"
                      checked={formData.is_published}
                      onChange={handleInputChange}
                    />
                    <span>Published</span>
                  </label>
                </div>
              </div>

              <div className="admin-form-group">
                <label>Content *</label>
                <div className="editor-wrapper">
                  <Editor
                    ref={editorRef}
                    defaultValue={formData.body_md}
                    onTextChange={handleEditorChange}
                    placeholder="Write your article content here..."
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label htmlFor="tags">Tags</label>
                <div className="admin-tags-input">
                  <input
                    type="text"
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Type a tag and press Enter"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="admin-btn-small"
                  >
                    Add
                  </button>
                </div>
                <div className="admin-tags-suggestions">
                  <span className="admin-tags-label">Quick add:</span>
                  {commonTags.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        if (!formData.tags.includes(tag)) {
                          setFormData(prev => ({
                            ...prev,
                            tags: [...prev.tags, tag]
                          }));
                        }
                      }}
                      className="admin-tag-suggestion"
                      disabled={formData.tags.includes(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                {formData.tags.length > 0 && (
                  <div className="admin-tags-list">
                    {formData.tags.map((tag, index) => (
                      <span key={index} className="admin-tag">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="admin-tag-remove"
                          aria-label={`Remove ${tag} tag`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="admin-form-actions">
                <button type="button" onClick={handleCancel} className="admin-btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  {editingArticle ? 'Update' : 'Create'} Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-page-content">
        <div className="admin-search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="admin-loading">Loading articles...</div>
        ) : filteredArticles.length > 0 ? (
          <div className="admin-articles-grid">
            {filteredArticles.map((article) => (
              <div key={article.id} className="admin-article-card">
                <div className="admin-article-card-header">
                  <h3>{article.title}</h3>
                  <div className="admin-article-card-badges">
                    <span className="admin-badge">{article.locale}</span>
                    {article.is_published ? (
                      <span className="admin-badge admin-badge-success">Published</span>
                    ) : (
                      <span className="admin-badge admin-badge-warning">Draft</span>
                    )}
                  </div>
                </div>
                <div className="admin-article-card-content">
                  <p dangerouslySetInnerHTML={{ 
                    __html: article.body_md?.substring(0, 150) + '...' || 'No content' 
                  }} />
                </div>
                {article.tags && article.tags.length > 0 && (
                  <div className="admin-article-card-tags">
                    {article.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="admin-tag-small">{tag}</span>
                    ))}
                  </div>
                )}
                <div className="admin-article-card-actions">
                  <button
                    onClick={() => handleEdit(article)}
                    className="admin-btn-icon"
                    aria-label="Edit article"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="admin-btn-icon admin-btn-icon-danger"
                    aria-label="Delete article"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="admin-empty-state">
            <BookOpen size={48} />
            <p>No articles found</p>
            <button onClick={() => setShowForm(true)} className="admin-btn-primary">
              Create Your First Article
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningResourceManagement;

