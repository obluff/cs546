const todo = require("./todo");
const connection = require ("./mongoConnection");

const main = async () => {
  const firstTask = {
    title: "Ponder Dinosaurs",
    description: "Has Anyone Really Been Far Even as Decided to Use Even Go Want to do Look More Like?"
  }
  const firstInsert = await todo.createTask(firstTask.title, firstTask.description);
  console.log(firstInsert);

  const secondTask = {
    title: "Play Pokemon with Twitch TV",
    description: "Should we revive Helix?"
  }

  const secondInsert = await todo.createTask(secondTask.title, secondTask.description);

  console.log('\n showing all tasks');

  const allTasks = await todo.getAllTasks();
  console.log(allTasks);
  console.log(secondInsert._id);
  const removeOneTask = await todo.removeTask(firstInsert['_id']);

  const allTasksSecond = await todo.getAllTasks();
  console.log(allTasksSecond);

  const completeLastTask = await todo.completeTask(secondInsert['_id']);

  console.log(completeLastTask);

};

main().catch(error =>{
  console.log(error);
})
