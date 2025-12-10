// This file is intended for Google Apps Script (GAS) deployment.
// It serves as the backend if the user deploys it to a Google Sheet.

function doGet(e) {
  return HtmlService.createHtmlOutput("Wedding Manager Backend is Running");
}

function doPost(e) {
  const params = JSON.parse(e.postData.contents);
  const action = params.action;
  const data = params.data;
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  let result = {};
  
  try {
    switch(action) {
      case 'setup':
        setupDatabase(ss);
        result = { status: 'success', message: 'Database setup complete' };
        break;
      case 'get_all':
        result = getAllData(ss);
        break;
      case 'add_guest':
        addRow(ss, 'Guests', data);
        result = { status: 'success', data: data };
        break;
      case 'update_guest':
        updateRow(ss, 'Guests', data.id, data);
        result = { status: 'success' };
        break;
      case 'delete_guest':
        deleteRow(ss, 'Guests', data.id);
        result = { status: 'success' };
        break;
      // Add similar cases for Vendors, Events, etc.
      default:
        result = { status: 'error', message: 'Unknown action' };
    }
  } catch (err) {
    result = { status: 'error', message: err.toString() };
  }
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function setupDatabase(ss) {
  const sheets = ['Guests', 'Events', 'Vendors', 'Tasks', 'Suits', 'Stats', 'Gifts'];
  sheets.forEach(name => {
    if (!ss.getSheetByName(name)) {
      ss.insertSheet(name);
      // Initialize headers based on schema
      const sheet = ss.getSheetByName(name);
      if (name === 'Guests') sheet.appendRow(['id', 'name', 'village', 'phone', 'rsvp', 'gender', 'events']);
      if (name === 'Events') sheet.appendRow(['id', 'name', 'date', 'venue', 'budget']);
      if (name === 'Vendors') sheet.appendRow(['id', 'name', 'serviceType', 'cost', 'paidAmount', 'contact']);
      if (name === 'Tasks') sheet.appendRow(['id', 'name', 'priority', 'assignedTo', 'completed']);
      if (name === 'Suits') sheet.appendRow(['id', 'owner', 'type', 'tailor', 'status']);
      if (name === 'Gifts') sheet.appendRow(['id', 'guestName', 'amount', 'type', 'event', 'notes']);
    }
  });
}

function getAllData(ss) {
  const output = {};
  const sheets = ['Guests', 'Events', 'Vendors', 'Tasks', 'Suits', 'Gifts'];
  sheets.forEach(name => {
    const sheet = ss.getSheetByName(name);
    if (sheet) {
      const data = sheet.getDataRange().getValues();
      const headers = data.shift();
      output[name.toLowerCase()] = data.map(row => {
        let obj = {};
        headers.forEach((h, i) => obj[h] = row[i]);
        return obj;
      });
    }
  });
  return { status: 'success', data: output };
}

function addRow(ss, sheetName, dataObj) {
  const sheet = ss.getSheetByName(sheetName);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const row = headers.map(h => {
    if (h === 'events' && Array.isArray(dataObj[h])) return JSON.stringify(dataObj[h]);
    return dataObj[h] || '';
  });
  sheet.appendRow(row);
}

function updateRow(ss, sheetName, id, dataObj) {
  const sheet = ss.getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();
  // Assuming column 0 is ID
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == id) {
      const headers = data[0];
      const newRow = headers.map((h, colIndex) => {
        if (dataObj.hasOwnProperty(h)) {
             if (h === 'events' && Array.isArray(dataObj[h])) return JSON.stringify(dataObj[h]);
             return dataObj[h];
        }
        return data[i][colIndex];
      });
      sheet.getRange(i + 1, 1, 1, newRow.length).setValues([newRow]);
      return;
    }
  }
}

function deleteRow(ss, sheetName, id) {
  const sheet = ss.getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == id) {
      sheet.deleteRow(i + 1);
      return;
    }
  }
}