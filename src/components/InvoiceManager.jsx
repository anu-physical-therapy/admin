import React, { useState, useMemo } from 'react'
import {
  Trash2,
  Download,
  Eye,
  Search,
  Filter,
  Calendar,
  DollarSign,
  FileText,
  AlertCircle,
  Upload,
  Download as DownloadIcon
} from 'lucide-react'
import { format } from 'date-fns'

const InvoiceManager = ({ savedInvoices, savedData, onDeleteInvoice, onViewInvoice }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')

  const isRecent = (date) => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return new Date(date) > thirtyDaysAgo
  }

  const filteredAndSortedInvoices = useMemo(() => {
    let filtered = savedInvoices.filter(invoice => {
      const matchesSearch =
        (invoice.invoice?.config?.invoiceNumber && invoice.invoice.config.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (invoice.invoice?.config?.clientName && invoice.invoice.config.clientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (invoice.filename && invoice.filename.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesFilter = filterStatus === 'all' ||
        (filterStatus === 'recent' && isRecent(invoice.createdAt)) ||
        (filterStatus === 'high-value' && (invoice.invoice?.total || 0) > 1000)

      return matchesSearch && matchesFilter
    })

    // Sort invoices
    filtered.sort((a, b) => {
      let aValue, bValue

      switch (sortBy) {
        case 'date':
          aValue = new Date(a.createdAt)
          bValue = new Date(b.createdAt)
          break
        case 'amount':
          aValue = a.invoice?.total || 0
          bValue = b.invoice?.total || 0
          break
        case 'number':
          aValue = a.invoice?.config?.invoiceNumber || ''
          bValue = b.invoice?.config?.invoiceNumber || ''
          break
        default:
          aValue = new Date(a.createdAt)
          bValue = new Date(b.createdAt)
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [savedInvoices, searchTerm, filterStatus, sortBy, sortOrder])

  const handleDelete = (invoiceId) => {
    if (window.confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) {
      onDeleteInvoice(invoiceId)
    }
  }

  const handleExportData = () => {
    console.log('Exporting data:', { savedInvoices, savedData })
    
    const exportData = {
      savedInvoices,
      savedData,
      exportDate: new Date().toISOString(),
      version: '1.0'
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `invoice-manager-backup-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
    
    console.log('Export completed')
  }

  const handleImportData = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target.result)
        
        if (importData.savedInvoices && importData.savedData) {
          if (window.confirm(`Import ${importData.savedInvoices.length} invoices? This will replace your current data.`)) {
            // Update localStorage directly
            localStorage.setItem('savedInvoices', JSON.stringify(importData.savedInvoices))
            localStorage.setItem('savedData', JSON.stringify(importData.savedData))
            
            // Force page reload to update the UI
            window.location.reload()
          }
        } else {
          alert('Invalid backup file format')
        }
      } catch (error) {
        alert('Error reading backup file: ' + error.message)
      }
    }
    reader.readAsText(file)
    
    // Reset the input
    event.target.value = ''
  }

  const totalValue = useMemo(() => {
    return filteredAndSortedInvoices.reduce((sum, invoice) => sum + (invoice.invoice?.total || 0), 0)
  }, [filteredAndSortedInvoices])

  return (
    <div className="max-w-6xl mx-auto">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Invoice Manager</h2>
            <p className="text-gray-600">
              Manage your saved invoices and data
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportData}
              className="btn-secondary flex items-center text-sm"
              title="Export all data as backup"
            >
              <DownloadIcon className="w-4 h-4 mr-1" />
              Export Backup
            </button>
            <label className="btn-secondary flex items-center text-sm cursor-pointer">
              <Upload className="w-4 h-4 mr-1" />
              Import Backup
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {savedInvoices.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Saved Invoices</h3>
            <p className="text-gray-600 mb-4">
              Your saved invoices will appear here once you create and save your first invoice.
            </p>
            <p className="text-sm text-gray-500">
              Start by uploading a CSV file and generating an invoice, or import a backup file.
            </p>
          </div>
        ) : (
          <>
            {/* Stats Bar */}
            <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">
                {filteredAndSortedInvoices.length} of {savedInvoices.length} invoices
              </div>
              <div className="text-lg font-semibold text-primary-600">
                ${totalValue.toFixed(2)} total
              </div>
            </div>

            {/* Search and Filters */}
            <div className="mb-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search invoices by number, client, or filename..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="input-field pl-10"
                    />
                  </div>
                </div>
                
                <div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="input-field"
                  >
                    <option value="all">All Invoices</option>
                    <option value="recent">Recent (30 days)</option>
                    <option value="high-value">High Value (&gt;$1000)</option>
                  </select>
                </div>
                
                <div>
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [field, order] = e.target.value.split('-')
                      setSortBy(field)
                      setSortOrder(order)
                    }}
                    className="input-field"
                  >
                    <option value="date-desc">Newest First</option>
                    <option value="date-asc">Oldest First</option>
                    <option value="amount-desc">Highest Amount</option>
                    <option value="amount-asc">Lowest Amount</option>
                    <option value="number-asc">Invoice Number A-Z</option>
                    <option value="number-desc">Invoice Number Z-A</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Invoice List */}
            <div className="space-y-4">
              {filteredAndSortedInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-6 h-6 text-primary-600" />
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-medium text-gray-900 truncate">
                              {invoice.invoice?.config?.clientName || 'No Client Name'}
                            </h3>
                            {invoice.invoice?.config?.invoiceNumber && (
                              <span className="text-sm text-gray-500">
                                • {invoice.invoice.config.invoiceNumber}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {format(new Date(invoice.createdAt), 'MMM dd, yyyy')}
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="w-4 h-4 mr-1" />
                              ${(invoice.invoice?.total || 0).toFixed(2)}
                            </div>
                            <div className="text-gray-500">
                              {(invoice.invoice?.items?.length || 0)} line items
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onViewInvoice(invoice)}
                        className="btn-secondary text-sm flex items-center"
                        title="View Invoice"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </button>
                      
                      <button
                        onClick={() => {
                          if (invoice.url && invoice.filename) {
                            const link = document.createElement('a')
                            link.href = invoice.url
                            link.download = invoice.filename
                            link.click()
                          } else {
                            alert('PDF not available for download')
                          }
                        }}
                        className="btn-secondary text-sm flex items-center"
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </button>
                      
                      <button
                        onClick={() => handleDelete(invoice.id)}
                        className="bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center"
                        title="Delete Invoice"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredAndSortedInvoices.length === 0 && savedInvoices.length > 0 && (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
                <p className="text-gray-600">
                  Try adjusting your search terms or filters.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default InvoiceManager 