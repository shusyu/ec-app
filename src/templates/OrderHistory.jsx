import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import List from '@mui/material/List';
import { makeStyles } from '@mui/styles';
import {getOrdersHistory} from '../reducks/users/selectors';
import {fetchOrdersHistory} from '../reducks/users/operations';
import {OrderHistoryItem} from '../components/Products'

const useStyles = makeStyles((theme) => ({
  orderList: {
    background: theme.palette.grey['100'],
    [theme.breakpoints.down('md')]: {
      width: '100%'
    },
    [theme.breakpoints.up('md')]: {
      width: 768
    }
  }
}))

const OrderHistory = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selector = useSelector((state) => state);
  const orders = getOrdersHistory(selector)

  useEffect(() => {
    dispatch(fetchOrdersHistory())
  }, [])

  return (
    <section className='c-section-wrapin'>
      <List
        sx={{
          margin: '0 auto',
          padding: '32px'
        }}
        className={classes.orderList}
      >
        {orders.length > 0 && (
          orders.map(order => <OrderHistoryItem order={order} key={order.id} />)
        )}
      </List>
    </section>
  )
}

export default OrderHistory
