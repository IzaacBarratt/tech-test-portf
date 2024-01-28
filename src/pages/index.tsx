import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useState } from "react";
import CreateTaskForm from "../components/CreateTaskForm";
import { useQuery, gql as graphql, useMutation } from "@apollo/client";
import TaskList from "../components/TaskList";
import { Task } from "@prisma/client";

const GET_TASKS = graphql(`
  query GetTasks {
    getTasks {
      description
      createdAt
      id
      status
      title
    }
  }
`);

const CREATE_TASK = graphql(`
    mutation CreateTask($title: String!, $description: String, $status: String!) {
        createTask(title: $title, description: $description, status: $status) {
            title: title,
            description: description,
            status: status
        }
    }`
)

const DELETE_TASK = graphql(`
  mutation DeleteTask($deleteTaskId: Int!) {
    deleteTask(id: $deleteTaskId) {
      createdAt
      id
    }
  }
`);

export default function Home() {
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false)

  const { data } = useQuery(GET_TASKS);
  let tasks: Task[] = data?.getTasks

  const [deleteTaskMutation, { loading: deleteTaskLoad, error: deleteTaskError }] = useMutation(DELETE_TASK, {
    onCompleted() {
      if (deleteTaskError) {
        alert(deleteTaskError.message)
      }
    },
    refetchQueries: [GET_TASKS]
  })

  const toggleCreateTaskForm = () => setIsTaskFormOpen(!isTaskFormOpen)

  const [createTaskMutation, { data: taskCreateData, loading: taskCreateLoading, error: taskCreateError }] = useMutation(CREATE_TASK, {
    onCompleted() {
      toggleCreateTaskForm();
    },
    refetchQueries: [GET_TASKS]
  })

  function handleTaskCreate(data: Task) {
    createTaskMutation({
      variables: data
    })
  }

  function deleteTask(id: Number) {
    deleteTaskMutation({
      variables: { deleteTaskId: id }
    })
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Task Manager App</title>
        <meta name="description" content="Manage your tasks!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>Task Manager</h1>
          <button onClick={toggleCreateTaskForm}>+ Create Task +</button>
        </header>

        {isTaskFormOpen
          ? <div className={styles.formContainer} onClick={toggleCreateTaskForm}>
            <div className={styles.form} onClick={(e) => e.stopPropagation()}>
              <CreateTaskForm
                error={taskCreateError}
                loading={taskCreateLoading}
                onFormSubmit={handleTaskCreate}
              />
            </div>
          </div>
          : null
        }
        <TaskList onDeleteTask={deleteTask} tasks={tasks || []} />

      </main>
    </div>
  );
}
