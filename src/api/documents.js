import api from './axios'

export const documentsApi = {
  // Upload document for a course
  uploadDocument: async (file, courseOfferingId) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('fileName', file.name)
    formData.append('courseOfferingId', courseOfferingId)

    const response = await api.post('/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Get documents for a department
  getDepartmentDocuments: async (departmentId) => {
    const response = await api.get(`/departments/${departmentId}/documents`)
    return response.data
  },

  // Download document
  downloadDocument: async (documentId) => {
    const response = await api.get(`/documents/${documentId}`)
    return response.data
  },
}
