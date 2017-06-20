import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ObjectActions from '../../actions/object';
import * as PrintActions from '../../actions/prints';
import './artObject.css';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const copyrightMap = {
  1: {
    copy: 'In Copyright',
    link: 'http://rightsstatements.org/page/InC/1.0/?language=en',
    type: 'small'
  },
  3: {
    copy: 'ARS',
    link: 'http://rightsstatements.org/page/InC/1.0/?language=en',
    type: 'small'
  },
  4: {
    copy: 'Public Domain',
    link: 'https://creativecommons.org/publicdomain/mark/1.0/',
    type: 'large'
  },
  8: {
    copy: 'No Known Rights: Public Domain',
    link: 'https://creativecommons.org/publicdomain/mark/1.0/',
    type: 'large'
  },
  2: {
    copy: 'World Rights: Copyright Undetermined',
    link: 'http://rightsstatements.org/page/UND/1.0/?language=en',
    type: 'small'
  },
  10: {
    copy: 'World Rights: Public Domain',
    link: 'https://creativecommons.org/publicdomain/mark/1.0/',
    type: 'large'
  },
  6: {
    copy: 'No Known Claimant',
    link: 'http://rightsstatements.org/page/UND/1.0/?language=en',
    type: 'small'
  }
}

const getCopyright = (id) => {
  if (!id) return {link: '', copy: 'No Known Copyright', type: 'small'};
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

  componentDidMount() {
    if (this.props.prints.length === 0) {
      this.props.getPrints();
    }
  }

  render() {
    const printAvailable = this.props.prints.find((print) => {
      return print.id === this.props.invno
    });
    const colorSwatches = [];
    if (this.props.color) {
      for (let i = 0; i < 5; i++) {
        colorSwatches.push(
          <div className="art-object__color-swatch" style={{backgroundColor: this.props.color[`palette-closest-${i}`]}}>
          </div>
        );
      }
    }
    return (
      <section>
        <Helmet>
          <meta property="og:title" content={`${this.props.culture || this.props.people} - ${this.props.title}`} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={window.location.href} />
          <meta property="og:image" content={this.props.imageUrlLarge} />
        </Helmet>
        <div className="art-object__header">
          <div className="art-object__image-container">
            <img className="art-object__image" src={this.props.imageUrlLarge} alt={this.props.title}/>
            <div className="art-object__colors">
              {colorSwatches}
            </div>
            <div className="art-object__image-options no-print">
              <button>
                Zoom
              </button>
              <button>
                Share
              </button>
              <button onClick={window.print}>
                Print
              </button>
              {printAvailable && 
                <a href={printAvailable.url} target="_blank" rel="noopener noreferrer" >
                  Purchase Print
                </a>
              }
            </div>
          </div>
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
            {getCopyright(this.props.objRightsTypeId).type === "small" ?
              <div className="no-print">
                <button>
                  Request Image
                </button>
              </div>
              :
              <div className="no-print">
                <button onClick={this.props.getSignedUrl.bind(this, this.props.invno)}>
                  Download
                </button>
                <button>
                  Request Hi Res
                </button>
              </div>
            }
          </p>
        </div>
        <footer className="art-object__footer no-print">
          <Link to="/">Back to Results</Link>
        </footer>
      </section>
    );
  }
}

function mapStateToProps(state) {
  return Object.assign({}, {...state.object}, { prints: state.prints });
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, ObjectActions, PrintActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ArtObject);
