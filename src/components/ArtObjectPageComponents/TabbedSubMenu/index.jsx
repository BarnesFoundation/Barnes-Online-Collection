import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import PanelVisuallyRelated from '../PanelVisuallyRelated'
import PanelEnsemble from '../PanelEnsemble'
import PanelDetails from '../PanelDetails'
import { getArtObjectUrlFromId } from '../../../helpers';

class TabbedSubMenu extends Component {
  constructor(props) {
    super(props);

    const tabList = [
      {
        title: 'Visually Related',
        slug: '',
      },
      {
        title: 'Ensemble',
        slug: 'ensemble',
      },
      {
        title: 'Details',
        slug: 'details',
      },
    ];

    this.state = { tabs: tabList };
  }

  getTab() {
    switch(this.props.slug) {
      case 'ensemble':
        return <PanelEnsemble ensembleIndex={this.props.object.ensembleIndex} />;
      case 'details':
        return <PanelDetails />;
      default:
        return <PanelVisuallyRelated modalPreviousLocation={this.props.modalPreviousLocation}/>;
    }
  }

  render() {
    const ensembleIsDisabled = !this.props.object.ensembleIndex;

    return (
      <div>
        <div className="container">
          <nav className="m-tabs m-tabs--post-cta" data-behavior="Tabs">
            <div className="m-tabs__list">
              {
                this.state.tabs
                  .map(tabData => {
                    const isSelected = tabData.slug === this.props.slug;

                    return (
                      <div key={tabData.slug} className="m-tabs__item">
                        <Link
                          className="m-tabs__link"
                          aria-current={isSelected}
                          to={{
                            pathname: getArtObjectUrlFromId(this.props.object.id, tabData.slug),
                            state: {
                              isModal: !!this.props.modalPreviousLocation,
                              modalPreviousLocation: this.props.modalPreviousLocation
                            },
                          }}
                          onClick={this.handleContentTabClick(tabData.slug, ensembleIsDisabled)}
                          data-is-disabled={ensembleIsDisabled}
                        >
                          {tabData.title}
                        </Link>
                      </div>
                    );
                  })
              }
            </div>
          </nav>
        </div>
        <div className="container">
          {this.getTab()}
        </div>
      </div>
    );
  }

  selectTab(tabKey) {
    this.setState({selectedTab: tabKey});
  }

  handleContentTabClick(slug, isDisabled) {
    return function(e) {
      if(isDisabled) {
        e.preventDefault();
        return;
      }

      this.selectTab(slug);
    }.bind(this);
  }
}

export default TabbedSubMenu;
