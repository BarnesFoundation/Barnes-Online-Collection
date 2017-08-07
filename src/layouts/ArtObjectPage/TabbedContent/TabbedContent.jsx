import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import PanelVisuallyRelated from '../PanelVisuallyRelated'
import PanelEnsemble from '../PanelEnsemble'
import PanelDetails from '../PanelDetails'

class TabbedContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTab: this.props.slug,
      tabs: {
        visuallyRelated: {
          title: 'Visually Related',
          slug: '',
        },
        ensemble: {
          title: 'Ensemble',
          slug: 'ensemble',
        },
        details: {
          title: 'Details',
          slug: 'details',
        },
      },
    };
  }

  render() {
    return (
      <div>
        {
          Object.keys(this.state.tabs)
            .map(key => {
              const tabData = this.state.tabs[key];

              return (
                <Link
                  to={this.props.baseUrl + tabData.slug}
                  onClick={this.handleContentTabClick(tabData.slug)}
                >
                  {tabData.title}
                </Link>
              );
            })
        }

        {this.state.selectedTab === '' &&
          <PanelVisuallyRelated/>
        }
        {this.state.selectedTab === 'ensemble' &&
          <PanelEnsemble/>
        }
        {this.state.selectedTab === 'details' &&
          <PanelDetails/>
        }
      </div>
    );
  }

  selectTab(tabKey) {
    this.setState({selectedTab: tabKey});
  }

  handleContentTabClick(slug) {
    return function(e) {
      this.selectTab(slug);
    }.bind(this);
  }
}

export default TabbedContent;
