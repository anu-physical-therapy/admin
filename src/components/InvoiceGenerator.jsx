import React, { useState } from 'react'
import { FileText, ArrowLeft, Settings, DollarSign } from 'lucide-react'
import { format } from 'date-fns'

const InvoiceGenerator = ({ data, onGenerate, onBack }) => {
  const [invoiceConfig, setInvoiceConfig] = useState({
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    date: format(new Date(), 'yyyy-MM-dd'),
    dueDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    notes: '',
    taxRate: 0,
    discount: 0
  })

  const handleConfigChange = (field, value) => {
    setInvoiceConfig(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const calculateSubtotal = () => {
    return data.totalAmount
  }

  const calculateTax = () => {
    return calculateSubtotal() * (invoiceConfig.taxRate / 100)
  }

  const calculateDiscount = () => {
    return calculateSubtotal() * (invoiceConfig.discount / 100)
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() - calculateDiscount()
  }

  const handleGenerate = () => {
    const invoice = {
      config: invoiceConfig,
      items: Object.entries(data.summary).map(([field, summary]) => ({
        description: field,
        quantity: summary.count,
        unitPrice: summary.average,
        amount: summary.sum
      })),
      subtotal: calculateSubtotal(),
      tax: calculateTax(),
      discount: calculateDiscount(),
      total: calculateTotal(),
      generatedAt: new Date().toISOString()
    }

    onGenerate(invoice)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Generate Invoice</h2>
            <p className="text-gray-600">
              Configure invoice details and generate your invoice
            </p>
          </div>
          <button onClick={onBack} className="btn-secondary flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Invoice Configuration */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Invoice Details
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Invoice Number
                  </label>
                  <input
                    type="text"
                    value={invoiceConfig.invoiceNumber}
                    onChange={(e) => handleConfigChange('invoiceNumber', e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Invoice Date
                  </label>
                  <input
                    type="date"
                    value={invoiceConfig.date}
                    onChange={(e) => handleConfigChange('date', e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={invoiceConfig.dueDate}
                  onChange={(e) => handleConfigChange('dueDate', e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Name
                </label>
                <input
                  type="text"
                  value={invoiceConfig.clientName}
                  onChange={(e) => handleConfigChange('clientName', e.target.value)}
                  className="input-field"
                  placeholder="Enter client name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Email
                </label>
                <input
                  type="email"
                  value={invoiceConfig.clientEmail}
                  onChange={(e) => handleConfigChange('clientEmail', e.target.value)}
                  className="input-field"
                  placeholder="Enter client email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Address
                </label>
                <textarea
                  value={invoiceConfig.clientAddress}
                  onChange={(e) => handleConfigChange('clientAddress', e.target.value)}
                  className="input-field"
                  rows="3"
                  placeholder="Enter client address"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    value={invoiceConfig.taxRate}
                    onChange={(e) => handleConfigChange('taxRate', parseFloat(e.target.value) || 0)}
                    className="input-field"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    value={invoiceConfig.discount}
                    onChange={(e) => handleConfigChange('discount', parseFloat(e.target.value) || 0)}
                    className="input-field"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={invoiceConfig.notes}
                  onChange={(e) => handleConfigChange('notes', e.target.value)}
                  className="input-field"
                  rows="3"
                  placeholder="Additional notes for the invoice"
                />
              </div>
            </div>
          </div>

          {/* Invoice Preview */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Invoice Summary
            </h3>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
                </div>
                
                {invoiceConfig.taxRate > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Tax ({invoiceConfig.taxRate}%):</span>
                    <span className="font-medium">${calculateTax().toFixed(2)}</span>
                  </div>
                )}
                
                {invoiceConfig.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Discount ({invoiceConfig.discount}%):</span>
                    <span className="font-medium">-${calculateDiscount().toFixed(2)}</span>
                  </div>
                )}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-2">Line Items:</h4>
                <div className="space-y-2">
                  {Object.entries(data.summary).map(([field, summary]) => (
                    <div key={field} className="flex justify-between text-sm">
                      <span className="truncate">{field}</span>
                      <span className="font-medium">${summary.sum.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button 
            onClick={handleGenerate}
            className="btn-primary flex items-center"
          >
            <FileText className="w-4 h-4 mr-2" />
            Generate Invoice
          </button>
        </div>
      </div>
    </div>
  )
}

export default InvoiceGenerator 