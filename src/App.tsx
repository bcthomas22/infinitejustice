import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import './App.css'

function App() {

  const [count, setCount] = useState<number | null>(null);

  useEffect(()=>{ //Get data
    const fetchCount = async () => {
      const { data, error } = await supabase
        .from('counter')
        .select('count')
        .eq('id', 1)
        .single()
      if (error) console.error('Supabase fetch error:', error)
      if (data) setCount(data.count)
    }
    fetchCount()
  }, [])

  useEffect(() => { //Realtime effects
  const channel = supabase
    .channel('counter-updates')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'counter',
        filter: 'id=eq.1'
      },
      (payload: any) => {
        setCount(payload.new.count)
      }
    )
    .subscribe()
  return () => {
    supabase.removeChannel(channel)
  }
}, [])

  const increment = async () => {

    if(count === null) return;

    const newCount = count + 1
    setCount(newCount)

    const {} = await supabase
      .from('counter')
      .update({ count: newCount })
      .eq('id', 1)
  }

  return (
    <>
      <h1>
        {count}
      </h1>

      <button
        onClick={increment}
      >
        Click Me
      </button>
    </>
  )
}

export default App
