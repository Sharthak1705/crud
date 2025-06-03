import React from 'react';

const TaskForm = ({ title, desc, setTitle, setDesc, isEditing, submitHandler }) => {
  return (
    <form onSubmit={submitHandler}>
      <input
        type='text'
        placeholder='Please enter task here...'
        className='px-4 py-2 m-5 border-2 hover:border-zinc-800 border-zinc-500'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type='text'
        placeholder='Enter your description here...'
        className='px-4 py-2 m-5 border-2 hover:border-zinc-800 border-zinc-500'
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />
      <button className='px-4 py-2 m-5 text-xl font-bold text-white bg-black hover:bg-green-400 rounded-xl'>
        {isEditing ? 'Update Task' : 'Add Task'}
      </button>
    </form>
  );
};

export default TaskForm;
