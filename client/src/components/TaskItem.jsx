import React from 'react';

const TaskItem = ({ task, index, onEdit, onDelete, onToggleDone }) => {
  return (
    <li
      className={`flex items-center justify-between mb-5 ${task.done ? 'line-through' : ''}`}
    >
      <div
        className='flex items-center justify-between w-2/3 mb-5 cursor-pointer'
        onClick={() => onToggleDone(index)}
      >
        <h5 className='text-2xl font-semibold'>{task.title}</h5>
        <h6 className='text-lg font-medium'>{task.desc}</h6>
      </div>
      <div>
        <button
          onClick={() => onEdit(index)}
          className='px-4 py-2 mr-2 font-bold text-white bg-blue-800 rounded hover:bg-blue-400'
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(index)}
          className='px-4 py-2 font-bold text-white bg-red-800 rounded hover:bg-red-400'
        >
          Delete
        </button>
      </div>
    </li>
  );
};

export default TaskItem;
