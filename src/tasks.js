import { format } from "date-fns";

export class Task {
    constructor(title, desc, dueDate, priority, isCompleted){
        this.id = crypto.randomUUID()
        this.title = title;
        this.desc = desc;
        this.dueDate = format(dueDate, "dd/MM/yyyy")
        this.priority = priority;
        this.isCompleted = isCompleted = false;
    }

    toggleCompleted(){
        this.isCompleted = !this.isCompleted
    }

    update(fields = {}){
        for(const key in fields){                             // key sarebbe la proprietà dell'oggetto, tipo title
            if (fields[key] !== undefined && key in this){    // qua stiamo dicendo prendi il value di key dentro fields, && vedi se esiste questo key nell'oggetto corrente
                this[key] = fields[key]
            }
        }
    }
}

const task = new Task ('Fare spesa', 'ricorda buste', '12/09/2025', 'Alta', false)


task.update({title:"Nuovo"})
