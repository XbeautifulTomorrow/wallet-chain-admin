/* eslint-disable */
import { saveAs } from 'file-saver'
// import {  } from 'exceljs'
const ExcelJS = require('exceljs')

function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}

export function toexcel() {
  var workbook = new ExcelJS.Workbook();
  var worksheet = workbook.addWorksheet('My Sheet');
  worksheet.addRow({ id: 1, name: 'John Doe', dob: new Date(1970, 1, 1) });
  saveAs(new Blob([s2ab(worksheet)], {
    type: "application/octet-stream"
  }), 'a.excel');
}