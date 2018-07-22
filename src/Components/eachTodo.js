import React from "react";
import DeleteIcon from '@material-ui/icons/Delete';
import { Done } from "@material-ui/icons";
import {
    ListItemText,
    ListItemSecondaryAction, ListItem,
    ListItemAvatar,
    Avatar
} from "@material-ui/core";
import { IconButton } from "@material-ui/core";

export default ({ task, reference, doneOrNotDoneTask, priorityColor, deleteFunc }) => {
    return (
        <ListItem>
            <ListItemAvatar>
                <Avatar>
                    <div style={{ width: 40, height: 40, backgroundColor: priorityColor }} />
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={task.name}
                secondary={false ? 'Secondary text' : null}
            />
            <ListItemSecondaryAction>
                <IconButton aria-label="changeState" onClick={doneOrNotDoneTask.bind(reference, task.id)}>
                    <Done style={task.status ? { backgroundColor: 'green', color: '#fff' } : {}} />
                </IconButton>
                <IconButton aria-label="Delete" onClick={deleteFunc.bind(reference, task.id)}>
                    <DeleteIcon />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    )
};