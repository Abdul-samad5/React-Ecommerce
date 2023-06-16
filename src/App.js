import React, { useState, useEffect } from 'react';
import  { commerce } from './lib/commerce';
import { CssBaseline } from '@material-ui/core';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Products, Navbar, Cart, Checkout } from './components';

function App() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [order, setOrder] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const fetchProducts =async () => {
    const { data } = await commerce.products.list();
    
    setProducts(data);
  };

  const fetchCart = async () => {
    setCart(await commerce.cart.retrieve())
  }; 
  
  const handleAddToCart = async (productId, quantity) => {
    const item = await commerce.cart.add(productId, quantity);
    setCart(item);
  };
  
  const handleUpdateCartQty = async (lineItemId, quantity) => {
    const response = await commerce.cart.update(lineItemId, { quantity });

    setCart(response);
  };

  const handleRemoveFromCart = async (lineItemId) => {
    const response = await commerce.cart.remove();

    setCart(response);
  };

  const handleEmptyCart = async () => {
    const response = await commerce.cart.empty();

    setCart(response);
  };

  const refreshCart = async () => {
    const newCart = await commerce.cart.refreh();

    setCart(newCart);
  };

  const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
    try {
      const incomingOrder = await commerce.checkout.capture(checkoutTokenId, newOrder);

      setOrder(incomingOrder);

      refreshCart();
    } catch (error) {
      setErrorMessage(error.data.error.message);
    }
  };
  
  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  return (
    <Router>
    <div style={{ display: 'flex' }}>
      <CssBaseline />
      <Navbar totalItems={cart.total_items} handleDrawerToggle={handleDrawerToggle} />
      <Routes>
        <Route path="/" element = {<Products products={products} onAddToCart={handleAddToCart} handleUpdateCartQty />} />
        
        <Route path ="/cart" element = {<Cart cart={cart} onUpdateCartQty={handleUpdateCartQty} onRemoveFromCart= {handleRemoveFromCart} onEmptyCart={handleEmptyCart} />} />

        <Route path ="/checkout" element = {<Checkout cart={cart} order={order} onCaptureCheckout={handleCaptureCheckout} error={errorMessage} />} />
      </Routes>
    </div>
    </Router>
  );
};

export default App;
