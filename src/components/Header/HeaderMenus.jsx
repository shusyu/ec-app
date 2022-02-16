import React, {useEffect} from 'react';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MenuIcon from '@mui/icons-material/Menu';
import {getUserId, getProductsInCart} from '../../reducks/users/selectors';
import {useDispatch, useSelector} from 'react-redux';
import {db} from '../../firebase';
import { collection, onSnapshot } from "firebase/firestore";
import {fetchProductsInCart} from '../../reducks/users/operations';
import {push} from 'connected-react-router';


const HeaderMenus = (props) => {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state);
  const uid = getUserId(selector)
  let productsInCart = getProductsInCart(selector);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'users', uid, 'cart'),
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const product = change.doc.data();
          const changeType = change.type;

          switch (changeType) {
            case 'added':
              productsInCart.push(product)
              break;
            case 'modified':
              const index = productsInCart.findIndex(product => product.cartId === change.doc.id)
              productsInCart[index] = product
              break;
            case 'removed':
              productsInCart = productsInCart.filter(product => product.cartId !== change.doc.id)
              break;
            default:
              break;
          }
        })
        dispatch(fetchProductsInCart(productsInCart))
      }
    );
    return () => unsubscribe()
  }, [])

  return (
    <>
      <IconButton onClick={() => dispatch(push('/cart'))}>
        <Badge badgeContent={productsInCart.length} color='secondary'>
          <ShoppingCartIcon />
        </Badge>
      </IconButton>
      <IconButton onClick={() => console.log('Clicked Favorite!')}>
        <FavoriteBorderIcon />
      </IconButton>
      <IconButton onClick={(event) => props.handleDrawerToggle(event)}>
        <MenuIcon />
      </IconButton>
    </>
  )
}

export default HeaderMenus
