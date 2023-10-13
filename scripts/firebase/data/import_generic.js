const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const serviceAccount = require('../../../private/astro-serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const firestore = admin.firestore();

// Helper function to generate a unique hash for an object
function generateHash(obj) {
  const hash = crypto.createHash('sha1');
  hash.update(JSON.stringify(obj));
  return hash.digest('hex');
}

// Import documents from JSON files into Firestore
async function importDocumentsFromFiles() {
  try {
    const jsonFilesPath = '../../../private/data';

    const fileNames = fs.readdirSync(jsonFilesPath);

    for (const fileName of fileNames) {
      if (fileName.endsWith('.json')) {
        const filePath = path.join(jsonFilesPath, fileName);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const documents = JSON.parse(fileContent);

        const collectionName = path.basename(fileName, '.json');
        const collectionRef = firestore.collection(collectionName);

        for (const document of documents) {
          const docHash = generateHash(document);
          const existingDoc = await collectionRef.where('hash', '==', docHash).get();

          if (existingDoc.empty) {
            const docRef = collectionRef.doc();
            await docRef.set({ ...document, hash: docHash });
            console.log('Document imported:', document);
          } else {
            console.log('Skipping duplicate document:', document);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error importing documents:', error);
  }
}

importDocumentsFromFiles()
  .then(() => {
    console.log('Import complete.');
    process.exit();
  })
  .catch((error) => {
    console.error('Import failed:', error);
    process.exit(1);
  });
