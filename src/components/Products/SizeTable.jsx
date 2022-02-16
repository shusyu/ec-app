import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import { makeStyles } from '@mui/styles';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const useStyles = makeStyles({
  iconCell: {
    height: 48,
    width: 48
  }
});

const SizeTable = (props) => {
  const classes = useStyles();
  const sizes = props.sizes;
  return (
    <TableContainer>
      <Table>
        <TableBody>
          {sizes.length > 0 && (
            sizes.map((item, i) => (
              <TableRow key={item.size}>
                <TableCell component='th' scope='row'>
                  {item.size}
                </TableCell>
                <TableCell>
                  残り{item.quantity}点
                </TableCell>
                <TableCell className={classes.iconCell}>
                  {item.quantity > 0 ? (
                    <IconButton sx={{padding: 0}} onClick={() => props.addProduct(item.size)}>
                      <ShoppingCartIcon />
                    </IconButton>
                  ) : (
                    <div>売切</div>
                  )}
                </TableCell>
                <TableCell className={classes.iconCell}>
                  <IconButton sx={{padding: 0}} onClick={() => console.log('Clicked Favorite!')}>
                    <FavoriteBorderIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )

}

export default SizeTable
