import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import './App.css'

function App() {

  const [count, setCount] = useState(0);

  useEffect(()=>{
    const fetchCount = async () => {
      const { data } = await supabase
        .from('counter')
        .select('count')
        .eq('id', 1)
        .single()
      if (data) setCount(data.count)
    }
    fetchCount()
  }, [])

  const increment = async () => {
    const newCount = count + 1
    setCount(newCount)

    // Update the counter in the database
    const {} = await supabase
      .from('counter')
      .update({ count: newCount })
      .eq('id', 1)
  }

  return (
    <>
      <h1>
        Infinite Justice
      </h1>

      <button
        onClick={increment}
      >
        Global Counter: {count}
      </button>


    </>
  )
}

export default App
