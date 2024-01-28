import { Task } from "@prisma/client";
import styles from '../styles/TaskList.module.css';

function TaskList(props: { tasks: Task[] }) {
    const { tasks } = props;

    return <div className={styles.taskContainer}>
        <ul>
            {tasks.map((n) => (
                <li key={n.id + '-task'}>
                    <h3>{n.id}</h3>
                    <p>{n.title}</p>
                    <p>{n.description}</p>
                    <h4>{n.status}</h4>
                </li>
            ))}
        </ul>
    </div>
}

export default TaskList;