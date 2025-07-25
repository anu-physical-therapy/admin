import React from 'react'
import { FileText, Calculator } from 'lucide-react'

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <FileText className="w-8 h-8 text-primary-600" />
              <Calculator className="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Anú Invoice Manager</h1>
              <p className="text-sm text-gray-600">CSV Processing & Invoice Generation</p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-600">Anú Physiotherapy</p>
            <p className="text-xs text-gray-500">Saturna Island, BC</p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header 