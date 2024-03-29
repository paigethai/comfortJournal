import firebaseInfo from "./firebase.js";

import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

const database = getDatabase(firebaseInfo);
const dbRef = ref(database);

// **************************************************

// JOURNAL ENTRY 

// **************************************************


const promptRef = ref(database, '/prompts');
const userEntryRef = ref(database, '/userEntry');


const formElement = document.querySelector('.journalForm');
const journalUl = document.querySelector('.uploadedEntries');


formElement.addEventListener('submit', function(event){
    event.preventDefault();
    const date = new Date();
    const month = date.getUTCMonth() + 1; 
    const day = date.getUTCDate();
    const year = date.getUTCFullYear();
    const newDate = year + "/" + month + "/" + day;

    const textElement = document.getElementById('comment');
    const journalEntry = textElement.value.trim();

    const journalDateEntryObj = {
        userDate: newDate,
        userJournal: journalEntry
    }
    if(journalEntry.length >= 3){
        push(userEntryRef, journalDateEntryObj);
        textElement.value = '';
    } else  {
        alert('You have not entered anything, please add in some thoughts or feelings!')
    }
});


onValue(userEntryRef, function(journalObject){
    if(journalObject.exists()){
        const entries = journalObject.val();
        journalUl.innerHTML = "";

        for(let key in entries){
            const headerValue = entries[key].userDate;
            const paragraphValue = entries[key].userJournal;

            const newListItem = document.createElement('li');
            newListItem.innerHTML = `
            <h3>${headerValue}</h3>
            <p>${paragraphValue}</p>`;

            journalUl.appendChild(newListItem);
        }
    }
})



// **************************************************

// Journal Prompts 

// **************************************************

const promptContainer = document.querySelector('.promptContainer');

onValue(promptRef, function(data){
    const promptData = data.val();
    function randomPrompt(promptArray){
        const randomPrompt = Math.floor(Math.random() * promptArray.length)
        return promptArray[randomPrompt];
    }
    if (promptData === null || promptData.length <= 0){
        promptContainer.innerHTML = `<h2>If you can dance and be free and be embarrassed, you can rule the world.</h2>`;
    }else{
        const randomizedPrompt = randomPrompt(promptData);

        for(let key in promptData){
            const headerTwo = randomizedPrompt;
            promptContainer.innerHTML = `<h2>${headerTwo}</h2>`;
        }
    }
})



// **************************************************

// HAMBURGER MENU

// **************************************************

const navAside = document.querySelector('.navAside');
const navIcons = document.querySelector('.navIcons');
const hamIcon = document.querySelector('.fa-angle-right');
const closeNav = document.querySelector('.fa-angle-left');
const main = document.querySelector('main');
const header = document.querySelector('header');
const h1Element = document.querySelector('h1');

const menuToggle = () => {
    if (navAside.classList.contains("shown"))
    {
        navAside.classList.remove('shown');
        main.classList.remove('full');
        header.classList.remove('hide');
        navIcons.classList.remove('move')
        h1Element.classList.remove('move')
        closeNav.style.display = 'block';
        hamIcon.style.display = 'none';
    }
    else{
        navAside.classList.add('shown'); 
        main.classList.add('full');
        header.classList.add('hide');
        navIcons.classList.add('move')
        h1Element.classList.add('move')
        closeNav.style.display ='none';
        hamIcon.style.display = 'block';
    }
}

navIcons.addEventListener("click", menuToggle);


window.addEventListener("load", () => {
    if (window.innerWidth < 550) {
      navAside.classList.add("shown");
      main.classList.add("full");
      header.classList.add("hide");
      navIcons.classList.add("move");
      h1Element.classList.add("move");
      closeNav.style.display = "none";
      hamIcon.style.display = "block";
    }
  });


// **************************************************

// TO DO 

// **************************************************


const toDoRef = ref(database, '/toDo');


const toDoForm = document.querySelector('.toDoForm');
const toDoUl = document.querySelector('.toDoUl');


toDoForm.addEventListener('submit', function(event){
    event.preventDefault();

    const inputElement = document.getElementById('toDoItem');
    const task = inputElement.value;


    if(task){
        push(toDoRef, task);
        inputElement.value = '';
    } else  {
        alert('You have not entered anything, please add in a task!')
    }
});



onValue(toDoRef, function(toDoObj){
    const toDoDBObj = toDoObj.val()

    if(toDoObj.exists()){
        const listOfToDo = toDoObj.val();
        toDoUl.innerHTML = "";

        for(let Key in listOfToDo){
            const listItemElement = document.createElement('li');
            listItemElement.innerHTML = `<i class="far fa-square ${Key}"></i> `;
            listItemElement.appendChild(document.createTextNode(listOfToDo[Key]));
    
            toDoUl.appendChild(listItemElement);
        }
    }
    else{
        alert('you have not entered and To Dos to Do!')}
})



    // Remove those completed tasks!!
    toDoUl.addEventListener('click', function(event){
        if (event.target.tagName === "I"){
            const toDoID = event.target.classList[2]
            const indivToDo = ref(database,`/toDo/${toDoID}`)
            remove(indivToDo)
        }})