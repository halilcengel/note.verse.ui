import api from './axios'

export const documentsApi = {
  // Upload document for a course
  uploadDocument: async (file, title, uploadedBy, courseId) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', title)
    formData.append('uploadedBy', uploadedBy)
    if (courseId) {
      formData.append('courseId', courseId)
    }

    const response = await api.post('/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Get documents for a course
  getCourseDocuments: async (courseId, page = 1, limit = 100) => {
    const response = await api.get('/documents', {
      params: {
        courseId,
        page,
        limit,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      },
    })
    return response.data
  },

  // Get document metadata by ID
  getDocumentById: async (documentId) => {
    const response = await api.get(`/documents/${documentId}`)
    return response.data
  },

  // Download document
  downloadDocument: async (documentId) => {
    const response = await api.get(`/documents/${documentId}/download`, {
      responseType: 'blob',
    })
    return response.data
  },

  // Update document metadata
  updateDocument: async (documentId, data) => {
    const response = await api.put(`/documents/${documentId}`, data)
    return response.data
  },

  // Delete document
  deleteDocument: async (documentId) => {
    const response = await api.delete(`/documents/${documentId}`)
    return response.data
  },
}
