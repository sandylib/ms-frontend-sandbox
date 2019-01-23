import React from 'react';
import * as Table from 'reactabular-table';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';

// Header with icons
const ICONS = {
 default: <FaSort />,
 asc: <FaSortUp />,
 desc: <FaSortDown />
};

// Rotate through sorting order
const SORT_ORDER = ['default', 'asc', 'desc'];
const getNextOrder = (current = 'default') => {
 const currentIndex = SORT_ORDER.findIndex(s => s === current);
 const newIndex = (currentIndex + 1) % SORT_ORDER.length;
 return SORT_ORDER[newIndex];
};

const HeaderLabel = ({ children = 'label', order = 'default', sortable = false, selectedCol }) => {
  if(sortable) {
    order = selectedCol ? order : 'default';
   return (<div>{children} {ICONS[order]} </div>)
  }
  else
    return (<div>{children}</div>)
}


export default class MSColumnSorter extends React.Component {
 constructor(props) {
   super(props);

   // Similar to _orderBy
   this.doSort = (items, property, order) => {
     switch (order) {
       case 'asc':
         return [
           ...items.sort((a, b) => {
             return a[property] > b[property] ? 1 : -1;
           })
         ];
       case 'desc':
         return [
           ...items.sort((a, b) => {
             return a[property] < b[property] ? 1 : -1;
           })
         ];
       default:
         return [...items];
     }
   };

   this.sortColumn = (property, e, originalRows) => { // code

     const newColumns = [...this.state.columns];

     let newRows = [...this.state.rows]; // this have not use yet
     // Find the target column we want to sort
     const index = newColumns.findIndex(col => col.property === property);
     const targetColumn = newColumns[index];

     const newOrder = getNextOrder(newColumns[index].header.order);
     newColumns[index].header.order = getNextOrder(
       newColumns[index].header.order
     );

     if(e.shiftKey) { //TODO
      // console.log('key', e) //
      // newRows = this.doSort(newRows, property, newOrder);
    }else {
      newRows = this.doSort(originalRows, property, newOrder); 
    }     
     debugger;

     let targetLable = e.shiftKey ?  targetColumn.header.label : ''; // will be target lables
    
     this.setState({ columns: addTransforms(newColumns, newRows, targetLable), rows: newRows });
   };



   // Binds all the events
   const addTransforms = (columns, rows, selectedCol) =>
     columns.map(column => {
       return {
         ...column,
         header: {
           ...column.header,
           transforms: [
             (label, props) => ({
               onClick: (e) => props.column.sortable ?  this.sortColumn(props.column.property, e, rows) : null, 
               children: (
                 <HeaderLabel order={props.column.header.order} sortable={props.column.sortable} selectedCol={selectedCol === label} >
                   {label}
                 </HeaderLabel>
               )
             })
           ]
         }
       };
     });

   this.state = {
     columns: addTransforms(this.props.columns, this.props.rows),
     rows: [...this.props.rows]
   };
 }

 render() {
   return (
     <Table.Provider
       className="table table-striped table-bordered"
       columns={this.state.columns}
     >

<Table.Header />
       <Table.Body rows={this.state.rows} rowKey="id" />
     </Table.Provider>
   );
 }
}
