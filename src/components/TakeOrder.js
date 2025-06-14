import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./TakeOrder.css";
import Footer from './Footer';
import Header from './Header';
import PaymentModal from './Payment'; // Import the PaymentModal component

const TakeOrder = () => {
  // State variables
  const location = useLocation();
  const role = location.state?.role;
  const staffId = location.state?.staffId;
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [appliedTax, setAppliedTax] = useState(0.16);
  const [discount, setDiscount] = useState(5);
  const [OrderNumber, setOrderNumber] = useState(0);
  const [OrderDate, setOrderDate] = useState(new Date().toLocaleDateString()); // Set current date as default
  const [customerNumber, setCustomerNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isCustomerNumberValid, setIsCustomerNumberValid] = useState(true); // State to track customer number validity

  // Modal state for displaying PaymentModal component
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Tax rates
  const cardTax = 0.04;
  const cashTax = 0.16;

  // Mock menu items (replacing API calls)
  const menuItems = [
    { itemId: 1, name: "Burger", category: "FastFood", price: 5.99, itemPath: "/images/burger.png" },
    { itemId: 2, name: "Pizza", category: "FastFood", price: 8.99, itemPath: "/images/pizza.png" },
    { itemId: 3, name: "Ice Cream", category: "Desert", price: 3.99, itemPath: "/images/icecream.png" },
    { itemId: 4, name: "Soda", category: "Drinks", price: 1.99, itemPath: "/images/soda.png" },
  ];
  
  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.itemId === item.itemId); // Use itemId to match items
      
      if (existingItem) {
        // If item already in the cart, increase the count
        return prevCart.map((cartItem) =>
          cartItem.itemId === item.itemId
            ? { ...cartItem, count: cartItem.count + 1 }  // Increase count if item is already in cart
            : cartItem
        );
      }
  
      // If item is not in the cart, add a new item with count set to 1
      return [...prevCart, { ...item, count: 1 }];
    });
  };

  const removeFromCart = (index) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item, idx) =>
        idx === index ? { ...item, count: item.count - 1 } : item
      );
      return updatedCart.filter((item) => item.count > 0);
    });
  };

  const calculateTotal = () =>
    cart.reduce((total, item) => total + item.price * item.count, 0);

  const calculateDiscount = () => {
    const total = calculateTotal();
    return total * (discount / 100); // Apply selected discount percentage
  };

  const calculateTax = () => {
    const total = calculateTotal() - calculateDiscount(); // Tax is applied after discount
    return total * appliedTax;
  };

  const calculateFinalTotal = () => {
    const totalAmount = calculateTotal();
    const taxAmount = calculateTax(totalAmount, appliedTax);
    const discountAmount = calculateDiscount();
    return totalAmount + taxAmount - discountAmount;
  };

  // Validate customer number
  const validateCustomerNumber = () => {
    if (!customerNumber.trim() || isNaN(customerNumber) || Number(customerNumber) <= 0) {
      setIsCustomerNumberValid(false);
      return false;
    }
    setIsCustomerNumberValid(true);
    return true;
  };

  const handleCustomerNumberChange = (e) => {
    setCustomerNumber(e.target.value);
    validateCustomerNumber(); // Validate whenever the user types
  };

  useEffect(() => {
    // Update tax rate when payment method changes
    if (paymentMethod === "Credit Card" || paymentMethod === "Mobile Payment") {
      setAppliedTax(cardTax);
    } else if (paymentMethod === "Cash") {
      setAppliedTax(cashTax);
    }
  }, [paymentMethod]);

  return (
    <div>
      <Header role={role} />

      <main className="takeOrdermain">
        <div className="menu-section">
          <h2>Take Order</h2>
          <div className="categories">
            <button onClick={() => setSelectedCategory("FastFood")}>Fast Food</button>
            <button onClick={() => setSelectedCategory("Desert")}>Desert</button>
            <button onClick={() => setSelectedCategory("Drinks")}>Drinks</button>
            <button onClick={() => setSelectedCategory("all")}>Show All</button>
          </div>

          <div className="menu-items">
            {menuItems
              .filter(
                (item) =>
                  selectedCategory === "all" || item.category === selectedCategory
              )
              .map((item, index) => (
                <div
                  className={`menu-item ${item.category}`}
                  key={index}
                  onClick={() => addToCart(item)}
                >
                  <div className="image-container">
                    <img src={item.itemPath} alt={item.name} />
                    <div className="price-overlay">
                      <p>{item.name}</p>
                      <p>${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="middle-section">
          <div className="info-section">
            <form>
              <label htmlFor="customerNumber">Customer Number</label>
              <input
                type="text"
                id="customerNumber"
                name="customerNumber"
                value={customerNumber}
                onChange={handleCustomerNumberChange} 
              />
              <label htmlFor="OrderNumber">Order No.</label>
              <input
                type="number"
                id="OrderNumber"
                name="OrderNumber"
                value={OrderNumber}
                disabled
                onChange={(e) => setOrderNumber(e.target.value)}
              />
              {!isCustomerNumberValid && (
                <p className="error-message">Customer Number must be a valid positive integer!</p>
              )}
              <label htmlFor="OrderDate">Order Date</label>
              <input
                type="text"
                id="OrderDate"
                name="OrderDate"
                value={OrderDate} // Set to today's date by default
                readOnly
              />
            </form>
          </div>
        </div>

        <div className="sections">
          <div className="order-section">
            <h2>Your Order</h2>
            <div id="cart-items" className="scrollable-cart">
              {cart.length === 0 ? (
                <p>Your cart is empty.</p>
              ) : (
                cart.map((item, index) => (
                  <div className="cart-item" key={index}>
                    <p>
                      {item.name} x {item.count} - $
                      {Number(item.price * item.count).toFixed(2)}
                    </p>
                    <button onClick={() => removeFromCart(index)}>Remove</button>
                  </div>
                ))
              )}
            </div>

            <table>
              <tr>
                <td className="label">Sub Total:</td>
                <td className="value">
                  <h3>${Number(calculateTotal()).toFixed(2)}</h3>
                </td>
              </tr>
              <tr>
                <td className="label">Discount ({discount}%):</td>
                <td className="value">
                  <h3>${Number(calculateDiscount()).toFixed(2)}</h3>
                </td>
              </tr>
              <tr>
                <td className="label">Tax ({(appliedTax * 100).toFixed(0)}%):</td>
                <td className="value">
                  <h3>${Number(calculateTax()).toFixed(2)}</h3>
                </td>
              </tr>
            </table>
            <div className="total">
              <h3>Total Amount: ${Number(calculateFinalTotal()).toFixed(2)}</h3>
            </div>

            {Array.isArray(cart) && cart.length > 0 ? (
                <button
                  className="checkout-button"
                  onClick={() => setShowPaymentModal(true)}
                >
                  Proceed to Payment
                </button>
              ) : (
                <button>
                  Cart is Empty
                </button>
            )}
          </div>
        </div>
      </main>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        cart={cart}
        totalAmount={calculateFinalTotal()}
        customerNumber={customerNumber}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        appliedTax={appliedTax}
        setAppliedTax={setAppliedTax}
      />

      <Footer />
    </div>
  );
};

export default TakeOrder;
