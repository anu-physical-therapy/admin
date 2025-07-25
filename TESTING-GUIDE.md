# Testing Guide - Anú Invoice Manager

## 🚀 Quick Start

1. **Start the application** (if not already running):
   ```bash
   npm run dev
   ```

2. **Open your browser** and go to: `http://localhost:3001/`

3. **Test with sample data** using one of the provided CSV files

## 📊 Sample Data Files

### Basic Sample (`sample-data.csv`)
- **5 sessions** for Yaletown House Society
- **$75/hour** rate
- **Simple format** with Date, Client, Service, Hours, Rate, Notes

### Extended Sample (`sample-data-extended.csv`)
- **10 sessions** with varied services and rates
- **Different rates**: $65-$100/hour
- **Additional columns**: Location
- **More realistic** physiotherapy data

## 🔧 Easy Data Modification

### Option 1: Use the Generator Script
1. Edit `create-sample-data.js`
2. Modify the `config` object:
   ```javascript
   const config = {
     client: 'Your Client Name',
     rate: 80, // Change hourly rate
     services: [
       { date: '2025-08-01', hours: 2, service: 'Assessment', notes: 'Initial evaluation' },
       // Add more sessions...
     ]
   };
   ```
3. Run: `node create-sample-data.js`
4. Upload the new `sample-data.csv`

### Option 2: Edit CSV Directly
- Open any `.csv` file in a text editor or Excel
- Modify the data as needed
- Save and upload to the application

## 🧪 Testing Scenarios

### 1. Basic Invoice Generation
1. Upload `sample-data.csv`
2. Select "Hours" and "Rate" fields
3. Fill in client details
4. Generate and download invoice

### 2. Multiple Service Types
1. Upload `sample-data-extended.csv`
2. Select different fields to sum
3. Test with various rate structures

### 3. Data Processing
1. Try uploading files with different column names
2. Test with missing data
3. Verify automatic field detection

### 4. Invoice Customization
1. Test different tax rates
2. Add discounts
3. Customize client information
4. Add notes and descriptions

## 📋 Expected Results

### From `sample-data.csv`:
- **Total Hours**: 16 hours
- **Total Amount**: $1,200.00
- **Services**: 5 physiotherapy sessions

### From `sample-data-extended.csv`:
- **Total Hours**: 25 hours
- **Total Amount**: $1,875.00 (varies by rate)
- **Services**: 10 varied sessions

## 🔍 Troubleshooting

### Common Issues:
1. **CSV not loading**: Check file format (must be .csv)
2. **Fields not detected**: Ensure numeric data in columns
3. **PDF generation fails**: Try refreshing the page
4. **Styling issues**: Clear browser cache

### Browser Compatibility:
- Chrome 80+ (recommended)
- Firefox 75+
- Safari 13+
- Edge 80+

## 📝 Notes for Real Data

When you have the actual CSV data:
1. **Export from Excel** as CSV format
2. **Ensure headers** are in the first row
3. **Check numeric columns** for calculations
4. **Test with a small sample** first

The application will automatically:
- Detect numeric fields
- Calculate totals
- Generate professional invoices
- Save everything locally 