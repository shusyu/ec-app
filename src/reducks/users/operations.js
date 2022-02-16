import {
  fetchProductsInCartAction,
  fetchOrdersHistoryAction,
  signInAction,
  signOutAction
} from './actions'
import {push} from 'connected-react-router'
import {auth, db, FirebaseTimestamp} from '../../firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut as authSignOut,
  sendPasswordResetEmail
} from "firebase/auth";
import {
  collection,
  doc,
  setDoc,
  query,
  orderBy,
  getDoc,
  getDocs
} from "firebase/firestore";

export const addProductToCart = (addedProduct) => {
  return async(dispatch, getState) => {
    const uid = getState().users.uid
    const cartRef = doc(collection(db, 'users', uid, 'cart'))
    addedProduct['cartId'] = cartRef.id
    await setDoc(cartRef, addedProduct)
    dispatch(push('/'))
  }
}

export const fetchProductsInCart = (products) => {
  return async (dispatch) => {
    dispatch(fetchProductsInCartAction(products))
  }
}

export const fetchOrdersHistory = () => {
  return async (dispatch, getState) => {
    const uid = getState().users.uid
    const list = []

    const q = query(collection(db, 'users', uid, 'orders'), orderBy('updated_at', 'desc'))
    await getDocs(q).then((snapshots) => {
      snapshots.forEach(snapshot => {
        const data = snapshot.data()
        list.push(data)
      })
      dispatch(fetchOrdersHistoryAction(list))
    })

  }
}

// 認証のリッスン
export const listenAuthState = () => {
  return async (dispatch) => {
    return await onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid

        await getDoc(doc(db, 'users', uid))
            .then(snapshot => {
              const data = snapshot.data()

              dispatch(signInAction({
                cart: [],
                isSignedIn: true,
                role: data.role,
                uid: uid,
                username: data.username
              }))

            })
      } else {
        dispatch(push('/signin'))
      }
    })
  }
}

// ログイン
export const signIn = (email, password) => {
  return async (dispatch) => {
    if (email === '' || password === '') {
      alert('必須項目が見入力です')
      return false
    }

    signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          const user = userCredential.user

          if (user) {
            const uid = user.uid

            await getDoc(doc(db, 'users', uid))
                .then(snapshot => {
                  const data = snapshot.data()

                  dispatch(signInAction({
                    cart: [],
                    isSignedIn: true,
                    role: data.role,
                    uid: uid,
                    username: data.username
                  }))

                  dispatch(push('/'))
                })
                .catch(err => {
                  console.log(err.message)
                })
          }
        })
  }
}

export const resetPassword = (email) => {
  return async (dispatch) => {
    if (email === '') {
      alert('必須項目が未入力です')
      return false
    } else {
      sendPasswordResetEmail(auth, email)
          .then(() => {
            alert('入力されたアドレスにパスワードリセット用のメールをお送りしました。')
            dispatch(push('/signin'))
          })
          .catch(() => {
            alert('パスワードリセットに失敗しました。')
          })
    }

  }
}


// アカウント作成
export const signUp = (username, email, password, confirmPassword) => {
  return async (dispatch) => {
    if (username === '' || email === '' || password === '' || confirmPassword === '') {
      alert('必須項目が見入力です')
      return false
    }
    if (password !== confirmPassword) {
      alert('パスワードが一致しません。もう一度お試しください')
      return false
    }

    return createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          const user = userCredential.user
          if (user) {
            const uid = user.uid
            const timestamp = FirebaseTimestamp.now()
            const userInitialData = {
              created_at: timestamp,
              email: email,
              role: 'customer',
              uid: uid,
              updated_at: timestamp,
              username: username
            }

            await setDoc(doc(db, 'users',uid), userInitialData)
                .then(() => {
                  dispatch(push('/'))
                })
          }
        })
  }
}

export const signOut = () => {
  return async (dispatch) => {
    authSignOut(auth).then(() => {
      dispatch(signOutAction())
      dispatch(push('/signin'))
    })
  }
}
