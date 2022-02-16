import React, {useEffect, useCallback, useState} from 'react';
import {useDispatch } from 'react-redux';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { makeStyles } from '@mui/styles';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import HistoryIcon from '@mui/icons-material/History';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import {TextInput} from '../UIkit';
import {push} from 'connected-react-router';
import {signOut} from '../../reducks/users/operations'
import {
  query,
  collection,
  orderBy,
  getDocs
} from "firebase/firestore";
import {db} from '../../firebase';

const useStyles = makeStyles((theme) => ({
  drawer: {
    [theme.breakpoints.up('sm')]: {
      flexShrink: 0,
      width: 256
    }
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: 256
  },
  searchField: {
    alignItems: 'center',
    display: 'flex',
    marginLeft: 32
  }
}));

const ClosableDrawer = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const {container} = props;

  const [keyword, setKeyword] = useState('')

  const inputKeyword = useCallback((event) => {
    setKeyword(event.target.value)
  }, [setKeyword]);

  const selectMenu = (event, path) => {
    dispatch(push(path))
    props.onClose(event)
  }

  const [filters, setFilters] = useState([
    {func: selectMenu, label: 'すべて', id: 'all', value: '/'},
    {func: selectMenu, label: 'メンズ', id: 'male', value: '/?gender=male'},
    {func: selectMenu, label: 'レディース', id: 'female', value: '/?gender=female'},
  ])

  const menus = [
    {func: selectMenu, label: '商品登録', icon: <AddCircleIcon />, id: 'register', value: '/product/edit'},
    {func: selectMenu, label: '注文履歴', icon: <HistoryIcon />, id: 'history', value: '/order/history'},
    {func: selectMenu, label: 'プロフィール', icon: <PersonIcon />, id: 'profile', value: '/user/mypage'},
  ];

  useEffect(async () => {
    const q = query(collection(db, 'categories'), orderBy('order', 'asc'))
    await getDocs(q).then((snapshots) => {
      const list = []
      snapshots.forEach(snapshot => {
        const category = snapshot.data()
        list.push({
          func: selectMenu,
          label: category.name,
          id: category.id,
          value: `/?category=${category.id}`
        })
      })
      setFilters(prevState => [...prevState, ...list])
    })
  }, [])

  return (
    <nav className={classes.drawer}>
      <Drawer
        container={container}
        variant='temporary'
        anchor='right'
        open={props.open}
        onClose={(e) => props.onClose(e)}
        classes={{paper: classes.drawerPaper}}
      >
        <div
          onClose={(e) => props.onClose(e)}
          onKeyDown={(e) => props.onClose(e)}
        >
          <div className={classes.searchField}>
            <TextInput
              fullWidth={false}
              label={'キーワードを入力'}
              multiline={false}
              onChange={inputKeyword}
              required={false}
              rows={1}
              value={keyword}
              type={'text'}
            />
            <IconButton>
              <SearchIcon/>
            </IconButton>
          </div>
          <Divider />
          <List>
            {menus.map( menu => (
              <ListItem button key={menu.id} onClick={(e) => menu.func(e, menu.value)}>
                <ListItemIcon>
                  {menu.icon}
                </ListItemIcon>
                <ListItemText primary={menu.label} />
              </ListItem>
            ))}
            <ListItem button key='logout' onClick={() => dispatch(signOut())}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary={'Logout'} />
            </ListItem>
          </List>
          <Divider />
          <List>
            {filters.map(filter => (
              <ListItem button key={filter.id} onClick={(e) => filter.func(e, filter.value)}>
                <ListItemText primary={filter.label} />
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>
    </nav>
  )
}

export default ClosableDrawer
