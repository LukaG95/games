import { Route, Routes } from 'react-router-dom';
import Chess from './chess/Chess';
import Landing from './pages/Landing';
import ErrorPage from './pages/ErrorPage';

const App = () => {
  return (
    <main>
      <Routes>
        <Route exact path="/" element={<Landing />}/> 
        <Route path="/chess/*" element={<Chess />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </main> 
  )
}

export default App                                        

