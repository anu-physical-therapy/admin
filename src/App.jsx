import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import CSVUploader from './components/CSVUploader'
import DataProcessor from './components/DataProcessor'
import InvoiceGenerator from './components/InvoiceGenerator'
import InvoiceTemplate from './components/InvoiceTemplate'
import InvoiceManager from './components/InvoiceManager'
import { useLocalStorage } from './hooks/useLocalStorage'
import { processCSVData } from './utils/csvProcessor'
import { generateInvoice } from './utils/invoiceGenerator'
import { FileText, Plus, List, Upload, Settings, FileSpreadsheet, Receipt, Eye, ArrowRight } from 'lucide-react'

function App() {
  const [csvData, setCsvData] = useState(null)
  const [processedData, setProcessedData] = useState(null)
  const [invoiceData, setInvoiceData] = useState(null)
  const [savedInvoices, setSavedInvoices] = useLocalStorage('savedInvoices', [])
  const [savedData, setSavedData] = useLocalStorage('savedData', [])
  const [activeStep, setActiveStep] = useState('upload') // upload, process, generate, template
  const [currentView, setCurrentView] = useState('create') // create, manage, view
  const [viewingInvoice, setViewingInvoice] = useState(null)

  const handleCSVUpload = (data) => {
    setCsvData(data)
    setActiveStep('process')
  }

  const handleDataProcess = (processed) => {
    setProcessedData(processed)
    setActiveStep('generate')
  }

  const handleInvoiceGenerate = (invoice) => {
    setInvoiceData(invoice)
    setActiveStep('template')
  }

  const handleSaveInvoice = (invoice, originalData) => {
    const newInvoice = {
      id: Date.now().toString(),
      invoice,
      originalData,
      createdAt: new Date().toISOString(),
      filename: `invoice_${Date.now()}.pdf`
    }
    
    setSavedInvoices([...savedInvoices, newInvoice])
    setSavedData([...savedData, { id: newInvoice.id, data: originalData }])
    
    // Reset to upload step
    setActiveStep('upload')
    setCsvData(null)
    setProcessedData(null)
    setInvoiceData(null)
  }

  const handleDeleteInvoice = (invoiceId) => {
    setSavedInvoices(prev => prev.filter(invoice => invoice.id !== invoiceId))
    setSavedData(prev => prev.filter(data => data.id !== invoiceId))
  }

  const handleViewInvoice = (invoice) => {
    setViewingInvoice(invoice)
    setCurrentView('view')
  }

  const handleBackToManager = () => {
    setViewingInvoice(null)
    setCurrentView('manage')
  }

  const handleBackToCreate = () => {
    setCurrentView('create')
    setActiveStep('upload')
    setCsvData(null)
    setProcessedData(null)
    setInvoiceData(null)
  }

  const renderCreateWorkflow = () => (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4">
          {['upload', 'process', 'generate', 'template'].map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                activeStep === step 
                  ? 'bg-primary-600 text-white' 
                  : index < ['upload', 'process', 'generate', 'template'].indexOf(activeStep)
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {step === 'upload' ? <Upload className="w-5 h-5" /> :
                 step === 'process' ? <Settings className="w-5 h-5" /> :
                 step === 'generate' ? <FileSpreadsheet className="w-5 h-5" /> :
                 <Receipt className="w-5 h-5" />}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-600 capitalize">
                {step === 'upload' ? 'Upload CSV' : 
                 step === 'process' ? 'Process Data' :
                 step === 'generate' ? 'Generate Invoice' : 'Template'}
              </span>
              {index < 3 && (
                <div className={`w-12 h-0.5 mx-2 ${
                  index < ['upload', 'process', 'generate', 'template'].indexOf(activeStep)
                    ? 'bg-green-500' 
                    : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {activeStep === 'upload' && (
        <CSVUploader onUpload={handleCSVUpload} />
      )}

      {activeStep === 'process' && csvData && (
        <DataProcessor 
          data={csvData} 
          onProcess={handleDataProcess}
          onBack={() => setActiveStep('upload')}
        />
      )}

      {activeStep === 'generate' && processedData && (
        <InvoiceGenerator 
          data={processedData}
          onGenerate={handleInvoiceGenerate}
          onBack={() => setActiveStep('process')}
        />
      )}

      {activeStep === 'template' && invoiceData && (
        <InvoiceTemplate 
          invoice={invoiceData}
          originalData={csvData}
          onSave={handleSaveInvoice}
          onBack={() => setActiveStep('generate')}
        />
      )}
    </>
  )

  const renderManageView = () => (
    <InvoiceManager 
      savedInvoices={savedInvoices}
      savedData={savedData}
      onDeleteInvoice={handleDeleteInvoice}
      onViewInvoice={handleViewInvoice}
    />
  )

  const renderViewInvoice = () => (
    <InvoiceTemplate 
      invoice={viewingInvoice.invoice}
      originalData={viewingInvoice.originalData}
      onSave={() => {}} // No save action when viewing
      onBack={handleBackToManager}
      isViewOnly={true}
    />
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 max-w-6xl">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentView('create')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'create'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Create Invoice</span>
            </button>
            
            <button
              onClick={() => setCurrentView('manage')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'manage'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <List className="w-4 h-4" />
              <span>Manage Invoices</span>
              {savedInvoices.length > 0 && (
                <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                  {savedInvoices.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {currentView === 'create' && renderCreateWorkflow()}
        {currentView === 'manage' && renderManageView()}
        {currentView === 'view' && viewingInvoice && renderViewInvoice()}
      </main>
    </div>
  )
}

export default App 