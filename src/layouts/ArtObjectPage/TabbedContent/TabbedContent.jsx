import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import PanelVisuallyRelated from '../PanelVisuallyRelated'
import PanelEnsemble from '../PanelEnsemble'
import PanelDetails from '../PanelDetails'

class TabbedContent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Tabs defaultIndex={0}>
        <TabList>
          <Tab>Visually Related</Tab>
          <Tab>Ensemble</Tab>
          <Tab>Details</Tab>
        </TabList>
        <TabPanel>
          <PanelVisuallyRelated/>
        </TabPanel>
        <TabPanel>
          <PanelEnsemble/>
        </TabPanel>
        <TabPanel>
          <PanelDetails/>
        </TabPanel>
      </Tabs>
    );
  }
}

export default TabbedContent;
