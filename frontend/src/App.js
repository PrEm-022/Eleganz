import './App.css';
import Navbar from './Components/Navbar/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Shop from './Pages/Shop';
import ShopCategory from './Pages/ShopCategory';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import LoginSignup from './Pages/LoginSignup';
import Checkout from './Pages/Checkout';
import MyOrders from './Pages/MyOrders';
import Footer from './Components/Footer/Footer';
import men_banner from './Components/Assets/men_banner.png';
import women_banner from './Components/Assets/women_banner.png';
import kid_banner from './Components/Assets/kid_banner.png';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path='/' element={<Shop/>}/>
          <Route path='/mens' element={<ShopCategory banner={men_banner} category='Men'/>}/>
          <Route path='/womens' element={<ShopCategory banner={women_banner} category='Women'/>}/>
          <Route path='/kids' element={<ShopCategory banner={kid_banner} category='Kid'/>}/>
          <Route path="/product" element={<Product/>}>
            <Route path=':productId' element={<Product/>}/>
          </Route>
          <Route path="/cart" element={<Cart/>}/>
          <Route path="/checkout" element={<Checkout/>}/>
          <Route path="/myorders" element={<MyOrders/>}/>
          <Route path="/login" element={<LoginSignup/>}/>
        </Routes>
        <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;
