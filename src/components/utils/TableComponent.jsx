import React, { useState } from 'react'
import { Table, TableHead, TableRow, TableCell, TableBody, TablePagination } from '@mui/material';

export default function TableComponent({ header, data, profile }) {
    console.log("TableComponent data:", data);
    console.log("TableComponent header:", header);
      const [page, setPage] = useState(0);
      const [rowsPerPage, setRowsPerPage] = useState(10);
  return (
    <>
        <Table stickyHeader>
            <TableHead>
                <TableRow>
                {header.map((col) => (
                    <TableCell key={col.id} sx={{ minWidth: 100, bgcolor: 'primary.main', color: 'white', }}>
                    {col.label}
                    </TableCell>
                ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                <TableRow key={row.id}>
                    {header.map((col) => (
                    <TableCell key={col.id}>
                        {col.render ? col.render(row) : (row[col.key] ?? '-')}
                    </TableCell>
                    ))}
                </TableRow>
                ))}
            </TableBody>
        </Table>

        <TablePagination
            component="div"
            count={data.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
            }}
            />
    </>
  )
}
