import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PanelVisuallyRelated from '../PanelVisuallyRelated'
import PanelEnsemble from '../PanelEnsemble'
import PanelDetails from '../PanelDetails'
import FlickityMenu from './FlickityMenu'
import { getArtObjectUrlFromId } from '../../../helpers'
import MediaQuery from 'react-responsive'
import { BREAKPOINTS } from '../../../constants'

class TabbedSubMenu extends Component {
  constructor(props) {
    super(props)

    const tabList = [
      {
        title: 'Information',
        slug: '',
      },
      {
        title: 'Ensemble',
        slug: 'ensemble',
      },
      {
        title: 'Visually Similar',
        slug: 'visually-similar',
      },
    ]

    this.state = { tabs: tabList }
  }

  getTab() {
    switch(this.props.slug) {
      case 'ensemble':
        return <PanelEnsemble ensembleIndex={this.props.object.ensembleIndex} />
      case 'visually-similar':
        return <PanelVisuallyRelated modalPreviousLocation={this.props.modalPreviousLocation}/>
      default:
        return <PanelDetails />
    }
  }

  render() {
    const ensembleIsDisabled = !this.props.object.ensembleIndex
    const props = this.props

    const selectedIndex = this.state.tabs.map(function(tab) {
      return tab.slug
    }).indexOf(this.props.slug)

    const tabsList = this.state.tabs.map(tabData => {
      const isSelected = tabData.slug === props.slug
      const isDisabled = ensembleIsDisabled && tabData.slug === 'ensemble';

      return (
        <div key={tabData.slug} className="m-tabs__item">
          <Link
            className="m-tabs__link"
            aria-current={isSelected}
            to={{
              pathname: getArtObjectUrlFromId(props.object.id, props.object.title, tabData.slug),
              state: {
                isModal: !!props.modalPreviousLocation,
                modalPreviousLocation: props.modalPreviousLocation
              },
            }}
            onClick={this.handleContentTabClick(tabData.slug, isDisabled)}
            data-is-disabled={isDisabled}
          >
            {tabData.title}
          </Link>
        </div>
      )
    })

    return (
      <div>
        <div className="container">
          <nav className="m-tabs m-tabs--post-cta" data-behavior="Tabs">
            <MediaQuery maxWidth={BREAKPOINTS.tablet_max}>
              <FlickityMenu
                tabsList={tabsList}
                selectedIndex={selectedIndex}
              />
            </MediaQuery>
            <MediaQuery minWidth={BREAKPOINTS.tablet_max}>
              <div className="m-tabs__list tabs-list-desktop">
                {tabsList}
              </div>
            </MediaQuery>

          </nav>
        </div>
        <div className="container">
          {this.getTab()}
        </div>
      </div>
    )
  }

  selectTab(tabKey) {
    this.setState({selectedTab: tabKey})
  }

  handleContentTabClick(slug, isDisabled) {
    return function(e) {
      if(isDisabled) {
        e.preventDefault()

        return
      }

      this.selectTab(slug)
    }.bind(this)
  }
}

export default TabbedSubMenu
