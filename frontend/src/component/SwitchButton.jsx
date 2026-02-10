import React from 'react';
import {useState} from 'react';

import {
    Box,
    Typography
} from '@mui/material';

import {amber, indigo, deepPurple, blueGrey, lightGreen, blue} from '@mui/material/colors';

export const SwitchButton = ({value, setValue}) => {
  return (
    <Box
        onClick={setValue}
        sx={{
            width:60,
            height:30,
            p:"0.2rem",
            bgcolor:lightGreen[100],
            borderRadius:5,
            display:"flex",
            flexDirection:value?"row-reverse":"row",
            alignItems:"center",
            gap:1,
            boxShadow:value?"0 8px 20px rgba(55, 78, 255, 0.97)":"",
        }}
        
    >
        <Box
            sx={{
                width:"40%",
                height:"90%",
                bgcolor:value?blue[500]:blueGrey[500],
                borderRadius:"50%",
            }}
        ></Box>
        <Typography
            id="typo"
            sx={{
                fontSize:12,
                fontWeight:600,
                cursor:"pointer"
            }}
        >{value?"off":"on"}</Typography>
    </Box>
  )
};

export const switchValue = (value) =>{
    return value;
}