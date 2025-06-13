// const fs = require('fs');
// const XLSX = require('xlsx');
// const path = require('path');

// // Use /tmp instead of __dirname to be compatible with Vercel
// const exportDir = path.join('/tmp', 'exports');
// if (!fs.existsSync(exportDir)) {
//     fs.mkdirSync(exportDir);
// }

// const excelFilePath = path.join(exportDir, 'form_submissions.xlsx');

// function saveToExcel(newData) {
//     let workbook;
//     let worksheet;

//     if (fs.existsSync(excelFilePath)) {
//         workbook = XLSX.readFile(excelFilePath);
//         worksheet = workbook.Sheets[workbook.SheetNames[0]];
//     } else {
//         workbook = XLSX.utils.book_new();
//         worksheet = XLSX.utils.json_to_sheet([]);
//         XLSX.utils.book_append_sheet(workbook, worksheet, 'Submissions');
//     }

//     const existingData = XLSX.utils.sheet_to_json(worksheet);
//     existingData.push(newData);

//     const updatedSheet = XLSX.utils.json_to_sheet(existingData);
//     workbook.Sheets['Submissions'] = updatedSheet;
//     XLSX.writeFile(workbook, excelFilePath);
// }

// module.exports = { saveToExcel, excelFilePath };
