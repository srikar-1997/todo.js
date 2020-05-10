function Task(props) {
    return <li>{props.name}, {props.dueDate}, {props.delete}</li>
}

class TodoList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {list: props.list};

        this.handleAddTask = this.handleAddTask.bind(this);
        this.handleDeleteTask = this.handleDeleteTask.bind(this)
    }
    handleAddTask(task) {
        console.log("add task clicked");
        this.state.list.push(task);
        this.setState({list: this.state.list})
    }
    handleDeleteTask(id) {
        console.log("delete task clicked")
        this.list = this.state.list.filter((t) => {
            if (t.id != id) {
                return t;
            }
        })
        this.setState({list: this.list})
    }
    render() {
        return (
            <div>
                <h1>TODO List</h1>
                <ol>
                    {
                        this.state.list.map((t) =>
                            <Task key={t.id} name={t.name} dueDate={t.dueDate} delete = {t.delete}/>)
                    }
                </ol>
                <TaskNameForm onAddTask={this.handleAddTask} onDeleteTask={this.handleDeleteTask} />
            </div>
        );
    }
}

class TaskNameForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {taskName: '', date: ''};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        const taskList = this.props.taskList;
        // create a task object
        event.preventDefault();
        const id = Date.now()
        // console.log(id)
        const task = {id: id, name: this.state.taskName, 
        dueDate: this.state.date, delete: <button onClick={() => this.deleteTask(id)}>Delete</button>};
        // add the task object to the task list
        this.props.onAddTask(task);
    }

    deleteTask(id) {
        // console.log(id)
        this.props.onDeleteTask(id);
    }

    handleChange(event) {
        const target = event.target
        // code to set the state of the component
        this.setState({[target.name]:target.value});
    }

    render() {
        return(
            <form onSubmit={this.handleSubmit}>
                <input name = "taskName" type="text" value={this.state.taskName} 
                onChange={this.handleChange}/>
                <input name = "date" type="date" value={this.state.date} 
                onChange={this.handleChange}/>
                <input type="submit" value="Add Task" />
            </form>
        );
    }
}

ReactDOM.render(
    <TodoList list={[]} />,
    document.getElementById('todo')
);