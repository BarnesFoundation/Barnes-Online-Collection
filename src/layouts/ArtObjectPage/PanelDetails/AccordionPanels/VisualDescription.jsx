import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class AccordionTab extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const isSelected = this.props.isSelected;
    const idx = this.props.idx;

    return (
      <div className="m-accordion-tabs__inner">
        <div dangerouslySetInnerHTML={{__html: this.props.visualDescription}}></div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return Object.assign({}, {artObject: state.object});
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AccordionTab);
