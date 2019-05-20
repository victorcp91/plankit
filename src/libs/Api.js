import axios from 'axios';
import { comparableString } from './Utils';
const firebase = require("firebase/app");
require("firebase/firestore");
require("firebase/storage");

axios.defaults.baseURL = 'https://us-central1-plankit-app.cloudfunctions.net';
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

  getFilteredPlants = async (filters) => {
    let data = filters;
    axios.post('/filteredPlants', data, { headers: { 'Content-Type': 'application/json' } })
      .then(res => {
        return res;
    }).catch(err => {
        return [];
    });
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
    let fileName = comparableString(plant.popularNamePtBr);
    fileName = fileName.replace(/ /g, "_");

    if(image.type.toLowerCase().includes('png')){
      fileName = fileName + '.png';
    } else if(image.type.toLowerCase().includes('jpg')){
      fileName = fileName + '.jpg';
    } else if(image.type.toLowerCase().includes('jpeg')){
      fileName = fileName + '.jpeg';
    }
    storage.child(`plants/${fileName}`).put(image).then(snap => {
      snap.ref.getDownloadURL().then(downloadURL => {
        let newDownloadURL = downloadURL.split('&token=')[0];
        const splitedDownloadUrl = newDownloadURL.split(fileName);
        newDownloadURL = splitedDownloadUrl[0] + 'thumb_' + fileName + splitedDownloadUrl[1];

        const db = firebase.firestore();

        db.collection("plants").doc().set({
          ...plant,
          image: newDownloadURL
        }).then(() => {
          return 'success';
        }).catch(err => console.log(err));
      });
    });
  }

  requestChannel = async (reqInfo) => {
    const db = firebase.firestore();

    db.collection("channelRequests").doc().set({
      ...reqInfo
    }).then(() => {
      return 'success';
    }).catch(err => console.log(err));
  }

  createChannel = async (channel) => {
    const storage = firebase.storage().ref();
    
    let coverFileName = comparableString(channel.name);
    coverFileName = coverFileName.replace(/ /g, "_");

    if(channel.coverImage.type.toLowerCase().includes('png')){
      coverFileName = coverFileName + '.png';
    } else if(channel.coverImage.type.toLowerCase().includes('jpg')){
      coverFileName = coverFileName + '.jpg';
    } else if(channel.coverImage.type.toLowerCase().includes('jpeg')){
      coverFileName = coverFileName + '.jpeg';
    }

    let profileFileName = comparableString(channel.name);
    profileFileName = profileFileName.replace(/ /g, "_");

    if(channel.profileImage.type.toLowerCase().includes('png')){
      profileFileName = profileFileName + '.png';
    } else if(channel.profileImage.type.toLowerCase().includes('jpg')){
      profileFileName = profileFileName + '.jpg';
    } else if(channel.profileImage.type.toLowerCase().includes('jpeg')){
      profileFileName = profileFileName + '.jpeg';
    }

    let coverDownloadURL = '';
    
    await storage.child(`channels/covers/${coverFileName}`).put(channel.coverImage).then(async snap => {
      await snap.ref.getDownloadURL().then(downloadURL => {
        coverDownloadURL = downloadURL.split('&token=')[0];
        const splitedDownloadUrl = coverDownloadURL.split(coverFileName);
        coverDownloadURL = splitedDownloadUrl[0] + 'cover_' + coverFileName + splitedDownloadUrl[1];
      });
    });

    let profileDownloadURL = ''
    await storage.child(`channels/profiles/${profileFileName}`).put(channel.profileImage).then(async snap => {
      await snap.ref.getDownloadURL().then(downloadURL => {
        profileDownloadURL = downloadURL.split('&token=')[0];
        const splitedDownloadUrl = profileDownloadURL.split(profileFileName);
        profileDownloadURL = splitedDownloadUrl[0] + 'profile_' + profileFileName + splitedDownloadUrl[1];
      });
    });

    const db = firebase.firestore();

    const newChannel = {
      ...channel,
      coverImage: coverDownloadURL,
      profileImage: profileDownloadURL
    };

    db.collection("channels").doc().set(newChannel).then(() => {
      return 'success';
    }).catch(err => console.log(err));
  }

  updateChannel = async (channeId, channel) => {

    let coverDownloadURL = '';
    let profileDownloadURL = '';
    let storage = null;
    if(channel.coverImage || channeId.profileImage){
      storage = firebase.storage().ref();
    }
    
    if(channel.coverImage){

      let coverFileName = comparableString(channel.name);
      coverFileName = coverFileName.replace(/ /g, "_");

      if(channel.coverImage.type.toLowerCase().includes('png')){
        coverFileName = coverFileName + '.png';
      } else if(channel.coverImage.type.toLowerCase().includes('jpg')){
        coverFileName = coverFileName + '.jpg';
      } else if(channel.coverImage.type.toLowerCase().includes('jpeg')){
        coverFileName = coverFileName + '.jpeg';
      }
      await storage.child(`channels/covers/${coverFileName}`).put(channel.coverImage).then(async snap => {
        await snap.ref.getDownloadURL().then(downloadURL => {
          coverDownloadURL = downloadURL.split('&token=')[0];
          const splitedDownloadUrl = coverDownloadURL.split(coverFileName);
          coverDownloadURL = splitedDownloadUrl[0] + 'cover_' + coverFileName + splitedDownloadUrl[1];
        });
      });
    }

    if(channel.profileImage){
      let profileFileName = comparableString(channel.name);
      profileFileName = profileFileName.replace(/ /g, "_");

      if(channel.profileImage.type.toLowerCase().includes('png')){
        profileFileName = profileFileName + '.png';
      } else if(channel.profileImage.type.toLowerCase().includes('jpg')){
        profileFileName = profileFileName + '.jpg';
      } else if(channel.profileImage.type.toLowerCase().includes('jpeg')){
        profileFileName = profileFileName + '.jpeg';
      }

      await storage.child(`channels/profiles/${profileFileName}`).put(channel.profileImage).then(async snap => {
        await snap.ref.getDownloadURL().then(downloadURL => {
          profileDownloadURL = downloadURL.split('&token=')[0];
          const splitedDownloadUrl = profileDownloadURL.split(profileFileName);
          profileDownloadURL = splitedDownloadUrl[0] + 'profile_' + profileFileName + splitedDownloadUrl[1];
        });
      });
    }

    const db = firebase.firestore();

    let newChannel = {
      ...channel
    };

    if(channel.coverImage){
      newChannel = {
        ...newChannel,
        coverImage: coverDownloadURL,
      }
    }
    if(channel.profileImage){
      newChannel = {
        ...newChannel,
        profileImage: profileDownloadURL
      }
    }

    db.collection("channels").doc(channeId).update(newChannel).then(() => {
      return 'success';
    }).catch(err => console.log(err));
  }

  getMyChannels = async (uid) => {
    const db = firebase.firestore();
    let channels = [];
    await db.collection("channels").where('owner', '==', uid).get().then(snapshot => {
      channels = snapshot.docs.map(doc => {
        return {id: doc.id, ...doc.data()};
      });
    }).catch(err => console.log(err));
    return channels;
  }

}

export default new Api();

