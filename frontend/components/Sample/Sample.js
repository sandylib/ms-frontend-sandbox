import React from 'react';
import { connect } from 'react-redux';
import {
  Button,
  ButtonToolbar,
  ButtonGroup
} from 'react-bootstrap';

import {
  getRoutePath
} from 'CommonUtil/CommonUtil.js';

import MyTable from 'MyTable/MyTable.js';
import MyModal from 'MyModal/MyModal.js';
import MSColumnSorter from 'MSColumnSorter/MSColumnSorter.js';


const columns = [
  {
    property: 'id',
    header: {
      label: 'id'
    },
    sortable: false
  },
  {
    property: 'name',
    header: {
      label: 'name'
    },
    sortable: true,
    priority: 3,
  },
  {
    property: 'family',
    header: {
      label: 'family'
    },
    sortable: false
  },
  {
    property: 'city',
    header: {
      label: 'city'
    },
    priority: 2,
    sortable: true
  },
  {
    property: 'score',
    header: {
      label: 'score',
    },
    priority: 1,
    sortable: true
  }
];

const rows = [
  { id: 1, name: 'jack', family: 'hanson', city: 'sydney', score: 600 }, 
  { id: 2, name: 'peter', family: 'street', city: 'melbourne', score: 200 }, 
  { id: 3, name: 'joe', family: 'larson', city: 'brisbane', score: 300 }, 
  { id: 4, name: 'simon', family: 'long', city: 'perth', score: 400 }, 
  { id: 5, name: 'abraham', family: 'blue', city: 'darwin', score: 500 } 
];

function doSort(items, property, direction) {
  switch (direction) {
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

const defaultSortingColumns = columns
  .filter(column => column.sortable)
  .reduce((accumulator, column) => ({ ...accumulator,
    [column.property]: {
      priority: null,
      direction: 'default', // (column.property === 'name') ? 'asc' : 
    }
  }), {});

export class Sample extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      sortingColumns: defaultSortingColumns
    };
    this.getNextDirection = this.getNextDirection.bind(this);
    this.getSortedRows = this.getSortedRows.bind(this);
    this.handleSortingColumns = this.handleSortingColumns.bind(this);
    this.getLowestExistingPriority = this.getLowestExistingPriority.bind(this);
  }

  getNextDirection(direction) {
    const SORT_ORDER = ['default', 'asc', 'desc'];
    const currentIndex = SORT_ORDER.findIndex(s => s === direction);
    const newIndex = (currentIndex + 1) % SORT_ORDER.length;
    return SORT_ORDER[newIndex];
  };

  getSortedRows(rows, sortingColumns) {
    let sortedRows = [...rows];
    const sortingColumnsWithPriorities = Object.keys(sortingColumns).filter(name => sortingColumns[name].priority !== null);

    if (sortingColumnsWithPriorities.length) {
      const orderedPropertyNames = sortingColumnsWithPriorities
        .sort((name1, name2) => {
          const priority1 = sortingColumns[name1].priority;
          const priority2 = sortingColumns[name2].priority;
          return priority1 < priority2 ? 1 : -1;
        });
        
        orderedPropertyNames.forEach(propertyName => {
          sortedRows = doSort(sortedRows, propertyName, sortingColumns[propertyName].direction)
        });
    } else { 
      Object.keys(sortingColumns).forEach(propertyName => {
        sortedRows = doSort(sortedRows, propertyName, sortingColumns[propertyName].direction)
      });
    }

    return sortedRows;
  }

   getLowestExistingPriority () {
    const priorityPropertyNames = Object.keys(this.state.sortingColumns).filter(propertyName => this.state.sortingColumns[propertyName].priority !== null)
    if (!priorityPropertyNames.length) return null;
    let lowestPriority = 0;
    
    priorityPropertyNames.forEach(propertyName => {
      const priority = this.state.sortingColumns[propertyName].priority;
      
      if (priority > lowestPriority) lowestPriority = priority;
    })
    return lowestPriority;
  }

  handleSortingColumns(propertyName, isShiftKey)  {
    let shiftKeySortingColumns, updatedPriority;
    let normalClickSortingColumns = this.state.sortingColumns;
    const propertyState = this.state.sortingColumns[propertyName];
    if (isShiftKey) {
      if (propertyState.priority !== null) {
        const updatedSortingColumns = {
          ...this.state.sortingColumns,
          [propertyName]: {
            ...this.state.sortingColumns[propertyName], priority: null
          }
        }
        return this.setState({sortingColumns: updatedSortingColumns })
      }
      const lowestPriority = this.getLowestExistingPriority();
  
      if (lowestPriority === null) {
        updatedPriority = 1;
      } else {
          updatedPriority = lowestPriority + 1; // make it next lowest priority
      }

      const nextDirection = this.getNextDirection(propertyState.direction);
      shiftKeySortingColumns =  { ...this.state.sortingColumns, [propertyName]: { priority: updatedPriority, direction: nextDirection }}
    } else {
      updatedPriority = null;
      const nextDirection = this.getNextDirection(propertyState.direction);
      normalClickSortingColumns = { ...defaultSortingColumns, [propertyName]: { priority: null, direction: nextDirection } }
   }

   const updatedSortingColumns = isShiftKey ? shiftKeySortingColumns : normalClickSortingColumns;
   this.setState({ sortingColumns: updatedSortingColumns });
  }



  showMyModal() {
    console.log('showMyModal called');
    this.props.showMyModal();
  }

  render() {
    return (
      <div>
        <h1>Components samples</h1>
        <ButtonGroup>
          <Button onClick={() => this.context.router.push(getRoutePath()) } >Goto Dashboard</Button>
        </ButtonGroup>
        <h2>Modal, Button toolbar:</h2>
        <ButtonToolbar>
          <ButtonGroup>
            <Button onClick={this.showMyModal.bind(this) }>Show my modal</Button>
          </ButtonGroup>
        </ButtonToolbar>
        <h2>Table:</h2>
        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-12">
              {/* <MyTable /> */}

              <MSColumnSorter 
               columns={ columns } 
               rows= {this.getSortedRows(rows, this.state.sortingColumns)}
               sortingColumns={ this.state.sortingColumns }
               handleSortingColumns={this.handleSortingColumns} />
            </div>
          </div>
        </div>
        <MyModal />
      </div>
    );
  }
}

// latest way to dispatch
Sample.contextTypes = {
    // @see https://github.com/grommet/grommet/issues/441
  router: React.PropTypes.object.isRequired
};

function mapDispatchToProps(dispatch) {
  return({
    showMyModal: function() {
      return dispatch({
        type: 'EVT_SHOW_MY_MODAL',
        showMyModal: true
      });
    }
  });
}

export default connect(
  function (storeState) {
    // store state to props
    return {
    };
  },
  mapDispatchToProps
)(Sample);
