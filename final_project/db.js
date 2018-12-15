const mongoCollections = require("./mongoCollections");
const usrs = mongoCollections.users;
const pets = mongoCollections.pets;
const uuidv1 = require('uuid/v1');
const db = require('./db');

var expt = module.exports;

//gets a user
expt.getUser = async function(userName){
  if(typeof userName !== 'string') throw 'you need to provide a username';
  const users = await usrs();
  const user = await users.findOne({ username: userName});
  if(user === null) {
    throw "user don't exist";
  }

  return user;
}
//checks if user exists
expt.userExists = async function(userName){
  if(typeof userName !== 'string') throw 'you need to provide a username';
  const users = await usrs();
  const user = await users.findOne({username: userName});
  if(user === null) return false;
  return true;

}

//creates a user
expt.createUser = async function(obj){
  if(!obj) throw "no object provied";
  obj.homies = [];
  const users = await usrs();
  if(await expt.userExists(obj.username)) throw "user already exists";
  const insertInfo = await users.insertOne(obj);
  if(insertInfo.insertedCount === 0) throw "could not add user";
  return expt.getUser(obj.username);

}

//changes values about the user
expt.patchUser = async function(userName, obj){
  if(!userName) throw 'please provide recipeId';
  if(!obj) throw 'need to provide an object';

  console.log(obj);
  const users = await usrs();
  const update = await users.updateOne({username: userName}, { $set: obj });
  if(update.error) throw update.error;
  if (update.matchedCount === 0) throw 'no user matched';
  return expt.getUser(userName);
}

//changes values about the pet
expt.patchPet = async function(name, obj){
  if(!name) throw 'please provide petName';
  if(!obj) throw 'need to provide an object';

  console.log(obj);
  const petBook = await pets();
  const update = await petBook.updateOne({petName: name}, { $set: obj });
  if(update.error) throw update.error;
  if (update.matchedCount === 0) throw 'no pet matched';
  return expt.getPet(name);
}



//returns pet
expt.getPet = async function(name){
  if (typeof name !== 'string') throw "you need to provide an petname";
  const petBook = await pets();
  const pet = await petBook.findOne({petName: name});

  if(pet === null) throw "no pet with that id";

  return pet;
}

//checks if pet with passed in name exists
expt.petExists = async function(name){
  if(typeof name !== 'string') throw 'you need to provide a PET EXISTS';
  const petBook = await pets();
  const pet = await petBook.findOne({petName: name});
  if(pet === null) return false;
  return true;

}

//creates a pet
expt.createPet = async function(obj, petOwner){
  if(!obj) throw "no object provided";
  console.log(obj);
  const petBook = await pets();
  obj.petName = obj.petName.replace(/[^A-Z0-9]/ig, "_");
  if(await expt.petExists(obj.petName)) throw "pet name already exists";

  obj.status = {"happiness": 5.0, "hunger": 5.0};
  obj.owner = petOwner;
  var owner = await expt.getUser(petOwner);


  const insertInfo = await petBook.insertOne(obj);
  if(insertInfo.insertedCount === 0) throw "could not add pet";

  var update= {}
  if(owner.hasOwnProperty('homies')){
    var homies = owner.homies;
    homies.push(obj.petName);
    update.homies = homies
  }

  await expt.patchUser(petOwner, update);
  return await expt.getPet(obj.petName);

}


//replaces pets
expt.replacePet = async function(petName, obj){
  if(!petName) throw 'please provide petname';
  if(!obj) throw 'need to provide an object';

  await expt.removePet(petName);
  return await expt.createPet(obj);
}

//lowers pet hunger/happiness values
expt.satisfyPet = async function(petName, param){
  var pet = await expt.getPet(petName);
  console.log(param);
  var status = pet.status;
  var value = status[param] + Math.random();
  if(value > 10) value = 10.0;
  status[param] = value;
  console.log(status);
  await expt.patchPet(petName, {status});
  console.log(await expt.getPet(petName));
}

//deletes pets
expt.removePet = async function(petName){
  if(!recipeId) throw 'please provide recipeId';


  const petBook = await pets();
  const deleted = await petBook.removeOne({ name: petName });
  if(deleted.error) throw 'error deleting'
  if(deleted.deletedCount == 0) throw 'couldnt delete';
  return true;
}

//gets every pet
expt.getAllPets = async function(){
  const petBook = await pets();
  return await petBook.find({}).toArray();
}
//decreases stats every hour for a pet
expt.decreaseStats = async function(){
  allPets = await expt.getAllPets();
  for(i = 0; i < allPets.length; i++){
    var currentPet = allPets[i];
    console.log(currentPet);
    console.log('updating ' + currentPet.petName)
    const random1 = Math.random();
    const random2 = Math.random();
    const NewStatus = {'happiness': currentPet.status.happiness - random1, 'hunger': currentPet.status.hunger - random2}
    if(NewStatus.happiness < 0) NewStatus.happiness = 0;
    if(NewStatus.hunger < 0) NewStatus.hunger = 0;
    var updateJson = {'status': NewStatus};
    await expt.patchPet(currentPet.petName, updateJson);
  }
  return 0;
  }
