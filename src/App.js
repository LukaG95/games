import styles from "./App.module.scss";
import { useState } from "react";
import { Route, Routes } from 'react-router-dom';

import Chess from './chess/Chess';
import Landing from './pages/Landing';

const App = () => {
  return (
    <main>
      <Routes>
        <Route exact path="/" element={<Landing />}/> 
        <Route path="/chess/*" element={<Chess />} />
        <Route path="*" element={<div>404 Oops this page doesn't exist</div>} />
      </Routes>
    </main>
  )
}

export default App                                        