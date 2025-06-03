import React from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, editHandler, deleteHandler, toggleDoneHandler }) => {
  if (tasks.length === 0) {
    return <h2>No Tasks Available</h2>;
  }

  return (
    <ul>
      {tasks.map((t, i) => (
        <TaskItem
          key={i}
          task={t}
          index={i}
          onEdit={editHandler}
          onDelete={deleteHandler}
          onToggleDone={toggleDoneHandler}
        />
      ))}
    </ul>
  );
};

export default TaskList;
