import {db, FirebaseTimestamp} from '../../firebase'
import {
  collection,
  doc,
  setDoc,
  query,
  orderBy,
  getDoc,
  getDocs,
  deleteDoc,
  writeBatch,
  where
} from "firebase/firestore";
import {push} from 'connected-react-router'
import {deleteProductAction, fetchProductsAction} from './actions'

export const deleteProduct = (id) => {
  return async (dispatch, getState) => {
    await deleteDoc(doc(db, 'products', id))
        .then(() => {
          const prevProducts = getState().products.list
          const nextProducts = prevProducts.filter(product => product.id !== id)
          dispatch(deleteProductAction(nextProducts))
        })
  }
}

export const fetchProducts = (gender, category) => {
  return async (dispatch) => {
    let q = query(collection(db, 'products'), orderBy('updated_at', 'desc'))
    q = (gender !== '') ? query(collection(db, 'products'), where('gender', '==', gender), orderBy('updated_at', 'desc')) : q;
    q = (category !== '') ? query(collection(db, 'products'), where('category', '==', category), orderBy('updated_at', 'desc')) : q;
    await getDocs(q).then((snapshots) => {
      const productList = []
      snapshots.forEach(snapshot => {
        const product = snapshot.data()
        productList.push(product)
      })
      dispatch (fetchProductsAction(productList))
    })
  }
}

export const orderProduct = (productsInCart, amount) => {
  return async (dispatch, getState) => {
    const uid = getState().users.uid;
    const timestamp = FirebaseTimestamp.now();

    let products = [];
    let soldOutProducts = [];

    const batch = writeBatch(db);

    for (const product of productsInCart) {
      const productDocRef = doc(db, 'products', product.productId)
      const snapshot = await getDoc(productDocRef)
      const sizes = snapshot.data().sizes

      const updatedSizes = sizes.map(size => {
        if (size.size === product.size) {
          if(size.quantity === 0) {
            soldOutProducts.push(product.name)
            return size
          }
          return {
            size: size.size,
            quantity: size.quantity -1
          }
        } else {
          return size
        }
      })

      products.push({
        id: product.productId,
        images: product.images,
        name: product.name,
        price: product.price,
        size: product.size
      })

      batch.update(productDocRef, {sizes: updatedSizes})

      const cartDocRef = doc(db,'users',uid,'cart',product.cartId)
      batch.delete(cartDocRef)
    }

    if (soldOutProducts.length > 0) {
      const errorMessage = (soldOutProducts.length > 1) ? soldOutProducts.join('と') : soldOutProducts[0];
      alert('大変申し訳ありません。' + errorMessage + 'が在庫切れとなったため、注文処理を中断しました。')
      return false
    } else {
      await batch.commit().then(async () => {
        const orderRef = doc(collection(db, 'users', uid, 'orders'))
        const date = timestamp.toDate()
        const shippingDate = FirebaseTimestamp.fromDate(new Date(date.setDate(date.getDate() + 3)))

        const history = {
          amount: amount,
          created_at: timestamp,
          id: orderRef.id,
          products: products,
          shipping_date: shippingDate,
          updated_at: timestamp
        }

        await setDoc(orderRef, history)

        dispatch(push('/order/complete'))

      }).catch(() => {
        alert('注文処理に失敗しました。通信環境をご確認のうえ、もう一度お試しください。')
        return false
      })
    }

  }
}

export const saveProduct = (id, name, description, category, gender, price, images, sizes) => {
  return async (dispatch) => {
    const timestamp = FirebaseTimestamp.now()

    const data = {
      category: category,
      description: description,
      gender: gender,
      images: images,
      name: name,
      price: parseInt(price, 10),
      sizes: sizes,
      updated_at: timestamp
    }

    let productRef;
    if (id === '') {
      productRef = doc(collection(db, 'products'))
      data.id = productRef.id
      data.created_at = timestamp
    } else {
      productRef = doc(db, 'products', id)
    }

    await setDoc(productRef, data, { merge: true })
        .then(() => {
          dispatch(push('/'))
        })
        .catch((error) => {
          throw new Error(error)
        })
  }
}
