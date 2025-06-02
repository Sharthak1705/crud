import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Hero = () => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [main, setMain] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/tasks')
      .then(res => res.json())
      .then(data => setMain(data))
      .catch(err => toast.error("Error loading tasks"));
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!title || !desc) return toast.error('Title and description are required');

    const payload = { title, desc, done: false };

    if (isEditing) {
      const taskId = main[currentTaskIndex]._id;
      const updated = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const updatedTask = await updated.json();
      const updatedList = [...main];
      updatedList[currentTaskIndex] = updatedTask;
      setMain(updatedList);
      setIsEditing(false);
      setCurrentTaskIndex(null);
      toast.success('Task updated');
    } else {
      const res = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const newTask = await res.json();
      setMain([...main, newTask]);
      toast.success('Task added');
    }

    setTitle('');
    setDesc('');
  };
  const editHandler = (index) => {
    setTitle(main[index].title);
    setDesc(main[index].desc);
    setIsEditing(true);
    setCurrentTaskIndex(index);
  };

  const deleteHandler = async (i) => {
    const taskId = main[i]._id;
    await fetch(`http://localhost:5000/api/tasks/${taskId}`, { method: 'DELETE' });
    const updated = [...main];
    updated.splice(i, 1);
    setMain(updated);
    toast.success('Task deleted');
  };

  const toggleDoneHandler = async (i) => {
    const task = main[i];
    const updated = await fetch(`http://localhost:5000/api/tasks/${task._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...task, done: !task.done }),
    });
    const updatedTask = await updated.json();
    const updatedTasks = [...main];
    updatedTasks[i] = updatedTask;
    setMain(updatedTasks);
    toast.success('Status updated');
  };
  const filteredTasks = main.filter(
    (task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  let renderTask = <h2>No Tasks Available</h2>;

  if (filteredTasks.length > 0) {
    renderTask = filteredTasks.map((t, i) => (
      <li
        key={i}
        className={`flex items-center justify-between mb-5 ${t.done ? 'line-through' : ''}`}
      >
        <div className='flex items-center justify-between w-2/3 mb-5'>
          <h5 className='text-2xl font-semibold'>{t.title}</h5>
          <h6 className='text-lg font-medium'>{t.desc}</h6>
        </div>
        <div>
          <button
            onClick={() => editHandler(i)}
            className='px-4 py-2 mr-2 font-bold text-white bg-blue-800 rounded hover:bg-blue-400'
          >
            Edit
          </button>
          <button
            onClick={() => deleteHandler(i)}
            className='px-4 py-2 font-bold text-white bg-red-800 rounded hover:bg-red-400'
          >
            Delete
          </button>
        </div>
      </li>
    ));
  }

  return (
    <>
      <ToastContainer />
      <h1 className='p-5 text-xl text-center text-white bg-black hover:text-gray-200'>Crud Operation</h1>
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

      <input
        type='text'
        placeholder='Search tasks...'
        className='px-4 py-2 m-5 border-2 hover:border-zinc-800 border-zinc-500'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <hr />
      <div className='p-8 mx-4 bg-slate-200'>
        <ul>{renderTask}</ul>
      </div>
    </>
  );
};

export default Hero;
