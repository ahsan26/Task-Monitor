import React from "react";
import { SwipeableDrawer, Divider, List, ListItem, ListItemText, IconButton, ListItemSecondaryAction } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';
import { NavigateNext } from "@material-ui/icons";
import PropTypes from "prop-types";

const Drawer = ({ toggleDrawer, open, classes, yesterday, setTasksDate }) => {
    return (
        <SwipeableDrawer
            open={open}
            onClose={_ => toggleDrawer(false)}
            onOpen={_ => toggleDrawer(true)}
        >
            <div
                tabIndex={0}
                role="button"
                onClick={_ => toggleDrawer(false)}
                onKeyDown={_ => toggleDrawer(false)}
                style={{ width: 300 }}
            >
                <div className={classes.list}>
                    <List>
                        <ListItem>
                            <ListItemText
                                primary={yesterday}
                                secondary={false ? 'Secondary text' : null}
                            />
                            <ListItemSecondaryAction>
                                <IconButton onClick={_ => { setTasksDate(yesterday) }}>
                                    <NavigateNext />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    </List>
                </div>

            </div>
        </SwipeableDrawer>
    );
}

const styles = {
    list: {
        width: 'auto'
    }
};

Drawer.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Drawer);