const admin = require('firebase-admin');
const serviceAccount = require('../../../private/astro-serviceAccountKey.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Fetch collections and store names in a Firestore collection named "stars"
async function fetchAndStoreCollectionNames() {
  try {
    const firestore = admin.firestore();
    const collections = await firestore.listCollections();

    // Filter collections that start with capital letters
    const collectionNames = collections
      .filter((col) => /^[A-Z]/.test(col.id)) // Only names that start with capital letters
      .map((col) => col.id);

    // Store the collection names in the "stars" collection
    const starsCollectionRef = firestore.collection('stars');
    await starsCollectionRef.doc('starNames').set({ names: collectionNames });

    console.log('Collection names stored in "stars" collection.');
  } catch (error) {
    console.error('Error fetching and storing collection names:', error);
  }
}

fetchAndStoreCollectionNames();
