const admin = require('firebase-admin');

const serviceAccount = require('../../../private/astro-serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const firestore = admin.firestore();

// Function to update a collection's name
async function renameCollection(oldCollectionRef, newCollectionName) {
  try {
    await oldCollectionRef.update({ __collectionId: newCollectionName });
    console.log(`Renamed collection ${oldCollectionRef.id} to ${newCollectionName}`);
  } catch (error) {
    console.error(`Error renaming collection ${oldCollectionRef.id}:`, error);
  }
}

// Main function
async function renameCollections() {
  try {
    const args = process.argv.slice(2);
    if (args.length < 1) {
      console.error('Usage: node renamecollections.js "search1:replace1" "search2:replace2" ...');
      return;
    }

    for (const arg of args) {
      const [search, replacement] = arg.split(':');
      const collectionsSnapshot = await firestore.listCollections();

      for (const oldCollectionRef of collectionsSnapshot) {
        const newCollectionName = oldCollectionRef.id.replace(search, replacement);
        await renameCollection(oldCollectionRef, newCollectionName);
      }
    }

    console.log('Collection renaming complete.');
  } catch (error) {
    console.error('Collection renaming failed:', error);
  }
}

renameCollections().then(() => {
  process.exit();
});
