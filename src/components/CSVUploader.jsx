import React, { useState, useRef } from 'react'
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react'
import Papa from 'papaparse'

const CSVUploader = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)
  const [preview, setPreview] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileSelect = (file) => {
    if (!file) return
    
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError('Please select a valid CSV file')
      return
    }

    setError(null)
    setIsProcessing(true)

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setIsProcessing(false)
        
        if (results.errors.length > 0) {
          setError('Error parsing CSV file. Please check the file format.')
          return
        }

        if (results.data.length === 0) {
          setError('CSV file appears to be empty')
          return
        }

        // Show preview of first few rows
        setPreview({
          headers: Object.keys(results.data[0]),
          sampleData: results.data.slice(0, 5),
          totalRows: results.data.length
        })

        onUpload({
          data: results.data,
          headers: Object.keys(results.data[0]),
          filename: file.name,
          totalRows: results.data.length
        })
      },
      error: (error) => {
        setIsProcessing(false)
        setError('Error reading file: ' + error.message)
      }
    })
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileInputChange = (e) => {
    const file = e.target.files[0]
    handleFileSelect(file)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Upload CSV File</h2>
          <p className="text-gray-600">
            Upload your Excel export (CSV format) to process and generate invoices
          </p>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging 
              ? 'border-primary-500 bg-primary-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isProcessing ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-4"></div>
              <p className="text-gray-600">Processing CSV file...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center">
              <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="btn-primary"
              >
                Try Again
              </button>
            </div>
          ) : preview ? (
            <div className="flex flex-col items-center">
              <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
              <p className="text-green-600 mb-2">File uploaded successfully!</p>
              <p className="text-sm text-gray-600 mb-4">
                {preview.totalRows} rows found with {preview.headers.length} columns
              </p>
              
              <div className="w-full max-w-md">
                <h4 className="font-medium text-gray-900 mb-2">Preview:</h4>
                <div className="bg-gray-50 rounded-lg p-4 text-left">
                  <div className="text-xs font-mono text-gray-600 mb-2">
                    Headers: {preview.headers.join(', ')}
                  </div>
                  <div className="text-xs font-mono text-gray-800">
                    Sample data: {preview.sampleData.length} rows loaded
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">
                Drag and drop your CSV file here, or
              </p>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="btn-primary"
              >
                Browse Files
              </button>
              <p className="text-sm text-gray-500 mt-2">
                Supports CSV files exported from Excel
              </p>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>
    </div>
  )
}

export default CSVUploader 