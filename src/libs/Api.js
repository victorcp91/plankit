const firebase = require("firebase/app");
require("firebase/firestore");
require("firebase/storage");

class Api {

  getPlants = async () => {
    const db = firebase.firestore();
    let plants = []
    await db.collection("plants").get().then((snapshot) => {
      plants = snapshot.docs.map(plant => {
        return {id: plant.id, ...plant.data()}
      });
    })
    return plants;
  }

  getFilteredPlants = async (filter) => {
    const db = firebase.firestore();
    let plants = []

    await db.collection("plants").where('tags','array-contains',filter).get().then((snapshot) => {
      plants = snapshot.docs.map(plant => {
        return {id: plant.id, ...plant.data()}
      });
    });
    return plants;
  }

  getUserData = async (userId) => {
    const db = firebase.firestore();
    let userData = null;

    await db.collection("users").doc(userId).get().then((doc) => {
      if(doc.exists){
        userData = {uid: userId, ...doc.data()} 
      }
    });
    return userData;
  }

  createUser = async (user) => {
    const db = firebase.firestore();
    await db.collection("users").doc(user.uid).set({
      uid: user.uid,
      display_name: user.displayName,
      email: user.email,
      avatar: user.photoURL,
      first_login: user.metadata.creationTime,
      gardem: []
    });
  }

  addGardemPlant = async (user, plant) => {
    const newPlant = {
      id: plant.id,
      image: plant.image,
      popular_name_pt_br: plant.popular_name_pt_br
    }
    const db = firebase.firestore();
    await db.collection("users").doc(user.uid).update({
      gardem: firebase.firestore.FieldValue.arrayUnion(newPlant)
    });
  }

  removeGardemPlant = async (user, plant) => {
    let plants = user.gardem;
    plants = plants.filter(p => p.id !== plant.id);
    const db = firebase.firestore();
    await db.collection("users").doc(user.uid).update({
      gardem: plants
    });
  }

  createNewPlant = async (image, plant) => {
    const storage = firebase.storage().ref();
    let fileName = plant.popularNamePtBr.replace(" ", "_");
    if(image.type.toLowerCase().includes('png')){
      fileName = fileName + '.png';
    } else if(image.type.toLowerCase().includes('jpg')){
      fileName = fileName + '.jpg';
    } else if(image.type.toLowerCase().includes('jpeg')){
      fileName = fileName + '.jpeg';
    }
    storage.child(`plants/${fileName}`).put(image).then(snap => {
      snap.ref.getDownloadURL().then(downloadURL => {
        const newDownloadURL = downloadURL.split('&token=')[0];
        console.log("File available at", newDownloadURL);
      });
    })
  }
}

export default new Api();

