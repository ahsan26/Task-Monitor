import React, { Component, PureComponent } from 'react';
import { AppBar, IconButton, Typography, Button, TextField, Toolbar, Select, ListItemText, ListItemSecondaryAction, MenuItem, List, ListItem, ListItemAvatar, Avatar } from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import { withStyles } from '@material-ui/core/styles';
import { databaseRef } from "./firebase";
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';
import { Done } from "@material-ui/icons"
class App extends PureComponent {
  constructor() {
    super();
    this.state = {
      name: '',
      priority: '',
      tasks: []
    };
    this.addTodo = this.addTodo.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  componentWillMount() {
    databaseRef.on('value', snapshot => {
      if (snapshot.val()) {
        let date = new Date();
        let todaysTasks = snapshot.val()[`${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`];
        let keys = Object.keys(todaysTasks);
        todaysTasks = Object.values(todaysTasks);
        keys.forEach((key, i) => {
          todaysTasks[i].id = key;
        })
        let highPriority = todaysTasks.filter(item => item.priority == 'High');
        let mediumPriority = todaysTasks.filter(item => item.priority == 'Medium');
        let lowPriority = todaysTasks.filter(item => item.priority == 'Low');
        todaysTasks = [...highPriority, ...mediumPriority, ...lowPriority];
        this.setState({ tasks: todaysTasks });
      }
    })
  }
  addTodo() {
    if (this.state.name || this.state.priority) {
      let date = new Date();
      databaseRef.child(`${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`).push({
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
    databaseRef.child(`${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`).child(id).update({ status: true });
  }
  delete(id) {
    let date = new Date();
    databaseRef.child(`${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`).child(id).remove();
  }
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" className={classes.flex}>
              Task Planner
          </Typography>
          </Toolbar>
        </AppBar>
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
        {this.state.tasks && <List dense={false}>
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
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <div style={{ width: 40, height: 40, backgroundColor: priorityColor }}></div>
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={task.name}
                  secondary={false ? 'Secondary text' : null}
                />
                <ListItemSecondaryAction>
                  <IconButton aria-label="Delete" onClick={!task.status ? this.doneTask.bind(this, task.id) : _ => { }}>
                    <Done style={task.status ? { backgroundColor: 'green', color: '#fff' } : {}} />
                  </IconButton>
                  <IconButton aria-label="Delete" onClick={this.delete.bind(this, task.id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            )
          })
          }
        </List>}
      </div>
    );
  }
}

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
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
