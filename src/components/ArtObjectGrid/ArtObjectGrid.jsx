import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import * as ObjectsActions from '../../actions/objects';
import * as ObjectActions from '../../actions/object';
import { getArtObjectUrlFromId } from '../../helpers';
import ArtObject from '../ArtObject/ArtObject';
import ViewMoreButton from './ViewMoreButton';

import './artObjectGrid.css';

class ArtObjectGrid extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.objects.length === 0) {
      this.props.getAllObjects();
    }
  }

  render() {
    const { objects } = this.props;

    return (
      <div>
        {objects.map(object => {
          return(
            <Link key={object.id} to={getArtObjectUrlFromId(object.id)}>
              <ArtObject
                key={object.id}
                title={object.title}
                people={object.people}
                medium={object.medium}
                imageUrlSmall={object.imageUrlSmall}
              />
            </Link>
          );
        })}
        <ViewMoreButton />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    objects: state.objects,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({},
    ObjectsActions,
    ObjectActions,
  ), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ArtObjectGrid);
