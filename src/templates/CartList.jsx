import React, {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import List from '@mui/material/List';
import {getProductsInCart} from '../reducks/users/selectors';
import {CartListItem} from '../components/Products'
import {PrimaryButton, GreyButton} from '../components/UIkit';
import {push} from 'connected-react-router';

const CartList = () => {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state);
  const productsInCart = getProductsInCart(selector);

  const goToOrder = useCallback(() => {
    dispatch(push('/order/confirm'))
  }, [])

  const backToHome = useCallback(() => {
    dispatch(push('/'))
  }, [])

  return (
    <section className={'c-section-wrapin'}>
      <h2 className={'u-text__headline'}>
        ショッピングカート
      </h2>
      <List
        sx={{
          margin: '0 auto',
          maxWidth: 512,
          width: '100%'
        }}
      >
        {productsInCart.length > 0 && (
          productsInCart.map(product => <CartListItem key={product.cartId} product={product} />)
        )}
      </List>
      <div className={'module-spacer--medium'}/>
      <div className={'p-grid__column'}>
        <PrimaryButton
          label={'レジへ進む'}
          onClick={goToOrder}
        />
        <div className={'module-spacer--extra-extra-small'}/>
        <GreyButton
          label={'ショッピングを続ける'}
          onClick={backToHome}
        />
      </div>
    </section>
  )
}

export default CartList
