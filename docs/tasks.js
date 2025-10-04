import { format } from "date-fns";
export class Task {
    constructor(title, desc, dueDate, priority, isCompleted = false){
        this.id = crypto.randomUUID()
        this.title = title;
        this.desc = desc;
        this.dueDate = new Date(dueDate)
        this.priority = priority;
        this.isCompleted = isCompleted;
    }
    toggleCompleted(){
        this.isCompleted = !this.isCompleted
    }
    update(fields = {}){
        for(const key in fields){
            if (fields[key] !== undefined && key in this){
                if(key === 'dueDate'){
                    this.dueDate = new Date(fields.dueDate)
                } else {
                    this[key] = fields[key]
                }
            }
        }
    }
}
