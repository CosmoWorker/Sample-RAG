import React, { useEffect, useRef, useState } from 'react'
import { AuthForm } from './components/AuthForm'

export type todoObject={
  "id": number,
  "task": string,
  "done": boolean
}
function App() {
  const [formType, setFormType]=useState<"signup"|"login">("signup")
  const [task, setTask]=useState("")
  const [todoArray, setTodoArray]=useState<todoObject[]>([])
  const inputRef=useRef<HTMLInputElement | null>(null)
  const [num, setNum]=useState<number>(1)

  const handleAdd=()=>{
    if (task){
      setTodoArray(prev=>[...prev, {"id": num, "task": task, "done": false}])
      setNum(num=>num+1)
    }
    setTask("")
  }

  const handleDone=(e: number)=>{ // here condition doesnt check if t.done is true because entire (Basically I am undoing all)
    setTodoArray(prev=>prev.map((t)=>(t.id===e)?{...t, "done":!t.done}: t))
  }

  const handleClearTasks=()=>{
    setTodoArray([])
  }

  const handleInputEnter=(e: React.KeyboardEvent<HTMLInputElement>)=>{
    if (e.key==="Enter"){
      handleAdd()
    }
  }

  const handleDelete=(e: number)=>{
    setTodoArray(prev=> prev.filter((t)=>t.id!==Number(e)))
  }

  useEffect(()=>{
    inputRef.current?.focus()
  }, [todoArray])

  return (
    <>
      {/* <div className='flex flex-col items-center justify-center border-1 p-3 rounded-2xl max-w-[500px]'>
        <h1 className='font-extrabold text-2xl text-fuchsia-700'>TODO LIST</h1>
        <div className='flex flex-row items-center gap-4 justify-center'>
          <input type="text" placeholder='Enter how the task' value={task} onChange={(e)=>setTask(e.target.value)} onKeyDown={handleInputEnter} className='border-1 p-2 m-2 w-full rounded-sm'/>
          <button className='border-1 p-2 rounded-lg bg-green-700 cursor-pointer' onClick={handleAdd} >Add</button>
          <button className='border-1 p-2 rounded-lg bg-amber-700 cursor-pointer whitespace-nowrap' onClick={handleClearTasks}>Clear All</button>
        </div>
        <TodoItem todos={todoArray} onClick={handleDelete} onDone={handleDone}/>
      </div>   */}
      <AuthForm form={formType} onFormChange={()=>setFormType((prev)=>(prev==="signup"?"login":"signup"))}/>
    </>
  )
}

export default App