import React, { useState, useEffect } from 'react';
import { useFirestore } from '../../contexts/FirestoreContext';
import Loader from './shared/Loader';
import { useFirebase } from '../../contexts/FirebaseContext';
import { useNavigate } from 'react-router-dom';
import TaskForm from './TaskForm';
import Modal from './shared/Modal';

const TaskList = () => {
  const { getDocuments, updateDocument, deleteDocument } = useFirestore();
  const { loading,currentUser } = useFirebase();
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState('dueDate'); // Default sorting by due date
  const [filterStatus, setFilterStatus] = useState('All'); // Default filter: All tasks
  const navigate = useNavigate();

 

  useEffect(() => {
    const fetchTasks = async () => {
      if(currentUser){
        try {
          const tasksData = await getDocuments('tasks');
          setTasks(tasksData);
        } catch (error) {
          console.error('Error fetching tasks', error);
        }
      }
     else{
      navigate('/login')
     }
    };

    fetchTasks();
  }, [getDocuments]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'text-yellow-600';
      case 'InProgress':
        return 'text-blue-600';
      case 'Done':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const truncateDescription = (description) => {
    const maxLength = 300;
    return description.length > maxLength ? `${description.slice(0, maxLength)}...` : description;
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteDocument('tasks', taskId);
        console.log('Task deleted successfully');
        // Reload tasks after deletion
        const updatedTasks = await getDocuments('tasks');
        setTasks(updatedTasks);
      } catch (error) {
        console.error('Error deleting task', error);
      }
    }
  };

  const openModal = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedTask(null);
    setIsModalOpen(false);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  const filteredAndSortedTasks = tasks
    .filter((task) => filterStatus === 'All' || task.status === filterStatus)
    .sort((a, b) => {
      if (sortBy === 'dueDate') {
        return new Date(a.dueDate) - new Date(b.dueDate);
      } else if (sortBy === 'status') {
        return a.status.localeCompare(b.status);
      } else {
        // Default sorting by title
        return a.title.localeCompare(b.title);
      }
    });

  if (loading) {
    return <Loader />;
  }

  if(!currentUser){
    return <div>
      please Login
    </div>
  }

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-white">Task List</h2>

      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4 items-center">
          <label className="text-white">Sort By:</label>
          <select
            className="p-2 rounded"
            value={sortBy}
            onChange={handleSortChange}
          >
            <option value="title">Title</option>
            <option value="dueDate">Due Date</option>
            <option value="status">Status</option>
          </select>
        </div>

        <div className="flex space-x-4 items-center">
          <label className="text-white">Filter:</label>
          <select
            className="p-2 rounded"
            value={filterStatus}
            onChange={handleFilterChange}
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="InProgress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedTasks.map((task) => (
          <div
            key={task.id}
            className="bg-white p-6 rounded-lg shadow-md transition-transform hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">{task.title}</h3>
              <div className={`font-semibold ${getStatusColor(task.status)}`}>
                {task.status}
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              {truncateDescription(task.description)}
            </p>
            <p className="text-gray-600">Due Date: {task.dueDate}</p>
            {task.description.length > 300 && (
              <button
                className="nav-btn p-[4px] rounded-[6px] bg-green-500 text-white hover:bg-green-700 transition duration-300 ease-in-out underline-none"
                onClick={() => openModal(task)}
              >
                Read More
              </button>
            )}
            <div className="mt-4 space-x-2">
              <button
                onClick={() => navigate(`/taskform/${task.id}`)}
                className="px-4 py-2 bg-blue-500 text-white rounded-[10px] hover:bg-blue-600 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(task.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-[10px] hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <Modal task={selectedTask} onClose={closeModal} />
      )}
    </div>
  );
};

export default TaskList;
