import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@material-ui/core";

export default ({ close, open, transition }) => {
    const imagesLinks = [
        'https://cdn.motivationgrid.com/wp-content/uploads/2013/12/tumblr_ltbfmgRaXi1qe52v7o1_500.jpg',
        'https://cdn.motivationgrid.com/wp-content/uploads/2013/12/1470073_1444474165776214_1973217248_n.jpg',
        'https://cdn.motivationgrid.com/wp-content/uploads/2013/12/14.png',
        'https://cdn.motivationgrid.com/wp-content/uploads/2013/12/7037_596005050434757_984827979_n.jpg',
        'https://cdn.motivationgrid.com/wp-content/uploads/2013/12/31.jpg',
        'https://cdn.motivationgrid.com/wp-content/uploads/2013/12/4-Motivational-Quotes.jpg',
        'http://movemequtoes.vwiwfzyhdalszsul2q.maxcdn-edge.com/wp-content/uploads/2012/03/inspirational-quotes-28.jpg',
        'https://www.builtlean.com/wp-content/uploads/2013/04/motivational-images-6.jpg',
        'https://www.builtlean.com/wp-content/uploads/2013/04/motivational-images-7.jpg',
        'https://thumb7.shutterstock.com/display_pic_with_logo/1244710/272553857/stock-photo-inspirational-motivational-life-quote-on-blur-background-design-272553857.jpg'
    ];
    const getRandomNumber = limit => Math.floor(Math.random() * limit);
    return (
        <Dialog
            open={open}
            TransitionComponent={transition}
            keepMounted
            onClose={close}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle id="alert-dialog-slide-title">
                Congratulations, You've done!
          </DialogTitle>
            <DialogContent>
                <img src={imagesLinks[getRandomNumber(imagesLinks.length)]} alt="motivational" />
            </DialogContent>
            <DialogActions>
                <Button onClick={close} color="primary">
                    Close
            </Button>
            </DialogActions>
        </Dialog>
    );
}