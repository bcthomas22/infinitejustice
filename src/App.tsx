import './App.css'
import { Counter } from "./Counter.tsx";
import { useState, useEffect } from 'react';
import { Header } from "./Header.tsx";
import { supabase } from "./supabaseClient";
import { Login } from "./Login.tsx";

function App() {

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(( {data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  })

  if (!user) return <Login />;

  return (
    <>
      <Header />
      <Counter />
    </>
  )

}

export default App
