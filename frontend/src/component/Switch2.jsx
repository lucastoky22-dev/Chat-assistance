import React, {useState} from 'react';
import {
    Box,
    Button,
    Typography
} from '@mui/material';

export default class Switch2{
    
    construct(){
        this.switchValue = false;
        switchInvoked();
    }

    isActivated = () => {
            alert("hello, world");
        }  

    switchInvoked() {
        
        return(
            <Button
                variant='contained'
                onClick={this.isActivated()}
            >click me</Button>
        )
    }

    getSwitchValue(){
        return this.switchValue;
    }
}