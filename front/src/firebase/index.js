import { firebaseApp$ } from "./init";

/////////////////////////
//
// auth.js
import {
  signInWithGoogle as _signInWithGoogle,
  signInWithFacebook as _signInWithFacebook,
  signOut as _signOut,
} from "./auth";

export const signInWithGoogle = _signInWithGoogle(firebaseApp$);
export const signInWithFacebook = _signInWithFacebook(firebaseApp$);
export const signOut = _signOut(firebaseApp$);

/////////////////////////
//
// collection.js
//export const addItemToCollection = _addItemToCollection(firebaseApp$);
//
//export { firebaseApp$ };
//import { addItemToCollection as _addItemToCollection } from "./collection";
