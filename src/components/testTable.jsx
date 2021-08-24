import React, { useMemo } from 'react';
import clsx from 'clsx';
import {
    Table as MaUTable,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableContainer,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useResizeColumns, useTable, useBlockLayout } from 'react-table';
import dataInterface from '../data/dataInterface';
import mockData from '../data/mockData.json';

const useStyles = makeStyles((theme) => {
    return {
        shipmentsTableWrapper: {
            width: '100%',
            height: '90vh',
            border: '2px solid rgba(0,0,0,.18)',
            overflow: 'scroll',
            display: 'inline-block',
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
            border: '1px solid rgba(0, 0, 0, 0.1)',
            padding: '0.75rem',
            // using absolute position resizer, this is needed to accurately space the column cells
            position: 'relative',
        },
        resizer: {
            display: 'inline-block',
            background: 'grey',
            width: '7px',
            radius: '50%',
            height: '100%',
            position: 'absolute',
            right: '0',
            top: '0',
            transform: 'translateX(50%)',
            zIndex: '1',
        },
        isResizing: {
            background: 'blue',
        },
    };
});

function TestTable() {
    const classes = useStyles();

    // use this to adjust the length in rows of the rendered table for expirimentation. 200 is the max.
    // Table starts to get laggy at above ~50 rows.
    const data = mockData.slice(0, 200)

    // this is the default sizing for each column on render
    // these could be adjusted or even saved and then applied from user prefs
    const defaultColumn = React.useMemo(
        () => ({
            minWidth: 30,
            width: 125,
            maxWidth: 400,
        }),
        []
    );

    // memoize the data so we aren't rerendering on table adjustments
    const columns = useMemo(
        () => [
            {
                Header: 'Shipment Info',
                // only for PoC, so I don't have to write 20 explicit columns
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

    // use the functions returned from useTable to build the UI
    // useResizeColumns enables use of resizing columns, along with defaultColumn
    // to define the initial sizing and spacing
    const {
        getTableProps,
        headerGroups,
        rows,
        prepareRow,
        getTableBodyProps,
        resetResizing,
    } = useTable(
        {
            columns,
            data,
            defaultColumn,
        },
        useBlockLayout,
        useResizeColumns
    );

    return (
        <TableContainer className={classes.shipmentsTableWrapper}>
            <button onClick={resetResizing}>Reset Resizing</button>
            <MaUTable {...getTableProps()}>
                <TableHead className={classes.tableHeader}>
                    {headerGroups.map((headerGroup) => (
                        <TableRow {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <TableCell {...column.getHeaderProps()}>
                                    {column.render('Header')}
                                    {/* Use column.getResizerProps to hook up the events correctly */}
                                    <div
                                        {...column.getResizerProps()}
                                        // use clsx to apply the resizer class, and also the isResizing class if actively resizing
                                        className={clsx({
                                            [classes.resizer]: true,
                                            [classes.isResizing]: column.isResizing,
                                        })}
                                    />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableHead>
                <TableBody {...getTableBodyProps()}>
                    {rows.map((row, i) => {
                        prepareRow(row);
                        return (
                            <TableRow
                                className={classes.tableRow}
                                {...row.getRowProps()}
                            >
                                {row.cells.map((cell) => {
                                    return (
                                        <TableCell
                                            className={classes.tableCell}
                                            {...cell.getCellProps()}
                                        >
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
