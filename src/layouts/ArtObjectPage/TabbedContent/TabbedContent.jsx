import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import PanelVisuallyRelated from '../PanelVisuallyRelated'
import PanelEnsemble from '../PanelEnsemble'
import PanelDetails from '../PanelDetails'

const getTabFromSlug = slug => {
  return tabList.find(tab => {
    return slug === tab.slug;
  });
}

const tabList = [
  {
    title: 'Visually Related',
    slug: '',
    contentBlock: <PanelVisuallyRelated/>,
  },
  {
    title: 'Ensemble',
    slug: 'ensemble',
    contentBlock: <PanelEnsemble/>,
  },
  {
    title: 'Details',
    slug: 'details',
    contentBlock: <PanelDetails/>,
  },
];

class TabbedContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTab: this.props.slug,
      tabs: tabList,
    };
  }

  render() {
    const contentBlock = getTabFromSlug(this.state.selectedTab).contentBlock;

    return (
      <div>
        <div className="container">
          <nav className="m-tabs m-tabs--post-cta" data-behavior="Tabs">
            <div className="m-tabs__list">
              {
                this.state.tabs
                  .map(tabData => {
                    const isSelected = tabData.slug === this.state.selectedTab;

                    return (
                      <div className="m-tabs__item">
                        <Link
                          className="m-tabs__link"
                          aria-current={isSelected}
                          to={this.props.baseUrl + tabData.slug}
                          onClick={this.handleContentTabClick(tabData.slug)}
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
          {contentBlock}
        </div>
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
