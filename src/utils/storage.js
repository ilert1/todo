import { getStorage } from "firebase/storage";
import app from "./firebaseInit.js";
const storage = getStorage(app);

export default storage;
