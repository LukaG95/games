import styles from "./App.module.scss";
import { useState } from "react";
import { Route, Routes } from 'react-router-dom';

import Chess from './Chess/Chess'

const App = () => {
  return (
    <Routes>
      <Route exact path="/" element={<div>landing page</div>}/>
      <Route path="/chess" element={<Chess />} />
      <Route path="*" element={<div>404 Oops this page doesn't exist</div>} />
    </Routes>
  )
}

export default App                                        