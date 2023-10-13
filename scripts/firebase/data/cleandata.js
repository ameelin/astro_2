const admin = require('firebase-admin');

const serviceAccount = require('../../../private/astro-serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const firestore = admin.firestore();

// Function to recursively update a nested object
function updateNestedObject(obj, search, replacement) {
  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      updateNestedObject(obj[key], search, replacement);
    } else if (typeof obj[key] === 'string') {
      obj[key] = obj[key].replace(search, replacement);
    }
  }
}

// Function to update a document
async function updateDocument(collectionRef, docId, search, replacement) {
  const docRef = collectionRef.doc(docId);
  const docSnapshot = await docRef.get();

  if (docSnapshot.exists) {
    const data = docSnapshot.data();
    updateNestedObject(data, search, replacement);
    await docRef.set(data);
    console.log(`Updated document ${docId}`);
  }
}

// Function to update a collection
async function updateCollection(collectionName, search, replacement) {
  const collectionRef = firestore.collection(collectionName);
  const collectionSnapshot = await collectionRef.get();

  for (const docSnapshot of collectionSnapshot.docs) {
    await updateDocument(collectionRef, docSnapshot.id, search, replacement);
  }
}

// Main function
async function cleanData() {
  try {
    const args = process.argv.slice(2);
    if (args.length < 1) {
      console.error('Usage: node cleandata.js "search1:replace1" "search2:replace2" ...');
      return;
    }

    for (const arg of args) {
      const [search, replacement] = arg.split(':');
      const collectionsSnapshot = await firestore.listCollections();

      for (const collectionRef of collectionsSnapshot) {
        const collectionName = collectionRef.id;
        await updateCollection(collectionName, search, replacement);
      }
    }

    console.log('Data cleaning complete.');
  } catch (error) {
    console.error('Data cleaning failed:', error);
  }
}

cleanData().then(() => {
  process.exit();
});
