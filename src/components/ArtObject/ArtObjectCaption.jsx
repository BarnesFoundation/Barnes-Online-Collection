import React, { Component } from 'react';

class ArtObjectCaption extends Component {
  render() {
    return (
      <div className="art-object-caption">
        <h2 className="h2 font-simple-heading">
          {this.props.title}
        </h2>
        {this.props.people &&
          <h3 className="h3 color-light">
            {this.props.people}
          </h3>
        }
      </div>
    );
  }
}

export default ArtObjectCaption;
