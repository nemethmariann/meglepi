// Ezt kell bemásolni a Google Táblázat Apps Script szerkesztőjébe
// (Bővítmények → Apps Script), majd webalkalmazásként közzétenni.
const COLUMNS = ["Időpont", "Név", "Email", "Cím", "Email-pontszám", "Vicces?", "Ráér?", "Sorszám", "Helyszín", "Teszt"];

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sheet.getLastRow() === 0) sheet.appendRow(COLUMNS);
  const d = JSON.parse(e.postData.contents);
  sheet.appendRow([
    new Date(), d.name, d.email, d.address, d.emailScore,
    d.funny, d.available, d.serial, d.location, d.test,
  ]);
  return ContentService.createTextOutput("ok");
}
