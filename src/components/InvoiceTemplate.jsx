import React, { useRef, useEffect } from 'react'
import { ArrowLeft, Download, Save, Eye } from 'lucide-react'
import { format } from 'date-fns'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const InvoiceTemplate = ({ invoice, originalData, onSave, onBack, isViewOnly = false }) => {
  const invoiceRef = useRef(null)

  const generatePDF = async () => {
    if (!invoiceRef.current) return

    const canvas = await html2canvas(invoiceRef.current, {
      scale: 2,
      useCORS: true,
      allowTaint: true
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgWidth = 210
    const pageHeight = 295
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight

    let position = 0

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    const pdfBlob = pdf.output('blob')
    const pdfUrl = URL.createObjectURL(pdfBlob)

    return { pdf, pdfUrl, pdfBlob }
  }

  const handleSave = async () => {
    try {
      const { pdfUrl, pdfBlob } = await generatePDF()
      
      // Save to local storage and create download link
      const savedInvoice = {
        ...invoice,
        url: pdfUrl,
        blob: pdfBlob,
        savedAt: new Date().toISOString()
      }

      onSave(savedInvoice, originalData)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
    }
  }

  const handleDownload = async () => {
    try {
      const { pdf } = await generatePDF()
      pdf.save(`invoice_${invoice.config.invoiceNumber}.pdf`)
    } catch (error) {
      console.error('Error downloading PDF:', error)
      alert('Error downloading PDF. Please try again.')
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {isViewOnly ? 'Invoice Preview' : 'Invoice Preview'}
            </h2>
            <p className="text-gray-600">
              {isViewOnly ? 'Viewing saved invoice' : 'Review your invoice before saving'}
            </p>
          </div>
          <div className="flex space-x-2">
            <button onClick={onBack} className="btn-secondary flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {isViewOnly ? 'Back to Manager' : 'Back'}
            </button>
            {!isViewOnly && (
              <>
                <button onClick={handleDownload} className="btn-secondary flex items-center">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </button>
                <button onClick={handleSave} className="btn-primary flex items-center">
                  <Save className="w-4 h-4 mr-2" />
                  Save Invoice
                </button>
              </>
            )}
            {isViewOnly && (
              <button onClick={handleDownload} className="btn-primary flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </button>
            )}
          </div>
        </div>

        {/* Invoice Template */}
        <div 
          ref={invoiceRef}
          className="bg-white border border-gray-200 rounded-lg p-8 max-w-4xl mx-auto"
          style={{ minHeight: '297mm', width: '210mm' }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Physiotherapy Invoice</h1>
          </div>

          {/* Bill From Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Bill from:</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium text-lg">Anú Physiotherapy</p>
              <p className="text-gray-600">188 Cliffside Road</p>
              <p className="text-gray-600">Saturna Island, BC</p>
              <p className="text-gray-600">V0N 2Y0</p>
              <p className="text-gray-600">604-721-0177</p>
              <p className="text-gray-600">anu.physical.therapy@gmail.com</p>
            </div>
          </div>

          {/* Bill To Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Bill to:</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              {invoice.config.clientName ? (
                <>
                  <p className="font-medium">{invoice.config.clientName}</p>
                  {invoice.config.clientEmail && <p className="text-gray-600">{invoice.config.clientEmail}</p>}
                  {invoice.config.clientAddress && (
                    <p className="text-gray-600 whitespace-pre-line">{invoice.config.clientAddress}</p>
                  )}
                </>
              ) : (
                <p className="text-gray-500 italic">Client information to be filled</p>
              )}
            </div>
          </div>

          {/* Invoice Details */}
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <div>
                <p><strong>Invoice number:</strong> {invoice.config.invoiceNumber}</p>
                <p><strong>Date:</strong> {format(new Date(invoice.config.date), 'dd MMMM yyyy')}</p>
              </div>
            </div>
          </div>

          {/* Service Description */}
          <div className="mb-8">
            <p className="text-gray-700 mb-4">
              {invoice.config.notes || 'For Physiotherapy services rendered:'}
            </p>
          </div>

          {/* Invoice Items */}
          <div className="mb-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Description</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Hours</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Rate</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-3 px-4">{item.description}</td>
                    <td className="py-3 px-4 text-right">{item.quantity}</td>
                    <td className="py-3 px-4 text-right">${item.unitPrice.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right font-medium">${item.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="mb-8">
            <div className="flex justify-end">
              <div className="w-64">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${invoice.subtotal.toFixed(2)}</span>
                  </div>
                  {invoice.tax > 0 && (
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span>${invoice.tax.toFixed(2)}</span>
                    </div>
                  )}
                  {invoice.discount > 0 && (
                    <div className="flex justify-between">
                      <span>Discount:</span>
                      <span>-${invoice.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total:</span>
                    <span>${invoice.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          {invoice.config.notes && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Notes:</h3>
              <p className="text-gray-700 whitespace-pre-line">{invoice.config.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="text-center text-gray-600">
              <p>Thank you for choosing Anú Physiotherapy</p>
              <p className="text-sm mt-1">Specialized physiotherapy services</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvoiceTemplate 