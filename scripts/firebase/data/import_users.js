const admin = require('firebase-admin');
const serviceAccount = require('../../../private/astro-serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const firestore = admin.firestore();

// Create a user document in the users collection
const createUser = async (userId, star, birthDate, birthTime, longitude, longitudeDirection, createdBy) => {
  const userRef = firestore.collection('users').doc(userId);

  try {
    await userRef.set({
      userId: userId,
      birthStar: birthStar,
      birthDate: birthDate,
      birthTime: birthTime,
      longitude: longitude,
      longitudeDirection: longitudeDirection,
      createdDate: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: createdBy,
      modifiedDate: admin.firestore.FieldValue.serverTimestamp(),
      modifiedBy: createdBy
    });

    console.log('User document created successfully.');
  } catch (error) {
    console.error('Error creating user document:', error);
  }
};

// Usage example
createUser('johndoe123', 'Alpha Centauri', '06/12/1990', '1200', 40.7128, 'N', 'admin');
