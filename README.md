# React-table v7 and MUI PoC

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). Its purpose is to explore the relationship between `react-table` v7.x with MUI. 

### Installation

In the project directory, run:

#### `yarn install`

### Running the app

In the project directory, run:

#### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

# Current Limitations and Struggles
- Sorting columns and dragging is laggy
- Eventually we will want to enable and disable certain columns


# Findings

Table was rendered with 20 columns and 200 rows. Modify `const data = mockData.slice(0, 200)` on `line 68` to try different row counts. 

### Pros

- `react-tables` v7.7 successfully integrated with MUI core v4.12
- Ease of use for column resizing is very streamlined. `react-table` props can be easily spread into existing MUI elements. 
- Enabling and disabling columns can easily be implemented ([link to API](https://react-table.tanstack.com/docs/examples/column-hiding))
- Smooth operation through use of `react-window` and virtualization.

### Cons
~~Resizing columns greater than 50 rows is still laggy, even utulizing the performance enhancing plugin hooks `react-table` offers such as `useAbsoluteLayout` and `useBlockLayout`~~

Remedied through use of `react-window` and virtualization of the table rows. 

