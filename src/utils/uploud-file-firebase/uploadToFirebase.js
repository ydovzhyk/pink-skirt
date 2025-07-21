import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from '@/firebase/firebaseConfig'; // шлях до firebase ініціалізації

const storage = getStorage(app);

export const uploadFileToFirebase = async (file, path = 'stories') => {
  const fileRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
  await uploadBytes(fileRef, file);
  return await getDownloadURL(fileRef);
};
