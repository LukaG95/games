import React from 'react'
import {Link} from 'react-router-dom'

import styles from './ErrorPage.module.scss'

const ErrorPage = () => {
  return (
    <div className={styles.errorPage}>
      <p>404 Oops this page doesn't exist</p>
      <Link to="/">Take me back</Link>
    </div>
  )
}

export default ErrorPage