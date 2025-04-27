// https://sheets.googleapis.com/v4/spreadsheets/1NrzdtIrhHyUyCA0pZyneawUWVeVclUIbRbMsmsSf988/values/testing

const { google } = require('googleapis');
const fs = require('fs');

const auth = new google.auth.GoogleAuth({
  keyFile: 'credentials.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

async function getSheetData() {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  const sheetId = 'YOUR_SHEET_ID'; // The long ID in the sheet URL
  const range = 'Sheet1!A2:H'; // Adjust this range as per your data

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range,
  });

  const rows = res.data.values;
  return rows; // Each row = [ticket, payer, payeeId, timestamp, newVal, iframe, ...]
}

// -------------------------------------------------------------------------------------------
// Connection

const rows = await getSheetData();

for (const row of rows) {
  const [
    ticketLink,
    payerName,
    payeeId,
    timestamp
  ] = row;

  await fillForm({
    ticketLink,
    payerName,
    payeeId,
    timestamp
  });

  console.log('Submitted form for:', ticketLink);
}
