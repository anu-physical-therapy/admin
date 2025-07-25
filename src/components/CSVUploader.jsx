import React, { useState, useRef } from 'react'
import { Upload, FileText, AlertCircle, CheckCircle, FileSpreadsheet, ArrowUp, CloudUpload } from 'lucide-react'
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
            <div className="space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="text-gray-600">Processing CSV file...</p>
            </div>
          ) : preview ? (
            <div className="space-y-4">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">File Uploaded Successfully!</h3>
                <p className="text-gray-600 mb-4">{preview.totalRows} rows found</p>
                <div className="bg-gray-50 rounded-lg p-4 text-left">
                  <h4 className="font-medium text-gray-900 mb-2">Preview:</h4>
                  <div className="text-sm text-gray-600">
                    <p><strong>Headers:</strong> {preview.headers.join(', ')}</p>
                    <p><strong>Sample data:</strong> {preview.sampleData.length} rows shown</p>
                  </div>
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="space-y-4">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
              <div>
                <h3 className="text-lg font-medium text-red-900 mb-2">Upload Error</h3>
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-primary flex items-center mx-auto space-x-2"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Try Again</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <CloudUpload className="w-12 h-12 text-gray-400 mx-auto" />
              <div>
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Drop your CSV file here, or click to browse
                </p>
                <p className="text-gray-600 mb-4">
                  Supports Excel exports saved as CSV format
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-primary flex items-center mx-auto space-x-2"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Choose File</span>
                </button>
              </div>
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
      </div>
    </div>
  )
}

export default CSVUploader 