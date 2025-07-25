import React, { useState, useEffect } from 'react'
import { Calculator, ArrowLeft, CheckCircle, Database, DollarSign, Hash, Calendar, Mail, Type, BarChart3 } from 'lucide-react'

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
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Database className="w-5 h-5 mr-2" />
              Available Fields
            </h3>
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
                      <div className="flex items-center space-x-2">
                        {fieldType === 'numeric' ? <Hash className="w-4 h-4 text-blue-500" /> :
                         fieldType === 'email' ? <Mail className="w-4 h-4 text-green-500" /> :
                         fieldType === 'date' ? <Calendar className="w-4 h-4 text-purple-500" /> :
                         <Type className="w-4 h-4 text-gray-500" />}
                        <span className="font-medium">{header}</span>
                        <span className="text-xs text-gray-500 capitalize">({fieldType})</span>
                      </div>
                      {isSelected && <CheckCircle className="w-4 h-4 text-primary-600" />}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Summary */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Field Summary
            </h3>
            {selectedFields.length > 0 ? (
              <div className="space-y-4">
                {selectedFields.map(field => (
                  <div key={field} className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <Hash className="w-4 h-4 mr-2 text-blue-500" />
                      {field}
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sum:</span>
                        <span className="font-medium">${summary[field]?.sum?.toFixed(2) || '0.00'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Count:</span>
                        <span className="font-medium">{summary[field]?.count || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Average:</span>
                        <span className="font-medium">${summary[field]?.average?.toFixed(2) || '0.00'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Range:</span>
                        <span className="font-medium">${summary[field]?.min?.toFixed(2) || '0.00'} - ${summary[field]?.max?.toFixed(2) || '0.00'}</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <DollarSign className="w-5 h-5 mr-2 text-primary-600" />
                      <span className="font-medium text-primary-900">Total Amount:</span>
                    </div>
                    <span className="text-xl font-bold text-primary-900">
                      ${Object.values(summary).reduce((acc, field) => acc + field.sum, 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Database className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Select fields to see summary</p>
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