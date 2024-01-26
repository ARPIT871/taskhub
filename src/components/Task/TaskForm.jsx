import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { object, string } from "zod";
import { useFirestore } from "../../contexts/FirestoreContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFirebase } from "../../contexts/FirebaseContext";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "./shared/Loader";

const TaskSchema = object({
  title: string().min(1).max(100),
  description: string().min(1).max(500),
  dueDate: string(),
  status: string(),
});

const TaskForm = () => {
  const { currentUser, loading } = useFirebase();
  const { addDocument, getDocumentById, updateDocument } = useFirestore();
  const [task, setTask] = useState(null);
  const navigate = useNavigate();
  const { taskId } = useParams();

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(TaskSchema),
  });

  function clearFields() {
    setTask(null);
    setValue("title", "");
    setValue("description", "");
    setValue("dueDate", "");
    setValue("status", "Pending");
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (taskId) {
          const taskDetails = await getDocumentById("tasks", taskId);
          setTask(taskDetails);
          setValue("title", taskDetails.title);
          setValue("description", taskDetails.description);
          setValue("dueDate", taskDetails.dueDate);
          setValue("status", taskDetails.status || "Pending");
        } else {
          clearFields();
        }
      } catch (error) {
        console.error("Error fetching task details", error);
      }
    };
    fetchData(taskId);
  }, [taskId, getDocumentById, setValue]);

  if (loading) {
    return <Loader />;
  }

  const onSubmit = async (data) => {
    if (currentUser) {
      try {
        if (taskId) {
          await updateDocument("tasks", taskId, data);
          alert("Task Updated Successfully");
          navigate("/tasklist");
        } else {
          await addDocument("tasks", data);
          alert("Task Added Successfully");
          clearFields();
        }
      } catch (error) {
        console.error("Error submitting task form", error);
      }
    } else {
      alert("Please Login");
    }
  };

  return (
    <div className=" p-6 rounded shadow-md text-white">
      <h2 className="text-2xl font-bold mb-4">
        {taskId ? "Edit Task" : "Create Task"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium">
            Status
          </label>
          <select
            {...register("status")}
            required
            defaultValue="Pending"
            className="mt-1 p-2 w-full text-black border rounded focus:outline-none focus:ring focus:border-blue-300"
          >
            <option value="Pending">Pending</option>
            <option value="InProgress">In Progress</option>
            <option value="Done">Done</option>
          </select>
          {errors.status && (
            <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="title" className="block text-sm font-medium">
            Title
          </label>
          <input
            {...register("title")}
            type="text"
            autoComplete="off"
            required
            className="mt-1 p-2 w-full border rounded text-black focus:outline-none focus:ring focus:border-blue-300"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <textarea
            {...register("description")}
            rows="4"
            required
            className="mt-1 p-2 w-full border rounded text-black focus:outline-none focus:ring focus:border-blue-300"
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium">
            Due Date
          </label>
          <input
            {...register("dueDate")}
            type="date"
            className="mt-1 p-2 w-full border rounded text-black focus:outline-none focus:ring focus:border-blue-300"
          />
          {errors.dueDate && (
            <p className="text-red-500 text-sm mt-1">
              {errors.dueDate.message}
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-white text-black rounded focus:outline-none hover:bg-gray-300 transition duration-300 ease-in-out"
          >
            {taskId ? "Update Task" : "Create Task"}
          </button>
          <button
            type="button"
            className="ml-2 px-4 py-2 bg-gray-300 text-black rounded focus:outline-none hover:bg-gray-400 transition duration-300 ease-in-out"
            onClick={() => navigate("/tasklist")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
