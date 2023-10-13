const admin = require('firebase-admin');
const serviceAccount = require('../../../private/astro-serviceAccountKey.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Add a Firestore collection "astroMethods" with a document "astroMethodNames" 
async function addCollectionAstroMethods() {
  try {
    const firestore = admin.firestore();
    const xCollectionRef = firestore.collection('astroMethods');
    
    // Define the data to be stored in the document
    const data = { names: ['Vedic', 'Numerology'] };

    // Set the data in the "xnames" document
    await xCollectionRef.doc('astroMethodNames').set(data);

    console.log('collection "astroMethods" with document "astroMethodNames" added.');
  } catch (error) {
    console.error('Error adding collection "astroMethods":', error);
  }
}

addCollectionAstroMethods();
