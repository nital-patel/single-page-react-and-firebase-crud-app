import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';

class App extends Component {
  constructor() {
    super();
    this.state = {
      newTodoText: '',
      todos: {}
    };

    // ^^^ Setting `todos` in state to an empty object. The collection of todos
    // in this app will be represented by an object in stead of an array. The
    // keys of this object will be the uniq identifier of each todo object, and
    // the values of this object will be the todo's themselves.
    //
    // If this doesn't make sense now, just wait until you implement the CREATE
    // feature. Then you will be able to view your data in the Firebase console
    // and it should all be clear.
    this.handelChange = this.handelChange.bind(this);
    this.handelSubmit = this.handelSubmit.bind(this);
    this.handleNewTodoTextChange = this.handleNewTodoTextChange.bind(this);
    this.handleCurrentTodoTextChange = this.handleCurrentTodoTextChange.bind(this);
    this.createTodo = this.createTodo.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
    this.selectTodo = this.selectTodo.bind(this);
    this.handleNewTodoTextChange = this.handleNewTodoTextChange.bind(this);
    this.updateCurrentTodo; = this.updateCurrentTodo.bind(this);
  }

  componentDidMount() {
    this.getTodos();
  }

  getTodos() {
    axios({
      url: '/todos.json',
      baseURL: 'https://todo-list-app-6bd54.firebaseio.com/',
      method: 'GET'
    }).then((response) => {
      this.setState({todos: response.data});
    }).catch((error) => {
      console.log(error);
    });
  }
  createTodo() {
  createTodo(event) {
    event.preventDefault();

    let newTodo = {
      title: this.state.newTodoText,
      createdAt: new Date()
    });
}

    axios({
      url: '/todos.json',
      baseURL: 'https://todo-list-app-6bd54.firebaseio.com/',
      method: 'POST',
      data: newTodo
    }).then((response) => {
      let todos = this.state.todos;
      let newTodoId = response.data.name;
      todos[newTodoId] = newTodo;
      this.setState({todos: todos, newTodoText: ''});
    }).catch((error) => {
      console.log(error);
    });
  }


  updateCurrentTodo(event) {
    event.preventDefault();

    let id = this.state.currentTodo;
    let todoData = {title: this.state.currentTodoText};

    axios({
      url: `/todos/${id}.json`,
      baseURL: 'https://todo-list-app-6bd54.firebaseio.com/',
      method: 'PATCH',
      data: todoData
    }).then((response) => {
      let todos = this.state.todos;
      todos[id].title = this.state.currentTodoText;
      this.setState({todos: todos});
    }).catch((error) => {
      console.log(error);
    });
  }

  deleteTodo(todoId) {
    axios({
      url: `/todos/${todoId}.json`,
      baseURL: 'https://todo-list-app-6bd54.firebaseio.com/',
      method: 'DELETE'
    }).then((response) => {
      let todos = this.state.todos;
      delete todos[todoId];
      this.setState({todos: todos});
    }).catch((error) => {
      console.log(error);
    });
  }
  handelSubmit(event) {
  handleNewTodoTextChange(event) {
    event.preventDefault();
    this.setState({newTodoText: event.target.value});
  }
  handelChange(event) {
  handleCurrentTodoTextChange(event) {
    event.preventDefault();
    this.setState({currentTodoText: event.target.value});
  }

  selectTodo(todoId) {
    this.setState({currentTodo: todoId});
    this.setState({
      currentTodo: todoId,
      currentTodoText: this.state.todos[todoId].title
    });
  }

  renderSelectedTodo() {
    let content;

    if (this.state.currentTodo) {
      let currentTodo = this.state.todos[this.state.currentTodo];
      content = (
        <div>
          <h1>{currentTodo.title}</h1>
        </div>
        <form onSubmit={this.updateCurrentTodo}>
          <input
            className="w-100"
            value={this.state.currentTodoText}
            onChange={this.handleCurrentTodoTextChange} />
        </form>
      );
    }

    return content;
  }

  renderNewTodoBox() {
    return (
      <div className="new-todo-box pb-2">
        <form onSubmit={this.handelSubmit}>
        <form onSubmit={this.createTodo}>
          <input
            className="w-100"
            placeholder="What do you have to do?"
            value={this.state.newTodoText}
            onChange={this.handelChange} />
            onChange={this.handleNewTodoTextChange} />
        </form>
      </div>
    );
  }

  renderTodoList() {
    let todoElements = [];

    // Using a `for...in` loop here because `this.state.todos` is an object and
    // we will use the keys of this object (todo_id's from Firebase) as the `key`
    // of each React element in the todos list. If `this.state.todos` was an array,
    // we would be using the array map function.

    for(let todoId in this.state.todos) {
      let todo = this.state.todos[todoId]

      todoElements.push(
        <div className="todo d-flex justify-content-between pb-4" key={todoId}>
          <div className="mt-2" onClick={() => this.selectTodo(todoId)}>
            <h4>{todo.title}</h4>
            <div>{moment(todo.createdAt).calendar()}</div>
          </div>
          <button
            className="ml-4 btn btn-link"
            onClick={() => { this.deleteTodo(todoId) }}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      );
    }

    return (
      <div className="todo-list">
        {todoElements}
      </div>
    );
  }

  render() {
    return (
      <div className="App container-fluid">
        <div className="row pt-3">
          <div className="col-6 px-4">
            {this.renderNewTodoBox()}
            {this.renderTodoList()}
          </div>
          <div className="col-6 px-4">
            {this.renderSelectedTodo()}
          </div>
        </div>
      </div>
    );
  }
}

export default App;


