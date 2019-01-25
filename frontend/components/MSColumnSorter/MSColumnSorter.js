import React from 'react';
import * as Table from 'reactabular-table';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';

// Header with icons
const ICONS = {
 default: <FaSort />,
 asc: <FaSortUp />,
 desc: <FaSortDown />
};


const HeaderLabel = ({ children = 'label', direction = 'default', priority = null,  sortable = false }) => {
  if(sortable) {
   return (<div>{children} {priority} {ICONS[direction]} </div>)
  }
  else
    return (<div>{children}</div>)
}

   // Binds all the events
const addTransforms = (columns, handleSortingColumns, sortingColumns) => {
  return columns.map(column => {
    return {
      ...column,
      header: {
        ...column.header,
        transforms: [
          (label, props) => ({
            onClick: (e) => props.column.sortable ?  handleSortingColumns(props.column.property, e.shiftKey)  : null, //this.sortColumn(props.column.property, e, rows)
            children: (
              <HeaderLabel 
                direction={sortingColumns[label] ? sortingColumns[label].direction : null}
                priority = {sortingColumns[label] ? sortingColumns[label].priority : null}
                sortable={props.column.sortable} 
                >
              {label}
              </HeaderLabel>
            )
          })
        ]
      }
    };
   });
}

export default class MSColumnSorter extends React.Component {
 render() {
   return (
     <Table.Provider
       className="table table-striped table-bordered"
       columns={addTransforms(this.props.columns, this.props.handleSortingColumns, this.props.sortingColumns)}>
      <Table.Header />
       <Table.Body rows={this.props.rows} rowKey="id" />
     </Table.Provider>
   );
 }
}
