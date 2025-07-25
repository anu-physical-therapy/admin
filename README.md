# Áine Invoice Manager

A modern, client-side invoice management tool for Áine Physiotherapy. This application allows you to process CSV data from Excel exports and generate professional invoices with automatic calculations.

## Features

- **CSV Upload & Processing**: Drag and drop CSV files exported from Excel
- **Smart Field Detection**: Automatically identifies numeric fields for calculations
- **Invoice Generation**: Create professional invoices with customizable templates
- **PDF Export**: Generate and download PDF invoices
- **Local Storage**: Save invoices and data locally in the browser
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **React 18**: Modern React with hooks
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **PapaParse**: CSV parsing library
- **jsPDF**: PDF generation
- **html2canvas**: HTML to canvas conversion for PDF
- **Lucide React**: Beautiful icons
- **date-fns**: Date manipulation utilities

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd aine-invoice-manager
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3001`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment to GitHub Pages.

## Usage

### 1. Upload CSV File
- Export your data from Excel as CSV
- Drag and drop the CSV file or click "Browse Files"
- The application will automatically parse and preview your data

### 2. Process Data
- Select the fields you want to include in calculations
- Review the summary preview showing totals and statistics
- Click "Process Data" to continue

### 3. Generate Invoice
- Fill in invoice details (client info, dates, tax rates, etc.)
- Review the invoice summary
- Click "Generate Invoice" to create the invoice

### 4. Save Invoice
- Preview the generated invoice
- Download as PDF or save to local storage
- Access saved invoices from the main dashboard

## Data Storage

All data is stored locally in the browser using:
- **localStorage**: For invoice metadata and settings
- **IndexedDB**: For larger data sets (future enhancement)
- **File System Access API**: For direct file access (modern browsers)

## Deployment

### GitHub Pages

1. Create a new GitHub repository
2. Push your code to the repository
3. Go to Settings > Pages
4. Select "Deploy from a branch"
5. Choose the `main` branch and `/docs` folder
6. Build the project: `npm run build`
7. Copy the contents of `dist` to a `docs` folder in your repository
8. Commit and push the changes

The application will be available at `https://yourusername.github.io/repository-name`

## File Structure

```
src/
├── components/          # React components
│   ├── Header.jsx      # Application header
│   ├── CSVUploader.jsx # CSV file upload component
│   ├── DataProcessor.jsx # Data processing and field selection
│   ├── InvoiceGenerator.jsx # Invoice configuration
│   └── InvoiceTemplate.jsx # Invoice preview and PDF generation
├── hooks/              # Custom React hooks
│   └── useLocalStorage.js # Local storage management
├── utils/              # Utility functions
│   ├── csvProcessor.js # CSV data processing
│   └── invoiceGenerator.js # Invoice generation utilities
├── App.jsx             # Main application component
├── main.jsx            # React entry point
└── index.css           # Global styles and Tailwind imports
```

## Customization

### Styling
The application uses Tailwind CSS for styling. You can customize the design by modifying:
- `tailwind.config.js` for theme configuration
- `src/index.css` for custom CSS classes
- Component-specific styles in each component

### Invoice Template
The invoice template is defined in `src/components/InvoiceTemplate.jsx`. You can customize:
- Company branding and contact information
- Invoice layout and styling
- PDF generation settings

### Data Processing
Modify the data processing logic in:
- `src/utils/csvProcessor.js` for CSV handling
- `src/components/DataProcessor.jsx` for field selection logic

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support or questions, please contact Áine Physiotherapy or create an issue in the repository. 