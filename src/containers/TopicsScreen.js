// containers are "smart" react components that are aware of redux
// they are connected to the redux store and listen on part of the app state
// they use mapStateToProps to specify which parts and use selectors to read them
// avoid having view logic & local component state in them, use "dumb" components instead

import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import './TopicsScreen.css';
import * as topicsActions from '../store/topics/actions';
import * as topicsSelectors from '../store/topics/reducer';
import ListView from '../components/ListView';
import ListRow from '../components/ListRow';

class TopicsScreen extends Component {

  constructor(props) {
    super(props);
    autoBind(this);
  }

  componentDidMount() {
    this.props.dispatch(topicsActions.fetchTopics());
  }

  render() {
    if (!this.props.rowsById) return this.renderLoading();
    return (
      <div className="TopicsScreen">
        <h3>Choose 3 topics of interest</h3>
        <ListView
          rowsIdArray={this.props.rowsIdArray}
          rowsById={this.props.rowsById}
          renderRow={this.renderRow} />
        {!this.props.canFinalizeSelection ? false :
          <button className="NextScreen" onClick={this.onNextScreenClick} />
        }
      </div>
    );
  }

  renderLoading() {
    return (
      <p>Loading...</p>
    );
  }

  renderRow(rowId, row) {
    const selected = this.props.selectedRowsById[rowId];
    return (
      <ListRow
        rowId={rowId}
        onClick={this.onRowClick}
        selected={selected}>
        <h3>{row.title}</h3>
        <p>{row.description}</p>
      </ListRow>
    )
  }

  onRowClick(rowId) {
    this.props.dispatch(topicsActions.selectTopic(rowId));
  }

  onNextScreenClick() {
    this.props.dispatch(topicsActions.finalizeTopicSelection());
  }

}

// which props do we want to inject, given the global store state?
// always use selectors here and avoid accessing the state directly
function mapStateToProps(state) {
  const [topicsByUrl, topicsUrlArray] = topicsSelectors.getTopics(state);
  return {
    rowsById: topicsByUrl,
    rowsIdArray: topicsUrlArray,
    selectedRowsById: topicsSelectors.getSelectedTopicsByUrl(state),
    canFinalizeSelection: topicsSelectors.isTopicSelectionValid(state)
  };
}

export default connect(mapStateToProps)(TopicsScreen);
