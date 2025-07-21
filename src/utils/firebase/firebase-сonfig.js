import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  console.log('🔥 Initializing Firebase Admin');
  admin.initializeApp({
    credential: admin.credential.cert({
      type: 'service_account',
      project_id: 'pink-skirt-inna',
      private_key_id: process.env.PRIVATE_KEY_ID,
      private_key: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email:
        'firebase-adminsdk-fbsvc@pink-skirt-inna.iam.gserviceaccount.com',
      client_id: '111780354242072966088',
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url:
        'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40pink-skirt-inna.iam.gserviceaccount.com',
      universe_domain: 'googleapis.com',
    }),
    storageBucket: 'pink-skirt-inna.firebasestorage.app',
  });
}

const db = admin.firestore();
const storage = admin.storage().bucket();

export { db, storage };
