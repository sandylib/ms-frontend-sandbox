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
  { id: 1, name: 'jack', family: 'hanson', city: 'sydney', score: 100 }, 
  { id: 2, name: 'peter', family: 'street', city: 'melbourne', score: 200 }, 
  { id: 3, name: 'joe', family: 'larson', city: 'brisbane', score: 300 }, 
  { id: 4, name: 'simon', family: 'long', city: 'perth', score: 400 }, 
  { id: 5, name: 'abraham', family: 'blue', city: 'darwin', score: 500 } 
];



export class Sample extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
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

              <MSColumnSorter columns={ columns } rows= {rows}  />
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
