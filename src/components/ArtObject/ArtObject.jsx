import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ObjectActions from '../../actions/object';
import './artObject.css';
import { Link } from 'react-router-dom';

const copyrightMap = {
  1: {
    copy: 'In Copyright',
    link: 'http://rightsstatements.org/page/InC/1.0/?language=en'
  },
  3: {
    copy: 'ARS',
    link: 'http://rightsstatements.org/page/InC/1.0/?language=en'
  },
  4: {
    copy: 'Public Domain',
    link: 'https://creativecommons.org/publicdomain/mark/1.0/'
  },
  8: {
    copy: 'No Known Rights: Public Domain',
    link: 'https://creativecommons.org/publicdomain/mark/1.0/'
  },
  2: {
    copy: 'World Rights: Copyright Undetermined',
    link: 'http://rightsstatements.org/page/UND/1.0/?language=en'
  },
  10: {
    copy: 'World Rights: Public Domain',
    link: 'https://creativecommons.org/publicdomain/mark/1.0/'
  },
  6: {
    copy: 'No Known Claimant',
    link: 'http://rightsstatements.org/page/UND/1.0/?language=en'
  }
}

const getCopyright = (id) => {
  if (!id) return {link: "", copy: ""};
  return copyrightMap[id];
}

class ArtObject extends Component {
  constructor(props) {
    super(props);
    if (!props.title) {
      const id = props.match.params.id;
      this.props.getObject(id);
    }
  }

  render() {
    return (
      <section>
        <div className="art-object__header">
          <img className="art-object__image"src={this.props.imageUrlLarge} alt={this.props.title}/>
          <div className="art-object__tombstone">
            <h1 className="art-object__title">{this.props.title}</h1>
            <div className="art-object__labels">
              {this.props.people && <p className="art-object__label">Artist</p>}
              {this.props.culture && <p className="art-object__label">Culture</p>}
              <p className="art-object__label">Date</p>
              <p className="art-object__label">Medium</p>
            </div>
            <div>
              {this.props.people && <p>{this.props.people}</p>}
              {this.props.culture && <p>{this.props.culture}</p>}
              <p>{this.props.displayDate}</p>
              <p>{this.props.medium}</p>
            </div>
            <div className="art-object__short-description"
              dangerouslySetInnerHTML={{__html: this.props.shortDescription || this.props.description}}>
            </div>
          </div>
        </div>
        <div className="art-object__more-info">
          <div className="art-object__accordian-panel">
            <h2 className="art-object__accordian-title">Additional Information</h2>
            <div className="art-object__labels">
              <p className="art-object__label">Accession Number</p>
              <p className="art-object__label">Dimensions</p>
              <p className="art-object__label">Museum Location</p>
            </div>
            <div>
              <p>{this.props.invno}</p>
              <p>{this.props.dimensions}</p>
              <p>{`${this.props.room}, ${this.props.wall} Wall`}</p>
            </div>
          </div>
        </div>
        {this.props.provenance && <div className="art-object__more-info">
          <h2>Provenance</h2>
          <p>{this.props.provenance}</p>
        </div>}
        <div className="art-object__more-info">
          <h2>Bibliography</h2>
          <p>{this.props.bibliography}</p>
        </div>
        {this.props.visualDescription && <div className="art-object__more-info">
          <h2>Visual Discription</h2>
          <div dangerouslySetInnerHTML={{__html: this.props.visualDescription}}>
          </div>
        </div>}
        {this.props.longDescription && <div className="art-object__more-info">
          <h2>Long Description</h2>
          <div dangerouslySetInnerHTML={{__html: this.props.longDescription}}>
          </div>
        </div>}
        <div className="art-object__more-info">
          <h2>Copyright/Download</h2>
          <p className="art-object__label">
            <span>Copyright Status: </span>
            <a
              href={getCopyright(this.props.objRightsTypeId).link}
              target="_blank"
              rel="noopener noreferrer"
            >
            {getCopyright(this.props.objRightsTypeId).copy}
            </a>
          </p>
        </div>
        <footer className="art-object__footer">
          <Link to="/">Back to Results</Link>
        </footer>
      </section>
    );
  }
}

function mapStateToProps(state) {
  return {...state.object};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ObjectActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ArtObject);
