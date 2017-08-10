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
        <nav className="m-tabs m-tabs--post-cta" data-behavior="Tabs">
          <div className="m-tabs__list">
            {
              this.state.tabs
                .map(tabData => {
                  return (
                    <Link
                      className="m-tabs__link"
                      to={this.props.baseUrl + tabData.slug}
                      onClick={this.handleContentTabClick(tabData.slug)}
                    >
                      {tabData.title}
                    </Link>
                  );
                })
            }
          </div>
        </nav>
        {contentBlock}
      </div>
    );
  }

  selectTab(tabKey) {
    this.setState({selectedTab: tabKey});
  }

  handleContentTabClick(slug) {
    return function(e) {
      selectTab(slug);
    }.bind(this);
  }
}

export default TabbedContent;
