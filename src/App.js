import React, { PureComponent, Component } from 'react';
import {
  AppBar,
  IconButton,
  Typography,
  Slide,
  Snackbar,
  Button, TextField,
  Toolbar,
  Select, Dialog,
  DialogActions, DialogContent,
  DialogTitle,
  MenuItem,
  List
} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import { withStyles } from '@material-ui/core/styles';
import { databaseRef } from "./firebase";
import EachTodo from "./Components/eachTodo";
import Drawer from "./Components/drawer";
import { NavigateNext } from "@material-ui/icons";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      priority: '',
      tasks: [],
      openDrawer: false,
      openSnackBar: false,
      doneTasksDialog: false,
      doneTasks: [],
      getTasks: false,
      showTheCurrentDateBTN: false,
      currentDate: ''
    };
    this.addTodo = this.addTodo.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.fetchTodos = this.fetchTodos.bind(this);
    this.showDoneTasks = this.showDoneTasks.bind(this);
    this.closeDoneTasksModal = this.closeDoneTasksModal.bind(this);
    this.delete = this.delete.bind(this);
    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.setTasksDate = this.setTasksDate.bind(this);
  }
  componentWillMount() {
    this.fetchTodos();
    this.setTasksDate();
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.currentDate != prevState.currentDate) {
      this.fetchTodos();
    }
  }
  fetchTodos() {
    databaseRef.on('value', snapshot => {
      if (snapshot.val()) {
        let todaysTasks = snapshot.val()[this.state.currentDate];
        if (todaysTasks) {
          let keys = Object.keys(todaysTasks);
          todaysTasks = Object.values(todaysTasks);
          keys.forEach((key, i) => {
            todaysTasks[i].id = key;
          });
          let doneTasks = todaysTasks.filter(item => item.status === true);
          let pendingTasks = todaysTasks.filter(item => item.status === false);
          let highPriority = pendingTasks.filter(item => item.priority == 'High');
          let mediumPriority = pendingTasks.filter(item => item.priority == 'Medium');
          let lowPriority = pendingTasks.filter(item => item.priority == 'Low');
          pendingTasks = [...highPriority, ...mediumPriority, ...lowPriority];
          this.setState({ tasks: pendingTasks, openSnackBar: true, doneTasks, getTasks: true });
        } else {
          this.setState({
            getTasks: !false
          });
        }
      }
    })
  }
  addTodo() {
    if (this.state.name || this.state.priority) {
      let date = new Date();
      databaseRef.child(this.state.currentDate).push({
        name: this.state.name,
        priority: this.state.priority,
        status: false
      });
    }
  }
  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  doneTask(id) {
    let date = new Date();
    databaseRef.child(this.state.currentDate).child(id).update({ status: true });
  }
  delete(id) {
    let date = new Date();
    databaseRef.child(this.state.currentDate).child(id).remove();
    if (this.state.tasks.length === 1) {
      this.setState({ tasks: [] });
    };
  }
  showDoneTasks() {
    this.setState({ doneTasksDialog: true });
  }
  closeDoneTasksModal() {
    this.setState({ doneTasksDialog: false });
  }
  notDoneTask(id) {
    let date = new Date();
    databaseRef.child(this.state.currentDate).child(id).update({ status: false });
  }
  toggleDrawer(open) {
    this.setState({
      openDrawer: open
    });
  }
  setTasksDate(date) {
    let currentDateAndTimeRef = new Date();
    this.setState({
      currentDate: date
        ?
        date
        :
        `${currentDateAndTimeRef.getDate()}-${currentDateAndTimeRef.getMonth()}-${currentDateAndTimeRef.getFullYear()}`
    });
    if (date) this.setState({ showTheCurrentDateBTN: true });
    else this.setState({ showTheCurrentDateBTN: false });
  }
  render() {
    const { classes } = this.props;
    const today = new Date();
    let yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    yesterday = `${yesterday.getDate()}-${yesterday.getMonth()}-${yesterday.getFullYear()}`;
    return (
      <div className={classes.root}>
        <AppBar position="static" style={{ backgroundColor: '#27ae60' }}>
          <Toolbar>
            <IconButton className={classes.menuButton} onClick={_ => this.toggleDrawer(true)} color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" className={classes.flex}>
              Task Planner
          </Typography>
          </Toolbar>
        </AppBar>
        <Drawer open={this.state.openDrawer} yesterday={yesterday} setTasksDate={this.setTasksDate} toggleDrawer={this.toggleDrawer} />
        <form action="JavaScript:void(0)" className={classes.addTodoForm} onSubmit={this.addTodo}>
          <TextField
            id="name"
            name="name"
            label="Name"
            className={classes.textField}
            value={this.state.name}
            onChange={this.handleChange}
            margin="normal"
          />
          <Select
            value={this.state.priority}
            onChange={this.handleChange}
            inputProps={{
              name: 'priority',
              id: 'priority-simple',
            }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value='Low'>Low</MenuItem>
            <MenuItem value='Medium'>Medium</MenuItem>
            <MenuItem value='High'>High</MenuItem>
          </Select><br />
          <Button type="submit" variant="contained" color="primary" className={classes.button}>
            Save
      </Button>
        </form>
        {this.state.tasks.length ? <List dense={false}>
          {this.state.tasks.map(task => {
            let priorityColor = '';
            switch (task.priority) {
              case 'Low':
                priorityColor = '#f39c12';
                break;
              case 'Medium':
                priorityColor = '#27ae60';
                break;
              case 'High':
                priorityColor = '#c0392b';
                break;
              default: {
                priorityColor = '#f39c12';
              }
            }
            return (
              <EachTodo
                task={task}
                deleteFunc={this.delete}
                reference={this}
                doneOrNotDoneTask={this.doneTask}
                priorityColor={priorityColor}
              />
            )
          })
          }
        </List> : this.state.getTasks ? <p className={classes.zeroTodoIndicator}>Nothing Todo</p> : <i className="fas fa-5x fa-spinner fa-spin" style={{ marginLeft: '50%', marginTop: 50 }}></i>}
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={this.state.openSnackBar}
          onClose={this.handleClose}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          action={[
            <Button className={classes.doneTasksBTN} onClick={this.showDoneTasks}>Show</Button>
          ]}
          message={<span id="message-id">{this.state.doneTasks.length} Tasks Done</span>}
        />
        <Dialog
          open={this.state.doneTasksDialog}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.closeDoneTasksModal}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">
            Done Tasks
          </DialogTitle>
          <DialogContent style={{ width: 300 }}>
            <List>
              {
                this.state.doneTasks.length
                  ?
                  this.state.doneTasks.map(task => {
                    let priorityColor = '';
                    switch (task.priority) {
                      case 'Low':
                        priorityColor = '#f39c12';
                        break;
                      case 'Medium':
                        priorityColor = '#27ae60';
                        break;
                      case 'High':
                        priorityColor = '#c0392b';
                        break;
                      default: {
                        priorityColor = '#f39c12';
                      }
                    }
                    return (<EachTodo
                      task={task}
                      deleteFunc={this.delete}
                      reference={this}
                      doneOrNotDoneTask={this.notDoneTask}
                      priorityColor={priorityColor}
                    />)
                  }
                  )
                  :
                  <p>No Done Tasks</p>
              }
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeDoneTasksModal} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
  {
    this.state.showTheCurrentDateBTN&&
        <Button variant="fab" aria-label="Go to the current date" color="secondary" style={{ position: 'absolute', bottom: 30, right: 30 }} className={classes.button}>
          <NavigateNext />
        </Button>
  }
      </div>
    );
  }
}

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  doneTasksBTN: {
    color: "#fff",
    backgroundColor: '#27ae60'
  },
  button: {
    margin: theme.spacing.unit,
  },
  flex: {
    flex: 1,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  zeroTodoIndicator: {
    color: "#7f8c8d",
    fontSize: 20,
    textAlign: 'center',
    marginTop: 40
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  addTodoForm: {
    margin: '0px auto',
    width: 210
  }
});

export default withStyles(styles)(App);
