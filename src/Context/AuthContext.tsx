import auth, { db } from "@/firebase/firebase";
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";

type Modal = {
  user: User | null;
  googleSignIn: () => void;
  logOut: () => void;
  handleSignUp: (name: Form, email: Form, pass: Form) => void;
  handleSignIn: (email: Form, pass: Form) => void;
};

type Form = any;

export const AuthContext = createContext<Modal>({
  user: null,
  googleSignIn: () => {},
  logOut: () => {},
  handleSignUp: () => {},
  handleSignIn: () => {},
});

const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const handleSignUp = (name: Form, email: Form, pass: Form) => {
    createUserWithEmailAndPassword(auth, email, pass)
      .then(async credentials => {
        const ref = doc(db, "simongame", credentials.user.uid);
        await setDoc(ref, {
          Name: name,
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleSignIn = (email: Form, pass: Form) => {
    signInWithEmailAndPassword(auth, email, pass)
      .then(async credentials => {
        const ref = doc(db, "simon", credentials.user.uid);
        const docSnap = await getDoc(ref);

        if (docSnap.exists()) {
          sessionStorage.setItem(
            "user-info",
            JSON.stringify({
              Name: docSnap.data().name,
            })
          );
          sessionStorage.setItem("user-id", JSON.stringify(credentials.user));
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const logOut = () => {
    signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [user]);

  const global = {
    user,
    googleSignIn,
    logOut,
    handleSignUp,
    handleSignIn,
  };

  return <AuthContext.Provider value={global}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
