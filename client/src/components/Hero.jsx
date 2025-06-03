import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import 'react-toastify/dist/ReactToastify.css';

const Hero = () => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [main, setMain] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${BASE_URL}/api/tasks`)
      .then(res => res.json())
      .then(data => setMain(data))
      .catch(() => toast.error("Error loading tasks"));
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    if(!title || !desc) {
      return toast.error('Title and description are required');
    }
    const payload = { title, desc, done: false };

    if (isEditing) {
      const taskId = main[currentTaskIndex]._id;
      const res = await fetch(`${BASE_URL}/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const updatedTask = await res.json();
      const updatedList = [...main];
      updatedList[currentTaskIndex] = updatedTask;
      setMain(updatedList);
      setIsEditing(false);
      setCurrentTaskIndex(null);
      toast.success('Task updated');
    } else {
      const res = await fetch(`${BASE_URL}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const newTask = await res.json();
      console.log("New task created:", newTask);
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
    await fetch(`${BASE_URL}/api/tasks/${taskId}`, { method: 'DELETE' });
    const updated = [...main];
    updated.splice(i, 1);
    setMain(updated);
    toast.success('Task deleted');
  };

  const toggleDoneHandler = async (i) => {
    const task = main[i];
    const res = await fetch(`${BASE_URL}/api/tasks/${task._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...task, done: !task.done }),
    });
    const updatedTask = await res.json();
    const updatedTasks = [...main];
    updatedTasks[i] = updatedTask;
    setMain(updatedTasks);
    toast.success('Status updated');
  };

  const filteredTasks = main.filter((task) => {
  if (!task || typeof task !== 'object'){ 
    return false;
  }
  const title = typeof task.title === 'string' ? task.title : '';
  const desc = typeof task.desc === 'string' ? task.desc : '';

  return (
    title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    desc.toLowerCase().includes(searchTerm.toLowerCase())
  );
});

  return (
    <>
      <ToastContainer />
      <h1 className='p-5 text-xl text-center text-white bg-black hover:text-gray-200'>Crud Operation</h1>
      <TaskForm
        title={title}
        desc={desc}
        setTitle={setTitle}
        setDesc={setDesc}
        isEditing={isEditing}
        submitHandler={submitHandler}
      />
      <input
        type='text'
        placeholder='Search tasks...'
        className='px-4 py-2 m-5 border-2 hover:border-zinc-800 border-zinc-500'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <hr />
      <div className='p-8 mx-4 bg-slate-200'>
        <TaskList
          tasks={filteredTasks}
          editHandler={editHandler}
          deleteHandler={deleteHandler}
          toggleDoneHandler={toggleDoneHandler}
        />
      </div>
    </>
  );
};

export default Hero;
