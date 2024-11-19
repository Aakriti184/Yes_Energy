import * as XLSX from 'xlsx';

// Function to read data from an Excel file
export const readExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        resolve(workbook);
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsArrayBuffer(file);
  });
};

// Function to extract and filter data
export const extractData = (workbook, dateRange) => {
  const sheetNames = workbook.SheetNames;
  let filteredData = [];

  sheetNames.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    
    // Assuming data[0] contains the headers
    const headers = data[0];
    const rows = data.slice(1);

    // Filter rows based on the date range
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);

    rows.forEach(row => {
      const date = new Date(row[headers.indexOf('date')]);
      if (date >= startDate && date <= endDate) {
        filteredData.push(row);
      }
    });
  });

  return filteredData;
};

// Function to handle multiple file paths
export const loadAndFilterData = async (filePaths, dateRange) => {
  let allData = [];
  
  for (const path of filePaths) {
    const response = await fetch(path);
    const file = await response.blob();
    const workbook = await readExcelFile(file);
    const data = extractData(workbook, dateRange);
    allData = allData.concat(data);
  }
  
  return allData;
};
