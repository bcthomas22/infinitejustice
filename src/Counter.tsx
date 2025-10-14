import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

export function Counter() {
    const [count, setCount] = useState<number | null>(null);
    const [isPosting, setIsPosting] = useState<boolean>(false);

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

  const getUserCount = async (userId: string) => {
    const { data } = await supabase
      .from('user_count')
      .select('count')
      .eq('user_id', userId)
      .single();
    
    return data ? data.count : 0;
  }

  const increment = async () => {

    const { data: { user } } = await supabase.auth.getUser();

    if(count === null || user === null) return;

    setIsPosting(true);

    const newCount = count + 1
    setCount(newCount)

    const {} = await supabase
      .from('counter')
      .update({ count: newCount })
      .eq('id', 1)

    const {} = await supabase
      .from('user_count')
      .upsert({
          user_id: user.id,
          username: user.user_metadata.username,
          count: (await getUserCount(user.id)) + 1
      })

    setTimeout(() => setIsPosting(false), 100);
  }

  return (
    <div className='counter'>
      <h2>
        Shmack Counter
      </h2>
      
      <h1>
        {count}
      </h1>

      <button
        onClick={increment}
        disabled={isPosting}
      >
        SHMACK
      </button>
    </div>
  )
}