#!/usr/bin/env node

const fs = require('fs');

// Sample data configuration - easy to modify
const config = {
  client: 'Yaletown House Society',
  rate: 75,
  services: [
    { date: '2025-07-11', hours: 3, service: 'Physiotherapy Session', notes: 'Resident care and rehabilitation' },
    { date: '2025-07-15', hours: 4, service: 'Physiotherapy Session', notes: 'Group therapy and individual sessions' },
    { date: '2025-07-18', hours: 2, service: 'Physiotherapy Session', notes: 'Follow-up assessments' },
    { date: '2025-07-22', hours: 3, service: 'Physiotherapy Session', notes: 'Balance and mobility training' },
    { date: '2025-07-25', hours: 4, service: 'Physiotherapy Session', notes: 'Strength training and education' },
    // Add more sessions here as needed
  ]
};

// Generate CSV content
const headers = ['Date', 'Client', 'Service', 'Hours', 'Rate', 'Notes'];
const csvRows = [headers.join(',')];

config.services.forEach(session => {
  const row = [
    session.date,
    config.client,
    session.service,
    session.hours,
    config.rate,
    session.notes
  ].join(',');
  csvRows.push(row);
});

const csvContent = csvRows.join('\n');

// Write to file
fs.writeFileSync('sample-data.csv', csvContent);

console.log('✅ Sample CSV data generated!');
console.log(`📊 ${config.services.length} sessions for ${config.client}`);
console.log(`💰 Rate: $${config.rate}/hour`);
console.log(`📅 Date range: ${config.services[0].date} to ${config.services[config.services.length - 1].date}`);
console.log('\nTo modify the data:');
console.log('1. Edit the "config" object in this file');
console.log('2. Run: node create-sample-data.js');
console.log('3. Upload the new sample-data.csv to the application'); 