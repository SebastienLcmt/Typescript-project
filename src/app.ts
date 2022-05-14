let actualContainer: HTMLDivElement,
actualBtn : HTMLButtonElement,
actualUl : HTMLUListElement,
actualForm : HTMLFormElement,
actualTextInput : HTMLInputElement,
actualValidation : HTMLSpanElement; 

const itemContainer = document.querySelector('.items-container') as HTMLDivElement; 


const mainDiv = document.querySelector('.main-content') as HTMLDivElement;
mainDiv.addEventListener('click',  closeOnMainDivClick);
function closeOnMainDivClick(e : MouseEvent) {
    if (e.target !== e.currentTarget) return;
    if(actualForm) toggleForm(actualBtn, actualForm, false);
}

const itemsContainer  = document.querySelectorAll('.items-container') as NodeListOf<HTMLDivElement> // on précise car classe.


// A chaque container on applique la fonction qui ajoute l'évènement
itemsContainer.forEach((container: HTMLDivElement) => {
    addContainerListeners(container); 
})

// Fonction qui récupère le bouton X du container et appelle la fonction qui va ajouter l'évènement
function addContainerListeners(currentContainer: HTMLDivElement){

  
    const currentContainerDeletionBtn = currentContainer.querySelector('.delete-container-btn') as HTMLButtonElement;
    const currentAddItemBtn = currentContainer.querySelector('.add-item-btn') as HTMLButtonElement;
    const currentCloseFormBtn = currentContainer.querySelector('.close-form-btn') as HTMLButtonElement;
    const currentForm = currentContainer.querySelector('form') as HTMLFormElement;
 
    deleteBtnListeners(currentContainerDeletionBtn)

    addItemBtnListeners(currentAddItemBtn);

    closingFormBtnListeners(currentCloseFormBtn);

    addFormSubmitListeners(currentForm);

    addDDListeners(currentContainer);

}

function closingFormBtnListeners(btn : HTMLButtonElement) {
    btn.addEventListener('click' , () => toggleForm(actualBtn, actualForm, false))
}


function deleteBtnListeners(btn: HTMLButtonElement){
    btn.addEventListener('click', handleContainerDeletion); // Ajout de l'évènement qui va déclencher la fonction de suppression du container
}



function addItemBtnListeners(btn : HTMLButtonElement){
    btn.addEventListener('click' , handleAddItem)
}

function addFormSubmitListeners(form : HTMLFormElement){
    form.addEventListener('submit', createNewItem);
}


function addDDListeners(element : HTMLElement){
    element.addEventListener('dragstart', handleDragStart)
    element.addEventListener('dragover', handleDragOver)
    element.addEventListener('drop', handleDrop)
    element.addEventListener('dragend', handleDragend)
}

function handleContainerDeletion(e: MouseEvent){

    const btn = e.target as HTMLButtonElement; 
    
    // On récupère tous les boutons qui servent à supprimer un container
    // on utilise le spread operator pour convertir la nodeList en tableau
        const btnsArray = [...document.querySelectorAll('.delete-container-btn')] as HTMLButtonElement[];
        
        // On récupère tous les containers de la même manière
        const containers = [...document.querySelectorAll('.items-container')] as HTMLDivElement[];
        
        // Il n'y a plus qu'à remove le bon container ayant l'index du bouton sur lequel on vient de cliquer
        containers[btnsArray.indexOf(btn)].remove() // remove élément du DOM
        
    
        // Explication. Imaginons 3 containers, donc trois boutons.
        // const containers est le tableau de containers 
        // [
        //  0: div.items-container, 
        //  1: div.items-container, 
        //  2: div.items-container
        // ]
        // 
        // const btnsArray est le tableau de boutons
        // 
        // const btn est le bouton sur lequel on vient de cliquer
        // 
        // Si on clique sur le bouton du premier container et qu'on en cherche l'index
        //  console.log(btnsArray.indexOf(btn));  console => 0 
        // 
        // Donc il n'y a plus qu'à remove le container à l'index 0 : containers[btnsArray.indexOf(btn)].remove()
    
    
    }

function handleAddItem (e : MouseEvent) {
    const btn = e.target as HTMLButtonElement;
    // si true, déjà un d'ouvert, donc actualBtn et actualForm sont set. On exécute donc toggleForm avec false pour display none le form, et remettre le bouton Add an Item en block
    if(actualContainer){ 
        toggleForm(actualBtn, actualForm, false)
    }
    setContainerItems(btn);
    toggleForm(actualBtn, actualForm, true);
    getFocusOnInput(actualTextInput);
}

function getFocusOnInput(input : HTMLInputElement){
    input.focus();
}

function toggleForm(btn : HTMLButtonElement,  form : HTMLFormElement, action: boolean){
    if(!action){
        form.style.display = "none";
        btn.style.display = "block";
    } else if (action) {
        form.style.display = "block";
        btn.style.display = "none";
    }
}

function setContainerItems(btn : HTMLButtonElement) {
    actualBtn = btn;
    actualContainer = btn.parentElement as HTMLDivElement;
    actualUl = actualContainer.querySelector('ul') as HTMLUListElement;
    actualForm = actualContainer.querySelector('form') as HTMLFormElement;
    actualTextInput = actualContainer.querySelector('input') as HTMLInputElement;
    actualValidation = actualContainer.querySelector('.validation-msg') as HTMLSpanElement;
}

function createNewItem(e: Event){
    e.preventDefault();
    // Validation
    if(actualTextInput.value.length === 0) {
        actualValidation.textContent = "Must be at least one character long !";
        return
    } else {
        actualValidation.textContent = "";
    }

    //Création item

    const itemContent = actualTextInput.value;
    const li = `
    <li class="item" draggable="true"> 
    <p> ${itemContent} </p>
    <button>X</button>
    </li>`;

    actualUl.insertAdjacentHTML("beforeend", li);
    actualTextInput.value = '';

    // Add Event to last-added li element

    const item = actualUl.lastElementChild as HTMLLIElement;
    const liBtn = item.querySelector('button') as HTMLButtonElement;
    handleItemDeletion(liBtn);
    addDDListeners(item);

}

function handleItemDeletion(btn : HTMLButtonElement){
    btn.addEventListener('click', () => {
        const elToRemove = btn.parentElement as HTMLLIElement;
        elToRemove.remove();
    })
}

//Drag and Drop

let dragSrcEl : HTMLElement;

function handleDragStart (this: HTMLElement, e: DragEvent){
    e.stopPropagation();
    
    if(actualContainer) toggleForm(actualBtn, actualForm, false);
    
    dragSrcEl = this; // ici le this est l'élément que l'on "prend" pour drag

    e.dataTransfer?.setData('text/html', this.innerHTML)    // on copie l'html de l'élément que l'on vient de prendre
    

}

function handleDragOver (e: DragEvent){
    e.preventDefault() // obligé de mettre sinon ça marchera pas
}

function handleDrop(this : HTMLElement, e: DragEvent) {
    e.stopPropagation();
    const receptionEl = this; // ici le this est l'élément html dans lequel on lache
    // si l'élément que l'on a pris est un li, et qu'on le lache dans le container, on l'ajoute
    if(dragSrcEl.nodeName === "LI" && receptionEl.classList.contains('items-container')){
        (receptionEl.querySelector('ul') as HTMLUListElement).appendChild(dragSrcEl);
        addDDListeners(dragSrcEl); // quand on fait du drag and drop les évènements disparaissent
        handleItemDeletion(dragSrcEl.querySelector('button') as HTMLButtonElement);
    }
    
    // ici on gère le swap. Soit d'un item avec un autre item, soit d'un container avec un autre container
    // Si dragSrcEl est un li, et que this est un autre li, on vérifie que c'est un autre li
    if(dragSrcEl !== this && this.classList[0] === dragSrcEl.classList[0]){
        dragSrcEl.innerHTML = this.innerHTML; // on prends l'html du this et on le met dans l'élément qu'on drag
        // Et dans le this on met l'html de l'élément qu'on drag (on swap)
        this.innerHTML = e.dataTransfer?.getData('text/html') as string; 
        if(this.classList.contains('items-container')){ // si container, on remet tous les events des containers et des li déjà là
            addContainerListeners(this as HTMLDivElement);
            this.querySelectorAll("li").forEach(li => {
                handleItemDeletion(li.querySelector('button') as HTMLButtonElement);
                addDDListeners(li); 
            })
        } else { // si c'est un li que l'on déplace, on remet les events des li, le drag et le bouton
            addDDListeners(this);
            handleItemDeletion(this.querySelector('button') as HTMLButtonElement);
        }
    }
}

// Au dessus on a remit les events listeners de l'élément que l'on a swappé.
// Il ne faut pas oublier de remettre les events listeners sur l'élément qui s'est fait swappé !

function handleDragend(this : HTMLElement, e: DragEvent){
    e.stopPropagation();

    if(this.classList.contains('items-container')){
        addContainerListeners(this as HTMLDivElement);
        this.querySelectorAll("li").forEach(li => {
            handleItemDeletion(li.querySelector('button') as HTMLButtonElement);
            addDDListeners(li); 
        })
        
    } else {
        addDDListeners(this);
        handleItemDeletion(this.querySelector('button') as HTMLButtonElement);
    }

}



// Add new container

const addContainerBtn = document.querySelector('.add-container-btn') as HTMLButtonElement;
const addContainerForm = document.querySelector('.add-new-container form') as HTMLFormElement;
const addContainerFormInput = document.querySelector('.add-new-container input') as HTMLInputElement;
const validationNewContainer = document.querySelector('.add-new-container .validation-msg') as HTMLSpanElement;
const addContainerCloseBtn = document.querySelector('.close-add-list') as HTMLButtonElement;
const addNewContainer = document.querySelector('.add-new-container') as HTMLDivElement;
const containersList = document.querySelector('.main-content') as HTMLDivElement;


addContainerBtn.addEventListener('click', () => {
    toggleForm(addContainerBtn, addContainerForm, true)
    getFocusOnInput(addContainerFormInput);
})



addContainerCloseBtn.addEventListener('click', () => {
    toggleForm(addContainerBtn, addContainerForm, false)
})

addContainerForm.addEventListener('submit', createNewContainer);

function createNewContainer (e: Event){
    e.preventDefault();
    if(addContainerFormInput.value.length === 0) {
        validationNewContainer.textContent = "Must be at least one character long !";
        return
    } else {
        validationNewContainer.textContent = "";
    }
   

    const newContainer = itemContainer.cloneNode() as HTMLDivElement;
    // On a cloné la div container, donc on n'insère que le contenu de cette div (on ne remet pas la div container)
    const newContainerContent =  ` 
        <div class="top-container">
            <h2>${addContainerFormInput.value}</h2>
            <button class="delete-container-btn">X</button>
        </div>
        <ul></ul>
        <button class="add-item-btn">Add an Item</button>
        <form autocomplete="off">
            <div class="top-form-container">
                <label for="item">Add a new item</label>
                <button type="button" class="close-form-btn">X</button>
            </div>
            <input type="text" id="item">
            <span class="validation-msg"></span>
            <button type="submit">Submit</button>
        </form>`

    newContainer.innerHTML = newContainerContent; 

    containersList.insertBefore(newContainer, addNewContainer); // on insert newContainer, avant addNewContainer

    addContainerFormInput.value = '';

    addContainerListeners(newContainer);

}


const colorInput = document.querySelector('#color') as HTMLInputElement;
colorInput.addEventListener('input',  handleColorChange)

function handleColorChange(e: Event){
    let color = colorInput.value;

    let allContainers = document.querySelectorAll('.items-container') as NodeListOf<HTMLDivElement>
    allContainers.forEach(container => {
        container.style.backgroundColor = color;
    })
    
} 
