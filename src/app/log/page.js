"use client";

import { useState } from "react";
import logs from "../../../public/data/logs.json";

export default function LogTable() {
  const [rows, setRows] = useState(logs);
  const [sortDirections, setSortDirections] = useState({});

  const sortTable = (columnIndex) => {
    const isDate = columnIndex === 2;
    const currentDir = sortDirections[columnIndex] === "asc" ? "desc" : "asc";
    setSortDirections({ [columnIndex]: currentDir });

    const sorted = [...rows].sort((a, b) => {
      let valA, valB;

      switch (columnIndex) {
        case 0:
          valA = a.name;
          valB = b.name;
          break;
        case 1:
          valA = a.action;
          valB = b.action;
          break;
        case 2:
          valA = new Date(a.date);
          valB = new Date(b.date);
          break;
        default:
          return 0;
      }

      if (valA < valB) return currentDir === "asc" ? -1 : 1;
      if (valA > valB) return currentDir === "asc" ? 1 : -1;
      return 0;
    });

    setRows(sorted);
  };

  const renderArrow = (colIndex) => {
    if (sortDirections[colIndex] === "asc") return "↓";
    if (sortDirections[colIndex] === "desc") return "↑";
    return "";
  };

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">File History</h1>

      <table className="border-collapse border-spacing-0">
        <thead>
          <tr className="bg-neutral-700">
            <th className="pl-2 cursor-pointer" onClick={() => sortTable(0)}>
              File name <span id="arrow0">{renderArrow(0)}</span>
            </th>
            <th className="pl-16 py-1 cursor-pointer" onClick={() => sortTable(1)}>
              Action <span id="arrow1">{renderArrow(1)}</span>
            </th>
            <th className="pl-16 py-1 pr-2 cursor-pointer" onClick={() => sortTable(2)}>
              Date <span id="arrow2">{renderArrow(2)}</span>
            </th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx} className="even:bg-neutral-800">
              <td className="pl-2">{row.name}</td>
              <td className="pl-16 py-1">{row.action}</td>
              <td className="pl-16 py-1 pr-2">{row.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
