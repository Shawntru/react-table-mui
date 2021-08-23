import React, { useMemo } from 'react';

import MaUTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { useTable } from 'react-table';
import dataInterface from '../data/dataInterface';
import data from '../data/mockData.json';

function TestTable() {
    const columns = useMemo(
        () => [
            {
                Header: 'Shipment Info',
                // only for PoC, so I don't have write 80 explicit columns
                columns: dataInterface.map((keyName) => {
                    return {
                        Header: keyName,
                        accessor: keyName,
                    };
                }),
            },
        ],
        []
    );

    // Use the state and functions returned from useTable to build your UI
    const { getTableProps, headerGroups, rows, prepareRow } = useTable({
        columns,
        data,
    });

    // Render the UI for your table
    return (
        <MaUTable {...getTableProps()}>
            <TableHead>
                {headerGroups.map((headerGroup) => (
                    <TableRow {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            <TableCell {...column.getHeaderProps()}>{column.render('Header')}</TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableHead>
            <TableBody>
                {rows.map((row, i) => {
                    prepareRow(row);
                    return (
                        <TableRow {...row.getRowProps()}>
                            {row.cells.map((cell) => {
                                return <TableCell {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>;
                            })}
                        </TableRow>
                    );
                })}
            </TableBody>
        </MaUTable>
    );
}

export default TestTable;
