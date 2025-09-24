import React, { useState } from 'react'
import './App.css'
import { TextInput } from './TextInput'
import { DisplayText } from './DisplayText'

function App() {
  const [inptext, setInpText]=useState("")
  const [displayText, setDisplayText]=useState("")

  const afterClick=()=>{
    setDisplayText(inptext)
    setInpText("")
  }

  const afterClear=()=>{
    setInpText("")
  }

  const handleChange=(e: React.ChangeEvent<HTMLInputElement>)=>{
    setInpText(e.target.value)
  }

  return (
    <>
      <TextInput value={inptext} onChange={handleChange} onClear={afterClear}/>
      <button onClick={afterClick}>Click Me</button>
      <DisplayText TextValue={displayText}/>
    </>
  )
}

export default App