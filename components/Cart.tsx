import React from 'react';
import { useCart } from '../context/CartContext';
import { XMarkIcon, PlusIcon, MinusIcon } from './Icons';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { cartItems, updateQuantity, totalPrice, totalItems } = useCart();

  return (
    <>
      <div 
        className={`cart-overlay ${isOpen ? 'cart-open' : ''}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />
      <div className={`cart-sidebar ${isOpen ? 'cart-open' : ''}`} role="dialog" aria-modal="true" aria-label="Shopping Cart">
        <div className="cart-header">
          <h2>Your Cart ({totalItems})</h2>
          <button onClick={onClose} aria-label="Close cart">
            <XMarkIcon />
          </button>
        </div>
        
        <div className="cart-content">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <img src="https://picsum.photos/200/200?grayscale" alt="Empty cart"/>
              <h3>Your cart is empty</h3>
              <p>Looks like you haven't added anything to your cart yet.</p>
            </div>
          ) : (
            <div className="cart-items">
              {cartItems.map(item => (
                <div key={item.idMeal} className="cart-item">
                  <img src={item.strMealThumb} alt={item.strMeal} className="cart-item-image"/>
                  <div className="cart-item-details">
                    <h4>{item.strMeal}</h4>
                    <p>${item.price.toFixed(2)}</p>
                  </div>
                  <div className="quantity-control">
                    <button onClick={() => updateQuantity(item.idMeal, item.quantity - 1)} disabled={item.quantity <= 1} aria-label={`Decrease quantity of ${item.strMeal}`}>
                      <MinusIcon />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.idMeal, item.quantity + 1)} aria-label={`Increase quantity of ${item.strMeal}`}>
                      <PlusIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="subtotal">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <button className="checkout-button">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;