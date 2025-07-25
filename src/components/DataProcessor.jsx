import React, { useState, useEffect } from 'react'
import { Calculator, ArrowLeft, CheckCircle } from 'lucide-react'

const DataProcessor = ({ data, onProcess, onBack }) => {
  const [selectedFields, setSelectedFields] = useState([])
  const [processedData, setProcessedData] = useState(null)
  const [summary, setSummary] = useState({})

  useEffect(() => {
    if (data && data.headers) {
      // Auto-select common numeric fields
      const numericFields = data.headers.filter(header => {
        const sampleValues = data.data.slice(0, 10).map(row => row[header])
        return sampleValues.some(val => !isNaN(parseFloat(val)) && val !== '')
      })
      setSelectedFields(numericFields.slice(0, 3)) // Select first 3 numeric fields
    }
  }, [data])

  useEffect(() => {
    if (selectedFields.length > 0 && data) {
      const summaryData = {}
      
      selectedFields.forEach(field => {
        const values = data.data
          .map(row => parseFloat(row[field]))
          .filter(val => !isNaN(val))
        
        summaryData[field] = {
          sum: values.reduce((acc, val) => acc + val, 0),
          count: values.length,
          average: values.length > 0 ? values.reduce((acc, val) => acc + val, 0) / values.length : 0,
          min: Math.min(...values),
          max: Math.max(...values)
        }
      })
      
      setSummary(summaryData)
    }
  }, [selectedFields, data])

  const handleFieldToggle = (field) => {
    setSelectedFields(prev => 
      prev.includes(field) 
        ? prev.filter(f => f !== field)
        : [...prev, field]
    )
  }

  const handleProcess = () => {
    if (selectedFields.length === 0) return

    const processed = {
      originalData: data,
      selectedFields,
      summary,
      totalAmount: Object.values(summary).reduce((acc, field) => acc + field.sum, 0),
      processedAt: new Date().toISOString()
    }

    setProcessedData(processed)
    onProcess(processed)
  }

  const getFieldType = (fieldName) => {
    const sampleValues = data.data.slice(0, 10).map(row => row[fieldName])
    const numericCount = sampleValues.filter(val => !isNaN(parseFloat(val)) && val !== '').length
    
    if (numericCount > sampleValues.length * 0.7) {
      return 'numeric'
    } else if (sampleValues.some(val => val && val.includes('@'))) {
      return 'email'
    } else if (sampleValues.some(val => val && val.includes('/'))) {
      return 'date'
    } else {
      return 'text'
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Process Data</h2>
            <p className="text-gray-600">
              Select the fields you want to include in your invoice calculations
            </p>
          </div>
          <button onClick={onBack} className="btn-secondary flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Field Selection */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Available Fields</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {data.headers.map(header => {
                const fieldType = getFieldType(header)
                const isSelected = selectedFields.includes(header)
                
                return (
                  <div 
                    key={header}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      isSelected 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleFieldToggle(header)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{header}</div>
                        <div className="text-sm text-gray-500 capitalize">{fieldType}</div>
                      </div>
                      {isSelected && <CheckCircle className="w-5 h-5 text-primary-600" />}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Summary Preview */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Summary Preview</h3>
            {selectedFields.length > 0 ? (
              <div className="space-y-4">
                {selectedFields.map(field => (
                  <div key={field} className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">{field}</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Sum: <span className="font-medium">${summary[field]?.sum.toFixed(2)}</span></div>
                      <div>Count: <span className="font-medium">{summary[field]?.count}</span></div>
                      <div>Average: <span className="font-medium">${summary[field]?.average.toFixed(2)}</span></div>
                      <div>Range: <span className="font-medium">${summary[field]?.min.toFixed(2)} - ${summary[field]?.max.toFixed(2)}</span></div>
                    </div>
                  </div>
                ))}
                
                <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
                  <h4 className="font-medium text-primary-900 mb-2">Total Amount</h4>
                  <div className="text-2xl font-bold text-primary-900">
                    ${Object.values(summary).reduce((acc, field) => acc + field.sum, 0).toFixed(2)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Calculator className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Select fields to see summary preview</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button 
            onClick={handleProcess}
            disabled={selectedFields.length === 0}
            className={`btn-primary flex items-center ${
              selectedFields.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Calculator className="w-4 h-4 mr-2" />
            Process Data
          </button>
        </div>
      </div>
    </div>
  )
}

export default DataProcessor 