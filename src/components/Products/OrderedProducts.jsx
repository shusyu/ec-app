import React, {useCallback} from 'react';
import {useDispatch} from 'react-redux';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Divider from '@mui/material/Divider';
import { makeStyles } from '@mui/styles';
import {PrimaryButton} from '../UIkit';
import {push} from 'connected-react-router'

const useStyles = makeStyles({
  list: {
    background: '#fff',
    height: 'auto',
  },
  image: {
    objectFit: 'cover',
    margin: '8px 16px 8px 0',
    height: 96,
    width: 96
  },
  text: {
    width: '100%'
  }
})


const OrderedProducts = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const products = props.products;

  const goToProductDetail = useCallback((id) => {
    dispatch(push('/product/'+id))
  }, [])

  return (
    <List>
      {products.map((product, index) => (
        <React.Fragment>
          <ListItem className={classes.list} key={index}>
            <ListItemAvatar>
              <img
                className={classes.image}
                src={product.images[0].path}
                alt={'Ordered Product'}
              />
            </ListItemAvatar>
            <div className={classes.text}>
              <ListItemText
                primary={product.name}
                secondary={'サイズ: ' + product.size}
              />
              <ListItemText
                primary={'¥' + product.price.toLocaleString()}
              />
            </div>
            <PrimaryButton
              label={'商品詳細を見る'}
              onClick={() => goToProductDetail(product.id)}
            />
          </ListItem>
          <Divider />
        </React.Fragment>
      ))}
    </List>
  )
}

export default OrderedProducts
