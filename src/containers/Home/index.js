import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { get as _get } from 'lodash';
import action from '../../actions';
import Item from './Item';
import AddItem from './AddItem';
import ErrorComponent from './Error';
import withEditTask from './withEditTask';

import './style.scss';
import './buttons.scss';

// do not create component in render method
const AddItemComponent = withEditTask(AddItem);

export class HomeComponent extends Component {
  static propTypes = {
    currentEditingTaskId: PropTypes.any,
    fetchTasks: PropTypes.func.isRequired,
    tasks: PropTypes.array.isRequired,
  }

  static defaultProps = {
    currentEditingTaskId: null,
  }

  componentDidMount() {
    this.props.fetchTasks();
  }

  render() {
    const { currentEditingTaskId, tasks } = this.props;

    return (
      <div className="page--home">
        <Helmet>
          <title>Home</title>
          <meta content="home page shows posts" name="description" />
          <meta content="home page" name="og:title" />
        </Helmet>

        <ErrorComponent />

        {/* Add function */}
        <AddItemComponent />

        <div className="list--task">
          {tasks.map((task) => {
            const mode = task.id === currentEditingTaskId ? 'EDIT' : 'NORMAL';
            return <Item key={task.id} mode={mode} task={task} />;
          })}
        </div>

      </div>
    );
  }
}

export function mapStateToProps(state) {
  const taskEntity = _get(state, 'entities.task', {});
  const pagesHome = _get(state, 'pages.home');
  const taskIds = _get(pagesHome, 'tasks', []);
  const tasks = taskIds.map((id) => {
    return taskEntity[id] || {};
  });
  const currentEditingTaskId = _get(pagesHome, 'currentEditingTaskId');

  return {
    tasks,
    currentEditingTaskId,
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    fetchTasks: () => {
      return dispatch(action.fetchTasks());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeComponent);
