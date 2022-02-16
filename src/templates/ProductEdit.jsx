import React, {useState, useEffect, useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {TextInput, SelectBox, PrimaryButton} from '../components/UIkit';
import {saveProduct} from '../reducks/products/operations'
import {ImageArea, SetSizeArea} from '../components/Products'
import {
  doc,
  getDoc,
  query,
  collection,
  orderBy,
  getDocs
} from "firebase/firestore";
import {db} from '../firebase'


const ProductEdit = () => {
  const dispatch = useDispatch()

  let id = window.location.pathname.split('/product/edit')[1]
  if (id !== '') {
    id = id.split('/')[1]
  }

  const [name, setName] = useState('')
  const [description,setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [categories, setCategories] = useState([])
  const [gender, setGender] = useState('')
  const [price, setPrice] = useState('')
  const [images, setImages] = useState([])
  const [sizes, setSizes] = useState([])

  const inputName = useCallback((event) => {
    setName(event.target.value)
  }, [setName])
  const inputDescription = useCallback((event) => {
    setDescription(event.target.value)
  }, [setDescription])
  const inputPrice = useCallback((event) => {
    setPrice(event.target.value)
  }, [setPrice])

  // const categories = [
  //   {id: 'tops', name: 'トップス'},
  //   {id: 'shirts', name: 'シャツ'},
  //   {id: 'pants', name: 'パンツ'},
  // ]

  const genders = [
    {id: 'all', name: 'すべて'},
    {id: 'male', name: 'メンズ'},
    {id: 'female', name: 'レディース'},
  ]

  useEffect(() => {
    if (id !== '') {
      getDoc(doc(db, 'products', id))
        .then(snapshot => {
          const data = snapshot.data()
          setImages(data.images)
          setName(data.name)
          setDescription(data.description)
          setCategory(data.category)
          setGender(data.gender)
          setPrice(data.price)
          setSizes(data.sizes)
        })
    }
  }, [id])

  useEffect(async () => {
    const q = query(collection(db, 'categories'), orderBy('order', 'asc'))
    await getDocs(q).then((snapshots) => {
      const list = []
      snapshots.forEach(snapshot => {
        const data = snapshot.data()
        list.push({
          id: data.id,
          name: data.name
        })
      })
      setCategories(list)
    })
  }, [])

  return (
    <section>
      <h2 className='u-text__headline u-text-center'>商品の登録・編集</h2>
      <div className={'c-section-container'}>
        <ImageArea images={images} setImages={setImages}/>
        <TextInput
          fullWidth={true}
          label={'商品名'}
          multiline={false}
          required={true}
          rows={1}
          value={name}
          type={'text'}
          onChange={inputName}
        />
        <div className='module-spacer--small'/>
        <TextInput
          fullWidth={true}
          label={'商品説明'}
          multiline={true}
          required={true}
          rows={5}
          value={description}
          type={'text'}
          onChange={inputDescription}
        />
        <div className='module-spacer--small'/>
        <SelectBox
          label={'カテゴリー'}
          required={true}
          options={categories}
          select={setCategory}
          value={category}
        />
        <div className='module-spacer--small'/>
        <SelectBox
          label={'性別'}
          required={true}
          options={genders}
          select={setGender}
          value={gender}
        />
        <div className='module-spacer--small'/>
        <TextInput
          fullWidth={true}
          label={'価格'}
          multiline={false}
          required={true}
          rows={1}
          value={price}
          type={'number'}
          onChange={inputPrice}
        />
        <div className='module-spacer--small'/>
        <SetSizeArea sizes={sizes} setSizes={setSizes}/>
        <div className='module-spacer--small'/>
        <div className={'center'}>
          <PrimaryButton
            label={'商品情報を保存'}
            onClick={() => dispatch(saveProduct(id, name, description, category, gender, price, images, sizes))}
          />
        </div>
      </div>
    </section>
  )
}

export default ProductEdit
