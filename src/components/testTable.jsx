import React, { useMemo } from 'react';
import {
    Table as MaUTable,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableContainer,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useTable } from 'react-table';
import dataInterface from '../data/dataInterface';
import data from '../data/mockData.json';

const useStyles = makeStyles((theme) => {
    return {
        shipmentsTableWrapper: {
            width: '100%',
            height: '90vh',
            border: '2px solid rgba(0,0,0,.18)',
            overflow: 'scroll',
        },
        tableHeader: {
            fontSize: '12px',
            lineHeight: '16px',
            fontWeight: 600,
        },
        tableRow: {
            '&:nth-of-type(odd)': {
                backgroundColor: theme.palette.action.hover,
            },
        },
        tableCell: {
            fontSize: '12px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
    };
});

function TestTable() {
    const classes = useStyles();

    // memoize the data so we aren't rerendering on table adjustments
    const columns = useMemo(
        () => [
            {
                Header: 'Shipment Info',
                // only for PoC, so I don't have write 20 explicit columns
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

    // use the state and functions returned from useTable to build the UI
    const { getTableProps, headerGroups, rows, prepareRow } = useTable({
        columns,
        data,
    });

    return (
        <TableContainer className={classes.shipmentsTableWrapper}>
            <MaUTable {...getTableProps()}>
                <TableHead className={classes.tableHeader}>
                    {headerGroups.map((headerGroup) => (
                        <TableRow {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <TableCell {...column.getHeaderProps()}>
                                    {column.render('Header')}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableHead>
                <TableBody>
                    {rows.map((row, i) => {
                        prepareRow(row);
                        return (
                            <TableRow
                                className={classes.tableRow}
                                {...row.getRowProps()}
                            >
                                {row.cells.map((cell) => {
                                    return (
                                        <TableCell className={classes.tableCell} {...cell.getCellProps()}>
                                            {cell.render('Cell')}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </MaUTable>
        </TableContainer>
    );
}

export default TestTable;
