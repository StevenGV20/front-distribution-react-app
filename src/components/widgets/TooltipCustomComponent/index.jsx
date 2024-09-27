import * as React from 'react';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';

const TooltipCustomComponent = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} arrow/>
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: 'gray',
      color: 'white',
      maxWidth: 250,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }));

export default TooltipCustomComponent;
