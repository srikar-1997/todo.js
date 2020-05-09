let taskList = []

class Task {
    constructor(taskId, name, dueDate, isDone) {
        this.taskId = taskId;
        this.name = name;
        this.dueDate = dueDate;
        this.isDone = isDone;
    }

    toString() {
        let htmlText = '<li class="task" ><div>'
        htmlText += '<div id = '+this.name+'>'+this.name+'</div>'
        htmlText += this.dueDate
        htmlText += "  " + '<button onclick="deleteTask(';
        htmlText += this.taskId;
        htmlText += ')">Delete</button>';
        htmlText += '<input type="checkbox" id = '+this.taskId+' onchange="markTask('+this.taskId+')">'
        htmlText += '</div></li>';
        return htmlText;
    }
}

function render() {
    const listUI = document.getElementById("todolist")
    listUI.innerHTML = "";
    if (taskList.length === 0) listUI.innerHTML = "No tasks todo :-)"
    taskList.forEach((task) => {
        listUI.innerHTML += task.toString();
        if (task.isDone === true) {
            document.getElementById(task.name).innerHTML = '<s>'+task.name+'</s>'
        }
    })
}

function deleteTask(taskId) {
    taskList = taskList.filter(
        (t) => {
            if(t.taskId != taskId) 
            return t;
        }
    );
    render()
    // call a web api to update the database on the server
    const request = new XMLHttpRequest();
    const id = taskId
    request.open('POST', '/api/deleteTask');
    request.onload = () => { 
    const data = JSON.parse(request.responseText);

    if (data.success) {
        document.getElementById("result").innerHTML = "Task deleted from json file"
    }
    }
    const data = new FormData()
    data.append('id', id)
    request.send(data)
    return false
    // update the DOM
}

function createTask() {
    const taskName = document.getElementById("taskName").value;
    const dueDate = document.getElementById("myDate").value
    addTask(new Task(Date.now(), taskName, dueDate, false));
}

function addTask(t) {
    taskList.push(t)
    render();

    obj = { 'taskId' : t.taskId,
            'name' : t.name,
            'date': t.dueDate,
            'isDone' : t.isDone}
    // call a web api to update the database on the server
    const request = new XMLHttpRequest();
    request.open('POST', '/api/addTask');
    request.onload = () => { 
    const data = JSON.parse(request.responseText);

    if (data.success) {
        document.getElementById("result").innerHTML = "Task added to json file"
    }
    }
    var data = JSON.stringify(obj)
    request.send(data)
    return false
}

function markTask(taskId) {
    taskList.forEach((task) => {
        if (task.taskId === taskId) {
            task.isDone = true;
            document.getElementById(task.name).innerHTML = '<s>'+task.name+'</s>'
        }
    })

    const request = new XMLHttpRequest();
    const id = taskId
    request.open('POST', '/api/markTask');
    request.onload = () => { 
    const data = JSON.parse(request.responseText);

    if (data.success) {
        document.getElementById("result").innerHTML = "Task marked in json file"
    }
    }
    const data = new FormData()
    data.append('id', id)
    request.send(data)
    return false
}

function init() {
    console.log("init called");
    // call a web api to retrieve the task list
    // write a function to send a api request
    // get the JSON
    // assign it to taskList
    // render
    const request = new XMLHttpRequest();
    request.open('POST', '/api/taskList');
    request.onload = () => { 
    const data = JSON.parse(request.responseText);
    count = 0;
    for (let i = 0; i < data.taskList.length; i++) {

        taskList.push(new Task(data.taskList[i].taskId, data.taskList[i].name, data.taskList[i].date, data.taskList[i].isDone))
        count++;
    }
    render()
    }
    const data = new FormData()
    data.append('id', "hi")
    request.send(data)
    return false
}

init();