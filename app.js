//All UI elements
const nw = document.getElementsByClassName("notes-wrapper");
const inp = document.getElementsByClassName("notes-input");
const btn = document.getElementsByClassName("sbt-btn");
const remall = document.querySelector(".rem-all");
const hamburger = document.querySelector(".side-bar");
const sideNav = document.querySelector(".sidenav");
const todolist = document.querySelector(".todo");
const completelist = document.querySelector(".complete");
const nm = document.querySelector("#nightmode");
const side = document.querySelector("#mySidenav");
const theme = document.querySelector("#theme");
var popup = document.getElementById('popup-wrapper');
const editinp = document.querySelector(".popup-content");
const rmenu = document.querySelector(".rclickmenu");
const container = document.querySelector(".container");
const cancel_edit = document.querySelector(".cancel-edit");
const done_edit = document.querySelector(".done-edit");
const listbtn = document.querySelector(".lst-btn");
let thisss;


//get data from local storage, otherwise initiate empty object
var data = (localStorage.getItem('todoList')) ? JSON.parse(localStorage.getItem('todoList')):
{ 
    todo: [], 
    completed: [], 
    dark: false,
    list:true
};   


//whenever data gets updated, update the localstorage 
function dataObjectUpdated() {
  localStorage.setItem('todoList', JSON.stringify(data));
}


//check if "remove all" button needs to be disabled
document.body.onload = disable_Rem_all;


//Edit Note
function editNote() {
  const current = this.childNodes[0].innerText;
}


//function to remove an item
function removeItem () {
  const item = this.parentNode.parentNode;
  const parent = item.parentNode;
  const classnm = parent.classList[0];
  const value = item.innerText;

  //remove value from data
  if (classnm === 'todo') {
    data.todo.splice(data.todo.indexOf(value), 1);
  } else {
    data.completed.splice(data.completed.indexOf(value), 1);
  }

  //update local storage
  dataObjectUpdated();

  //update UI
  parent.removeChild(item);
  disable_Rem_all();
  closeNav();
}


//Shift item to completed list
function completeItem() {
  const item = this.parentNode.parentNode;
  const parent = item.parentNode;
  const classnm = parent.classList;
  const value = item.innerText;
  
  // Check if the item should be added to the completed list or to re-added to the todo list
  var target = (classnm[0] === 'todo') ? document.getElementsByClassName('complete'):document.getElementsByClassName('todo');


  // changing colors of delete and complete buttons
  if( classnm[0] === 'todo' ) {
    //update three buttons on <li>
    this.className = 'comp-btn btn btn-sm btn-success mr-1 my-2';
    this.parentNode.childNodes[0].className = 'edit-btn btn btn-sm btn-primary mr-1 my-2';
    this.parentNode.childNodes[1].className = 'rem-btn btn btn-sm btn-danger mr-1 my-2';

    //update local storage
    data.todo.splice(data.todo.indexOf(value), 1);
    data.completed.push(value);
  } else {
    //update three buttons on <li>
    this.className = 'comp-btn btn btn-sm btn-outline-success mr-1 my-2';
    this.parentNode.childNodes[0].className = 'edit-btn btn btn-sm btn-outline-primary mr-1 my-2';
    this.parentNode.childNodes[1].className = 'rem-btn btn btn-sm btn-outline-danger mr-1 my-2';
    
    // update local storage 
    data.completed.splice(data.completed.indexOf(value), 1);
    data.todo.push(value);
  }
  dataObjectUpdated();

  //update UI
  parent.removeChild(item);
  target[0].insertBefore(item, target[0].childNodes[0]);
  closeNav();
}



//Add item to DOM
const addtoDOM = (value,complete) => {
  const list = complete ? document.getElementsByClassName("complete") : document.getElementsByClassName("todo");

  //LIST_ITEM element
  const list_item = document.createElement('li');
  list_item.className = 'list-item d-flex mb-3 col-12 p-2 ';
  if(data.list===false && screen.width>1200) {
    list_item.className = 'list-item d-flex mb-3 col-3 mx-4 p-1';
  }
  list_item.addEventListener("dblclick",showEdit);
  
  //paragraph of LIST_ITEM
  const pp = document.createElement('p');
  pp.innerText = value;
  pp.className = 'to-text flex-grow-1 p-2 m-0';

  //wrapper for remove and complete buttons
  const buttons = document.createElement('div');
  buttons.className = 'buttons';
  
  //REMOVE button element
  const remove = document.createElement('button');
  remove.className = 'rem-btn btn btn-sm btn-outline-danger mr-1 my-2';
  remove.innerHTML = '<i class="fa fa-times" aria-hidden="true"></i>' ;
  remove.addEventListener("click",removeItem);

  //COMPLETE button element
  const comp = document.createElement('button');
  comp.className = 'comp-btn btn btn-sm btn-outline-success mr-1 my-2';
  comp.innerHTML = '<i class="fa fa-check" aria-hidden="true"></i>';
  comp.addEventListener("click",completeItem);

  //EDIT button element
  const editt = document.createElement('button');
  editt.className = 'edit-btn btn btn-sm btn-outline-primary mr-1 my-2';
  editt.innerHTML = '<i class="fa fa-edit" aria-hidden="true"></i>';
  editt.addEventListener("click",showEdit);

  // if list item is in completed list, change classes of buttons 
  if( complete ) {
    comp.className = 'comp-btn btn btn-sm btn-success mr-1 my-2';
    editt.className = 'edit-btn btn btn-sm btn-primary mr-1 my-2';
    remove.className = 'rem-btn btn btn-sm btn-danger mr-1 my-2';
  }

  //appends all elements to list item
  buttons.appendChild(editt);
  buttons.appendChild(remove);
  buttons.appendChild(comp);
  list_item.appendChild(pp);  
  list_item.appendChild(buttons);

  // append li to ul 
  list[0].insertBefore(list_item, list[0].childNodes[0]);
}

//render the list that was stored in local storage
renderTodoList();

//render to do list from local storage
function renderTodoList() {
  //select the theme
  if(data.dark===false) {
    theme.href = 'style.css';
    nm.innerHTML = '<a href="#"> <i class="fa fa-moon-o fa-lg" aria-hidden="true"></i> Dark Theme</a>';
  } else {
    theme.href = 'darkstyle.css';
    nm.innerHTML = '<a href="#"> <i class="fa fa-sun-o fa-lg" aria-hidden="true"></i> Light Theme</a>';
  }

  //check whether to display grid or list
  if(data.list===false && screen.width>1200) {
    nw[0].className = 'notes-wrapper col-lg-12 col-12 mx-0 mb-3';
    listbtn.innerHTML = '<i class="fa fa-bars"></i>List';
  } else {
    listbtn.innerHTML = '<i class="fa fa-th-large"></i>Grid';
  }

  //render the list
  if (!data.todo.length && !data.completed.length) return;

  for (var i = 0; i < data.todo.length; i++) {
    var value = data.todo[i];
    addtoDOM(value);
  }

  for (var j = 0; j < data.completed.length; j++) {
    var value = data.completed[j];
    addtoDOM(value,true);
  }
}



//nulls the input box
const addItem = (value) => {
  data.todo.push(value);
  dataObjectUpdated();
  addtoDOM(value,false);
  inp[0].value = '';
  disable_Rem_all();
}



//checks whether input is null, if yes, show notification 
const check = () => {
  const val = inp[0].value.trim();
  if(val!=='') {
    addItem(val);
    inp[0].focus();
  } else {
    showPopUp();
  }
}


//show the "task cannot be empty!" notification
showPopUp = () => {
  const popup = document.querySelector(".popup");
  popup.style.display = 'block';
  setTimeout(() => {
    popup.style.display = 'none';
  }, 2000);
  
}



//remove all tasks
removeAll = () => {
  data.todo = [];
  data.completed = [];
  dataObjectUpdated();
  document.querySelector(".todo").innerHTML = "";
  document.querySelector(".complete").innerHTML = "";
  disable_Rem_all();
  closeNav();
}

 

// open/close side bar
function openNav() {
  sideNav.style.width = "320px";
}
function closeNav(e) {
  sideNav.style.width = "0";
}



// disable/enable remove all button
function disable_Rem_all() {
  if(todolist.innerHTML==="" && completelist.innerHTML==="") {
    remall.setAttribute("disabled","disabled");
  } else {
    remall.removeAttribute("disabled");
  }
}


//open the edit window
function showEdit() {
    closeNav();
    console.log(data);
    popup.classList.add('show');
    // check whether it was a double click or single click 
    if( event.type==="dblclick" ) {
        editinp.focus();
        editinp.value = this.childNodes[0].innerText;
        thisss = this;
    } else {
        const lst_itm = this.parentNode.parentNode;
        editinp.focus();
        editinp.value = lst_itm.childNodes[0].innerText;
        thisss = lst_itm;
    } 
}




//close edit window and change the edited text
function donee() {
    console.log(data.todo.indexOf(thisss.childNodes[0].innerText));
    data.todo[data.todo.indexOf(thisss.childNodes[0].innerText)] = editinp.value.trim();
    thisss.childNodes[0].innerText =  editinp.value.trim();
    dataObjectUpdated();
    popup.classList.remove('show');
}

//close edit window without changing task text
function cancel() {
    popup.classList.remove('show');
}

//do nothing when clicked on backdrop
window.onclick = function(event) {
    if (event.target == popup) {
        popup.classList.remove('show');
    }
}


function togrid() {
  console.log(nw);
  nw[0].className = 'notes-wrapper col-sm-12 col-12 mx-0 mb-3';
  const allitems = document.querySelectorAll(".list-item");
  for(i=0;i<allitems.length;i++) {
    allitems[i].className = 'list-item d-flex mb-3 col-3 mx-4 p-1';
  }
  data.list = false;
  dataObjectUpdated();
}

function tolist() {
  nw[0].className = 'notes-wrapper col-lg-8 col-10 mx-auto mb-3';
  const allitems = document.querySelectorAll(".list-item");
  for(i=0;i<allitems.length;i++) {
    allitems[i].className = 'list-item d-flex mb-3 col-12 p-2';
  }
  data.list = true;
  dataObjectUpdated();
}


//EVENT LISTENERS
remall.addEventListener("click",removeAll);
hamburger.addEventListener("click",openNav);
btn[0].addEventListener("click",check); 
done_edit.addEventListener("click",donee);
cancel_edit.addEventListener("click",cancel);
inp[0].addEventListener("click",closeNav);
listbtn.addEventListener("click",() => {
  if(data.list===true) {
    listbtn.innerHTML = '<i class="fa fa-bars"></i>List';
    togrid();
  } else {
    tolist();
    listbtn.innerHTML = '<i class="fa fa-th-large"></i>Grid';
  }
});


inp[0].addEventListener("keyup", () => {
  if (event.keyCode === 13) {
    event.preventDefault();
    check();  
  }
});

// detect keys to edit the item (ENTER-change, ESCAPE-do not change)
editinp.addEventListener("keyup", () => {
  if (event.keyCode === 13) {
      event.preventDefault();
      donee();
  } else if(event.key==="Escape") {
      popup.classList.remove('show');
  }
});