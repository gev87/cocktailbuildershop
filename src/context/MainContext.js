import { createContext } from "react";
import React, { useEffect, useState } from "react";
import { auth } from "../firebase/setup";
import "firebase/compat/auth";
import { updateProfile } from "firebase/auth";
import { write } from "../firebase/crudoperations";

export const MainContext = createContext();

export default function Auth({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState();

  async function signup(email, password, displayName) {
    if (displayName.length > 0) setName(displayName);
    auth
      .createUserWithEmailAndPassword(email, password, displayName)
      .then((userCredential) => {
        const userId = userCredential.user.uid;
        const payload = {
          name: userCredential.user.displayName,
          orders: {},
        };
        write(`users/${userId}`, payload);
      });
  }

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  function logout() {
    return auth.signOut();
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }

  function updateEmail(email) {
    return currentUser?.updateEmail(email);
  }

  function updatePassword(password) {
    return currentUser?.updatePassword(password);
  }

  function updateName(name) {
    return updateProfile(auth.currentUser, {
      displayName: name,
    });
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && name) {
        user.multiFactor.user.displayName = name;
        updateProfile(auth.currentUser, {
          displayName: name,
        });
      }
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, [name]);
  const VALUE = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
    updateName,
  };

  return (
    <MainContext.Provider value={VALUE}>
      {!loading && children}
    </MainContext.Provider>
  );
}
