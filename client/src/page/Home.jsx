import React from 'react'
import Header from '../comp/Header';
import Steps from '../comp/Steps';
import Description from '../comp/Description';
import Testimonials from '../comp/Testimonials';
import Generate from '../comp/Generate';

const Home = () => {
  return (
    <div>
      <Header/>
      <Steps/>
      <Description/>
      <Testimonials/>
      <Generate/>
    </div>
  )
}

export default Home;