const cors = require('cors')({origin: true});
const functions = require('firebase-functions');
const { Storage } = require('@google-cloud/storage');
const gcs = new Storage();
const os = require('os');
const path = require('path');
const spawn = require('child-process-promise').spawn;

const gcconfig = {
  projectId: "plankitclub",
  keyFilename: "serviceAccountKey.json"
};  

const { Firestore } = require('@google-cloud/firestore');
const firestore = new Firestore(gcconfig);

exports.filteredPlants = functions.https.onRequest((request, response) => {
  cors(request, response, () => {});
  if(request.method !== "POST"){
    response.status(400).send('Please send a POST request');
    return;
  }
  let filters = request.body;

  return firestore.collection("plants")
    .get()
    .then(snapshot => {
      let plants = snapshot.docs.map(plant => {
        return {id: plant.id, ...plant.data()}
      });
      filters.forEach(filter => {
        plants = plants.filter(plant => plant.tags.includes(filter));
      });
      return response.status(200).send(plants);
    }).catch(err => {
      return response.status(404).send({ error: 'Unable to retrieve the document', err });
    });
});

exports.searchPlants = functions.https.onRequest((request, response) => {

  cors(request, response, () => {});
  if(request.method !== "POST"){
    response.status(400).send('Please send a POST request');
    return;
  }

  const keywordsConverter = (keywords) => {
    let preparedString = keywords.toLowerCase();
    const before = 'áàãâäéèêëíìîïóòõôöúùûü-';
    const converted = 'aaaaaeeeeiiiiooooouuuu ';
    let finalString = '';
    for(let i=0; i < preparedString.length; i++) {
      if(before.includes(preparedString[i])){
        const index = before.indexOf(preparedString[i]);
        finalString += converted[index];
      } else {
        finalString += preparedString[i];
      }
    }
    return finalString;
  }

  const otherNames = (names, key) => {
    let contains = false;
    names.forEach(name => {
      if(keywordsConverter(name).includes(key)){
        contains = true;
      }
    });
    return contains;
  }

  let keywords = request.body.keywords;

  const finalKeywords = keywordsConverter(keywords).split(' ');
  
  return firestore.collection("plants")
    .get()
    .then(snapshot => {
      let plants = snapshot.docs.map(plant => {
        return {id: plant.id, ...plant.data()}
      });
      
      finalKeywords.forEach(key => {
        plants = plants.filter(plant => (keywordsConverter(plant.popularNamePtBr).includes(key) ||
        keywordsConverter(plant.scientificName).includes(key) || otherNames(plant.otherPopularNamesPtBr, key)));
      });
      return response.status(200).send(plants);
    }).catch(err => {
      return response.status(404).send({ error: 'Unable to retrieve the document', err });
    });
});

exports.resizeImage = functions.storage.object().onFinalize(object => {
  const bucket = object.bucket;
  const contentType = object.contentType;
  const fileName = object.name;

  if(object.resourceState === 'not_exists'){
    return;
  }

  if(path.basename(fileName).startsWith('thumb_') ||
    path.basename(fileName).startsWith('cover_') ||
    path.basename(fileName).startsWith('profile_') ||
    path.basename(fileName).startsWith('post_')){
    return;
  }

  const destBucket = gcs.bucket(bucket);
  const tmpFilePath = path.join(os.tmpdir(), path.basename(fileName));
  let thumbFilePath = '';

  if(path.dirname(fileName).includes('plants')){
    thumbFilePath = path.join(path.dirname(fileName), `thumb_${path.basename(fileName)}`);
  } else if(path.dirname(fileName).includes('covers')){
    thumbFilePath = path.join(path.dirname(fileName), `cover_${path.basename(fileName)}`);
  } else if(path.dirname(fileName).includes('profiles')){
    thumbFilePath = path.join(path.dirname(fileName), `profile_${path.basename(fileName)}`);
  } else if(path.dirname(fileName).includes('posts')){
    thumbFilePath = path.join(path.dirname(fileName), `post_${path.basename(fileName)}`);
  }
  
  const metadata = { contentType: contentType };

  return destBucket.file(fileName).download({
    destination: tmpFilePath
  }).then(() => {
    if(path.basename(fileName).endsWith('.png')){
      if(path.dirname(fileName).includes('plants')){
        return spawn('convert', [tmpFilePath, '-resize', '500x500', '-alpha', 'Remove', tmpFilePath]);
      } else if(path.dirname(fileName).includes('covers')){
        return spawn('convert', [tmpFilePath, '-resize', '1024x1024', '-alpha', 'Remove', tmpFilePath]);
      } else if(path.dirname(fileName).includes('profiles')){
        return spawn('convert', [tmpFilePath, '-resize', '450x450', '-alpha', 'Remove', tmpFilePath]);
      } else if(path.dirname(fileName).includes('posts')){
        return spawn('convert', [tmpFilePath, '-resize', '1024x546', '-alpha', 'Remove', tmpFilePath]);
      }
    }
    if(path.basename(fileName).endsWith('.jpg') || path.basename(fileName).endsWith('.jpeg')) {
      if(path.dirname(fileName).includes('plants')){
        return spawn('convert', [tmpFilePath, '-resize', '500x500', '-interlace', 'JPEG','-quality', '85','-strip', tmpFilePath]);
      } else if(path.dirname(fileName).includes('covers')){
        return spawn('convert', [tmpFilePath, '-resize', '1024x1024', '-interlace', 'JPEG', '-quality', '85', '-strip', tmpFilePath]);
      } else if(path.dirname(fileName).includes('profiles')){
        return spawn('convert', [tmpFilePath, '-resize', '450x450', '-interlace', 'JPEG','-quality', '85','-strip', tmpFilePath]);
      } else if(path.dirname(fileName).includes('posts')){
        return spawn('convert', [tmpFilePath, '-resize', '1024x546', '-interlace', 'JPEG','-quality', '85','-strip', tmpFilePath]);
      }
    }
    return;
  }).then(() => {
    destBucket.file(fileName).delete();
    return destBucket.upload(tmpFilePath, {
      destination: thumbFilePath,
      metadata: metadata
    })
  })
});


exports.newChannelRequest = functions.firestore.document('channelRequests/{channelRequest}').onCreate((snap, context) => {
  const data = snap.data();
  return firestore.collection("users").doc(data.uid).update({
    channelOwnerPermission: 'waiting'
  }).then((res) => console.log(res)).catch(err => console.log(err));
}); 
