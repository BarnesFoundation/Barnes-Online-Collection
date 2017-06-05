import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ObjectActions from '../actions/objects';
import ArtObject from './ArtObject';

class Results extends Component {
  componentDidMount() {
    this.props.getObjects();
  }

  render() {
    const { objects } = this.props; 
    return (
      <ul>
        {objects.map(object => {
          return (
            <li key={object.id}>
              <ArtObject 
                title={object.title}
                artist={object.people}
                medium={object.medium}
                imageUrlSmall={object.imageUrlSmall}
              />
            </li>
          );
        })}
      </ul>
    );
  }
}

Results.propTypes = {
  getObjects: PropTypes.func.isRequired
};

Results.defaultProps = {
  objects: []
}

function mapStateToProps(state) {
  return {
    objects: state.objects
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, ObjectActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Results);
