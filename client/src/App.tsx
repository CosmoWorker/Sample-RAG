import { Route, Routes } from 'react-router-dom'
import { Auth } from './pages/Auth'
import { ToastProvider } from './providers/ToastProvider'
import { AuthProvider } from './providers/AuthProvider'

function App() {

  return (
    <>
    <ToastProvider>
      <AuthProvider>
        <Routes>
          <Route path='/auth' element={<Auth/>}/>
          <Route path='/' element></Route>
        </Routes>
      </AuthProvider>
    </ToastProvider>
    </>
  )
}

export default App