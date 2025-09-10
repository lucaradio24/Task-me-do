import { Task } from "./tasks.js";

export class Category {
    constructor(name){
        this.name = name;
        this.id = crypto.randomUUID()
        this.tasks = [];
    }

    

    createTask(taskData){
        const task = new Task (
            taskData.title,
            taskData.desc,
            taskData.dueDate,
            taskData.priority,
            taskData.isCompleted
        )

        this.tasks.push(task)
    }

    deleteTask(id){
        const index = this.tasks.findIndex((task) => task.id === id) // la funzione dentro findindex prende ogni elemento dell'array tasks e verifica che l'id di task sia uguale a id passato da deleteTask
        if (index !== -1){ 
            this.tasks.splice(index, 1)
        }
    }

    updateTask(id, fields){
        const task = this.tasks.find( (task) => task.id === id)
        if (task !== undefined) {
            task.update(fields)
        }
    }

}





