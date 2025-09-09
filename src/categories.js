import { Task } from "./tasks.js";

class Category {
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
}


const category = new Category('Personale')

category.createTask({title:'Lavatrice', desc:'Detersivi', dueDate:'12/09/2025', priority: 'High', isCompleted: false})
category.createTask({title:'Casa', desc:'Detersivi', dueDate:'12/09/2025', priority: 'High', isCompleted: false})
category.createTask({title:'Pisello', desc:'Detersivi', dueDate:'12/09/2025', priority: 'High', isCompleted: false})

const idDaEliminare = category.tasks[1].id;
category.deleteTask(idDaEliminare)
console.log(category.tasks)