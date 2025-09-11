import { Category } from "./categories.js";

export class Store {
    constructor (categories){
        this.categories = []
        const category = categories.forEach(name => {
            this.createCategory(name)            
        });
        // proprietà che tiene traccia di quale cat è selezionata
        this.selectedCategoryName = null;
    }

    createCategory(name){
        const category = new Category (name)
        if(this.categories.find((category) => category.name === name)){
            return false
        } else {
            this.categories.push(category)
            return true
        }
        
    }

    deleteCategory(name){
        const index = this.categories.findIndex((category) => category.name === name)
        if(index !== -1){
            this.categories.splice(index, 1)
        }  
    }

    renameCategory(oldName, newName){
        let category = this.categories.find((cat) => cat.name === oldName)
        let alreadyExists = this.categories.find((cat) => cat.name === newName)
        if (category && !alreadyExists){
           category.name = newName
        }
    }

    getCategories(){
        return this.categories
    }

    selectCategory(name){
        this.selectedCategoryName = name;
    }

    getSelectedCategory(){
        return this.categories.find(cat => cat.name === this.selectedCategoryName)
    }
}   




