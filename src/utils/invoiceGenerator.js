import { format } from 'date-fns'

export const generateInvoice = (processedData, config) => {
  const items = Object.entries(processedData.summary).map(([field, summary]) => ({
    description: field,
    quantity: summary.count,
    unitPrice: summary.average,
    amount: summary.sum
  }))

  const subtotal = processedData.totalAmount
  const tax = subtotal * (config.taxRate / 100)
  const discount = subtotal * (config.discount / 100)
  const total = subtotal + tax - discount

  return {
    config,
    items,
    subtotal,
    tax,
    discount,
    total,
    generatedAt: new Date().toISOString()
  }
}

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD'
  }).format(amount)
}

export const generateInvoiceNumber = () => {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `INV-${timestamp}-${random}`
}

export const validateInvoiceConfig = (config) => {
  const errors = []

  if (!config.invoiceNumber) {
    errors.push('Invoice number is required')
  }

  if (!config.date) {
    errors.push('Invoice date is required')
  }

  if (!config.dueDate) {
    errors.push('Due date is required')
  }

  if (config.taxRate < 0 || config.taxRate > 100) {
    errors.push('Tax rate must be between 0 and 100')
  }

  if (config.discount < 0 || config.discount > 100) {
    errors.push('Discount must be between 0 and 100')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
} 