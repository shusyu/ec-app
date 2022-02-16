import React, {useCallback} from 'react';
import IconButton from '@mui/material/IconButton';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { makeStyles } from '@mui/styles';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import ImagePreview from './ImagePreview';

const useStyles = makeStyles({
  icon: {
    height: 48,
    width: 48
  }
});

const ImageArea = (props) => {
  const classes = useStyles();

  const deleteImage = useCallback(async (id) => {
    const ret = window.confirm('この画像を削除しますか？')
    if (!ret) {
      return false
    } else {
      const newImage = props.images.filter(image => image.id !== id)
      props.setImages(newImage)
      return deleteObject(ref(storage, 'images/' + id))
    }
  }, [props.images])

  const uploadImage = useCallback((event) => {
    const file = event.target.files;
    let blob = new Blob(file, { type: "image/jpeg" });

    // Generate random 16 digits strings
    const S="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const N=16;
    const fileName = Array.from(crypto.getRandomValues(new Uint32Array(N))).map((n)=>S[n%S.length]).join('')

    const storageRef = ref(storage, 'images/' + fileName)
    uploadBytes(storageRef, blob).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downloadURL) => {
        const newImage = {id: fileName, path: downloadURL}
        props.setImages((prevState => [...prevState, newImage]))
      })
    })

  }, [props.setImages])

  return (
    <div>
      <div className={'p-grid__list-images'}>
        {props.images.length > 0 && (
          props.images.map(image => <ImagePreview delete={deleteImage} path={image.path} id={image.id} key={image.id}/>)
        )}
      </div>
      <div className='u-text-right'>
        <span>商品画像を登録する</span>
        <IconButton className={classes.icon}>
          <label>
            <AddPhotoAlternateIcon />
            <input
              className='u-display-none'
              type='file'
              id='image'
              onChange={(event) => uploadImage(event)}
            />
          </label>
        </IconButton>
      </div>
    </div>
  )
}

export default ImageArea
