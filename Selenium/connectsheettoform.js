const rows = await getSheetData();

for (const row of rows) {
  const [
    ticketLink,
    payerName,
    payeeId,
    timestamp,
    dropdown1,
    dropdown2,
    dropdown3,
    reviewer
  ] = row;

  // Call your fillForm() function here with the values
  await fillForm({
    ticketLink,
    payerName,
    payeeId,
    timestamp,
    dropdownOptions: [
      dropdown1, dropdown2, 'Checked', 'Checked', 'Verified', 'Yes', 'NA', reviewer
    ]
  });

  console.log('Submitted form for:', ticketLink);
}
