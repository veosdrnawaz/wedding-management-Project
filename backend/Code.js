
/**
 * Wedding Manager Backend
 * Serves as the API for the Blogger Frontend.
 */

// 1. Create Menu for Auto-Setup
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Wedding Manager')
    .addItem('⚡ Setup Database (Run First)', 'setupDatabase')
    .addToUi();
}

// 2. Setup Database Sheets
function setupDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = [
    { name: 'Guests', headers: ['id', 'name', 'village', 'phone', 'rsvp', 'gender', 'events'] },
    { name: 'Events', headers: ['id', 'name', 'type', 'date', 'venue', 'budget'] },
    { name: 'Vendors', headers: ['id', 'name', 'serviceType', 'cost', 'paidAmount', 'contact'] }, // Handles Food/Decoration
    { name: 'Tasks', headers: ['id', 'name', 'priority', 'assignedTo', 'completed'] },
    { name: 'Gifts', headers: ['id', 'guestName', 'amount', 'type', 'event', 'notes'] }
  ];

  sheets.forEach(schema => {
    let sheet = ss.getSheetByName(schema.name);
    if (!sheet) {
      sheet = ss.insertSheet(schema.name);
      sheet.deleteRows(2, sheet.getMaxRows() - 1); // Remove extra rows for cleanliness
    }
    
    const headerRange = sheet.getRange(1, 1, 1, schema.headers.length);
    if (headerRange.isBlank()) {
      headerRange.setValues([schema.headers]);
      headerRange.setFontWeight('bold').setBackground('#e0e7ff').setFontColor('#3730a3');
      sheet.setFrozenRows(1);
    }
  });

  SpreadsheetApp.getUi().alert('✅ Database Setup Complete!\n\nSheets for Guests, Events, Vendors (Food/Decor), Tasks, and Gifts have been created.');
}

// 3. Handle API Requests (POST)
// We use POST for everything to avoid caching issues and handle larger payloads
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000); // Wait up to 10s for other requests

  try {
    const params = JSON.parse(e.postData.contents);
    const action = params.action;
    const payload = params.data;
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    let result = { status: 'success' };

    if (action === 'GET_ALL') {
      result.data = getAllData(ss);
    } 
    else if (action === 'SYNC_DATA') {
      // Syncs all tables from frontend to backend
      if(payload.guests) syncTable(ss, 'Guests', payload.guests);
      if(payload.events) syncTable(ss, 'Events', payload.events);
      if(payload.vendors) syncTable(ss, 'Vendors', payload.vendors);
      if(payload.tasks) syncTable(ss, 'Tasks', payload.tasks);
      if(payload.gifts) syncTable(ss, 'Gifts', payload.gifts);
      result.message = "Synced successfully";
    }

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Helper: Get all data
function getAllData(ss) {
  const output = {};
  const tables = ['Guests', 'Events', 'Vendors', 'Tasks', 'Gifts'];
  
  tables.forEach(name => {
    const sheet = ss.getSheetByName(name);
    if (!sheet) return;
    
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) {
      output[name.toLowerCase()] = [];
      return;
    }

    const data = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).getValues();
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    output[name.toLowerCase()] = data.map(row => {
      let obj = {};
      headers.forEach((h, i) => {
        let val = row[i];
        if (h === 'completed') val = (val === true || val === 'TRUE');
        if (h === 'events' && typeof val === 'string' && val.startsWith('[')) {
          try { val = JSON.parse(val); } catch(e) {}
        }
        obj[h] = val;
      });
      return obj;
    });
  });
  return output;
}

// Helper: Sync Table (Overwrite method for simplicity in this SPA architecture)
function syncTable(ss, sheetName, items) {
  const sheet = ss.getSheetByName(sheetName);
  if(!sheet) return;
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  // Clear old content
  if(sheet.getLastRow() > 1) {
    sheet.getRange(2, 1, sheet.getLastRow()-1, sheet.getLastColumn()).clearContent();
  }
  
  if (!items || items.length === 0) return;

  const rows = items.map(item => {
    return headers.map(h => {
      let val = item[h];
      if (val === undefined || val === null) return '';
      if (Array.isArray(val) || typeof val === 'object') return JSON.stringify(val);
      return val;
    });
  });

  sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
}
