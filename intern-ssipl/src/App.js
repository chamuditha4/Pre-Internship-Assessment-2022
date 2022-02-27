import React from 'react';
import { BrowserRouter, Routes , Route } from 'react-router-dom';
import Header from './common/header';
import Footer from './common/footer';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import Register from './pages/register';

class App extends React.Component {
  render() {
    return (
      <div>
        <Header/>
        <Footer/>
      </div>
    );
  }

}
const Main = () => (
  <BrowserRouter>
    <Routes>
      <Route exact path='/' element={<App />} />
      <Route exact path='/login' element={< Login />} />
      <Route exact path='/register' element={< Register />} />
      <Route exact path='/dashboard' element={< Dashboard />} />
      </Routes>
    </BrowserRouter>
);

export default Main;
