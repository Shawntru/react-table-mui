/* eslint-disable no-debugger */
/* eslint-disable react/jsx-key */
import React, { useCallback, useMemo } from 'react';
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
import { FixedSizeList } from 'react-window';

import scrollbarWidth from './scrollbarWidth';
import dataInterface from '../data/dataInterface';
import mockData from '../data/mockData.json';

const useStyles = makeStyles((theme) => ({
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
        fontWeight: '600',
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
}));

function TestTable() {
    const classes = useStyles();

    // use this to adjust the length in rows of the rendered table for expirimentation. 200 is the max.
    // Table starts to get laggy at above ~50 rows.
    const data = mockData.slice(0, 200);

    // this is the default sizing for each column on render
    // these could be adjusted or even saved and then applied from user prefs
    const defaultColumn = useMemo(
        () => ({
            minWidth: 30,
            width: 125,
            maxWidth: 400,
        }),
        [],
    );

    // used in our react-window virtuilization, this allows correct formatting for the table width
    const scrollBarSize = useMemo(() => scrollbarWidth(), []);

    // memoize the data so we aren't rerendering on table adjustments
    const columns = useMemo(
        () => [
            {
                Header: 'Shipment Info',
                // only for PoC, so I don't have to write 20 explicit columns
                columns: dataInterface.map((keyName) => ({
                    Header: keyName,
                    accessor: keyName,
                })),
            },
        ],
        [],
    );

    // Use the functions returned from useTable to build the UI
    // useResizeColumns enables use of resizing columns, along with defaultColumn
    //      to define the initial sizing and spacing
    // totalColumnsWidth is necessary for using virtualization
    // This is also the place to add necessary hooks to use from react-table
    const {
        getTableProps,
        headerGroups,
        rows,
        prepareRow,
        getTableBodyProps,
        totalColumnsWidth,
        resetResizing,
    } = useTable(
        {
            columns,
            data,
            defaultColumn,
        },
        useBlockLayout,
        useResizeColumns,
    );

    // Used for virtualizing our rows using react-window
    // Essentially this is what would originally be in our JSX render return
    const RenderRow = useCallback(
        ({ index, style }) => {
            const row = rows[index];
            prepareRow(row);
            return (
                <div
                    {...row.getRowProps({
                        style,
                    })}
                    className={classes.tableRow}
                >
                    {row.cells.map((cell) => (
                        <div {...cell.getCellProps()} className={classes.tableCell}>
                            {cell.render('Cell')}
                        </div>
                    ))}
                </div>
            );
        },
        [prepareRow, rows],
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

                    <FixedSizeList
                        height={400}
                        itemCount={rows.length}
                        itemSize={35}
                        width={totalColumnsWidth + scrollBarSize}
                    >
                        {RenderRow}
                    </FixedSizeList>

                    {/* {rows.map((row, i) => {
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
                    })} */}
                </TableBody>

            </MaUTable>
        </TableContainer>
    );
}

export default TestTable;
