import { FormEvent, useState } from 'react';
import styles from '../styles/CreateTaskForm.module.css'
import { gql as graphql, useMutation } from "@apollo/client";

export type TaskStatus = "In Progress" | "To Do" | "Done"

type TaskType = "TASK" | "SUBTASK"

type CreateTaskFormFields = {
    title: string,
    description?: string,
    status: TaskStatus
}

type CreateTaskFormProps = {
    onFormSubmit: (data: CreateTaskFormFields) => void,
    loading: boolean,
    error: string,
    taskType: TaskType
}

/*
    Can work for both tasks and subtasks creation
    use the taskType to differentate
*/
function CreateTaskForm(props: CreateTaskFormProps) {
    const [formData, setFormData] = useState<CreateTaskFormFields>({ title: '', description: '', status: 'To Do' })
    const { onFormSubmit, loading, error, taskType } = props;

    function processCreateTaskForm(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const taskData = formData;
        onFormSubmit(taskData)
    }

    // Use the FORM name="" to update the form data 
    function updateFormValue(event: FormEvent<HTMLInputElement | HTMLSelectElement>) {
        event.preventDefault();
        const { name, value } = event.currentTarget;

        setFormData({
            ...formData,
            [name]: value
        })
    }

    if (loading) return <div className={styles.form}>
        <p>Submitting...</p>
    </div>
    if (error) return <div className={styles.form}>
        <p>Submission Error: {error}</p>
    </div>

    return <div className={styles.form}>
        <form onSubmit={processCreateTaskForm}>
            <input name="title" value={formData.title} placeholder="title" onChange={updateFormValue} required={true} />
            {
                (taskType == "TASK")
                    ? <input name="description" value={formData.description} placeholder="description" onChange={updateFormValue} />
                    : null
            }
            <select name="status" value={formData.status} onChange={updateFormValue} required={true}>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
            </select>

            <button type="submit">Create</button>
        </form >
    </div>
}

export default CreateTaskForm;