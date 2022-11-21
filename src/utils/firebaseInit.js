import { initializeApp } from "firebase/app";
const config = {
    apiKey: "AIzaSyAfG0-KTgqhaqhRpia7Nwk2TbN3rjW9iSI",
    databaseURL: `https://mytodolist-7790d-default-rtdb.europe-west1.firebasedatabase.app`,
    storageBucket: `gs://mytodolist-7790d.appspot.com`,
    projectId: "mytodolist-7790d",
};
const app = initializeApp(config);

export default app;
