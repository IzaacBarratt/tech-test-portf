import { Task } from "@prisma/client";
import styles from '../styles/Home.module.css';
import taskListStyles from '../styles/TaskList.module.css'
import { TaskStatus } from "./CreateTaskForm";
import { useState } from "react";

const statusPossible: TaskStatus[] = [
    "In Progress",
    "To Do",
    "Done"
]

function TaskList(props: {
    tasks: Task[],
    onDeleteTask: (id: Number) => void,
    onUpdateTaskStatus: (id: number, status: TaskStatus) => void
}) {
    const { tasks, onDeleteTask, onUpdateTaskStatus } = props;
    const [updatedStatus, setUpdatedStatus] = useState<{ [id: number]: TaskStatus }>({})

    let taskStatus = tasks.reduce((prev, n) => ({
        ...prev,
        [n.id]: n.status
    }), {})

    function updateIndividualTaskStatus(id: number, status: string) {
        setUpdatedStatus({
            ...updatedStatus,
            [id]: status as TaskStatus
        })
    }

    function isSameStatus(id: number): boolean {
        if (!updatedStatus[id]) return true;
        return (taskStatus[id] === updatedStatus[id]);
    }

    function callUpdateStatus(task: Task) {
        onUpdateTaskStatus(task.id, updatedStatus[task.id])
    }

    return <div className={taskListStyles.taskContainer}>
        <h5>Tasks: {tasks.length}</h5>
        <ul className={styles.grid}>
            {tasks?.map((n) => (
                <li className={styles.card} key={n.id + '-task'}>

                    <div className={taskListStyles.header}>
                        <p>{n.id}</p>
                        <button onClick={() => onDeleteTask(n.id)}>Delete</button>
                    </div>
                    <h2 className={styles.title}><a href={"/task/" + n.id}>{n.title}       </a></h2>
                    <p>{n.description}</p>
                    <p>{n.createdAt.toString()}</p>
                    <h4>{n.status}</h4>

                    <select value={updatedStatus[n.id] || taskStatus[n.id]} onChange={(e) => { updateIndividualTaskStatus(n.id, e.target.value) }} >
                        {statusPossible.map((n) =>
                            <option key={n} id={n}>{n}</option>
                        )}
                    </select>
                    <p>same status:
                        {
                            isSameStatus(n.id)
                                ? null
                                : <button onClick={() => { callUpdateStatus(n) }} >Update status</button>

                        }
                    </p>

                </li>
            ))}
        </ul>
    </div>
}

export default TaskList;