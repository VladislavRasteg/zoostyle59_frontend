import { styled } from '@mui/material/styles';
import Select, { SelectProps } from '@mui/material/Select';
import MenuItem, {MenuItemProps} from '@mui/material/MenuItem';
import {ReactComponent as DropdownIcon} from "./dropdown_24px.svg"

export const ColorSelect = (props: SelectProps) => {
  return(
    <Select
      {...props}
      sx={{
        color: '#1B1D1F',
        backgroundColor: '#FFFFFF',
        padding: '0px',
        textTransform: "none",
        fontWeight: "400",
        fontSize: "16px",
        borderRadius: "14px",
        border: 'none',
        boxShadow: 'inset 0 0 0 1px #a5b1ca4d',
        outline: 'none !important',
        stroke: 'none !important',
        width: '100%',
        fontFamily: "Inter",
        height: '46px',
        appearance:  'none',
        MozAppearance: 'none',
        WebkitAppearance: 'none'
      }}
      

      MenuProps={{
        sx: {
          borderRadius: '8px',
        },
        slotProps: {
          paper: {
            sx: {
              width: '500px',
              maxWidth: "90vw",
              border: 'none',
              borderRadius: '14px',
              boxShadow: "0px 0px 3px rgba(165, 177, 202, .3), 0px 10px 40px rgba(165, 177, 202, .3);",
              marginTop: '8px'
            }
          }
        },
        MenuListProps: {
          sx: {
            padding: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: "4px"
          }
        }
      }}
      
      IconComponent={DropdownIcon}
    ></Select>
  )
}

export const ColorMenuItem = styled(MenuItem)<MenuItemProps>(({ theme }) => ({
  fontSize: '16px',
  borderRadius: "8px",
  padding: '10px 20px',
  transition: '400ms',
  "&:hover" : {
    background: '#F2F3F8'
  },
  "&:focus" : {
    background: '#F2F3F8'
  },
  "&:active" : {
    background: '#F2F3F8'
  },
  "&:active:hover" : {
    background: '#F2F3F8'
  },
  "&:focus:hover" : {
    background: '#F2F3F8'
  },
  "&.Mui-selected": {
    background: '#F2F3F8'
  }
}));
