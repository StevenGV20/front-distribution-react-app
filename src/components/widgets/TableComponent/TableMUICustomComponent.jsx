import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";

const TableMUICustomComponent = ({ cols, children }) => {
  return (
    <TableContainer>
      <Table aria-label="collapsible table">
        <TableHead className="bg-gray-100 space-x-0">
          <TableRow>
            {cols.map((col) => (
              <TableCell align="center" key={col}>
                {col}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody className="">{children}</TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableMUICustomComponent;
