import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ObjectsActions from '../../actions/objects';
import * as ObjectActions from '../../actions/object';
import ArtObjectCard from '../ArtObject/ArtObjectCard';
import './searchResults.css';

class SearchResults extends Component {
  componentDidMount() {
    if (this.props.objects.length === 0) {
      this.props.getObjects();
    }
  }

  render() {
    const { objects } = this.props;
    return (
      <ul className="search-results">
        {objects.map(object => {
          return (
            <li
              key={object.id}
              onClick={() => {
                this.props.setObject(object);
                this.props.history.push(`/objects/${object.id}`)
              }}
            >
              <ArtObjectCard
                title={object.title}
                people={object.people}
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

SearchResults.propTypes = {
  getObjects: PropTypes.func.isRequired
};

SearchResults.defaultProps = {
  objects: []
}

function mapStateToProps(state) {
  return {
    objects: state.objects
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, ObjectsActions, ObjectActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchResults);
