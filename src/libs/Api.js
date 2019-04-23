const firebase = require("firebase/app");
require("firebase/firestore");

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
}

export default new Api();

