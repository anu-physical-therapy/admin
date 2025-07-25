export const processCSVData = (data, selectedFields) => {
  if (!data || !selectedFields || selectedFields.length === 0) {
    return null
  }

  const summary = {}
  
  selectedFields.forEach(field => {
    const values = data.data
      .map(row => parseFloat(row[field]))
      .filter(val => !isNaN(val))
    
    summary[field] = {
      sum: values.reduce((acc, val) => acc + val, 0),
      count: values.length,
      average: values.length > 0 ? values.reduce((acc, val) => acc + val, 0) / values.length : 0,
      min: values.length > 0 ? Math.min(...values) : 0,
      max: values.length > 0 ? Math.max(...values) : 0
    }
  })

  return {
    originalData: data,
    selectedFields,
    summary,
    totalAmount: Object.values(summary).reduce((acc, field) => acc + field.sum, 0),
    processedAt: new Date().toISOString()
  }
}

export const detectNumericFields = (data) => {
  if (!data || !data.headers || !data.data || data.data.length === 0) {
    return []
  }

  return data.headers.filter(header => {
    const sampleValues = data.data.slice(0, 10).map(row => row[header])
    return sampleValues.some(val => !isNaN(parseFloat(val)) && val !== '')
  })
}

export const validateCSVData = (data) => {
  if (!data || !data.data || data.data.length === 0) {
    return { isValid: false, error: 'No data found in CSV file' }
  }

  if (!data.headers || data.headers.length === 0) {
    return { isValid: false, error: 'No headers found in CSV file' }
  }

  return { isValid: true }
} 