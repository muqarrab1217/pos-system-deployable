import React, { useState } from 'react';
import './Inventory.css';  // Importing the CSS for styling
import Header from './Header';

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([
    {
      itemId: 1,
      itemName: 'Burger',
      unitPrice: 5.99,
      stockLocation: 'Warehouse A',
      quantity: 20,
      description: 'A delicious beef burger with cheese.',
      category: 'FastFood',
      imagePath: '/images/burger.jpg'
    },
    {
      itemId: 2,
      itemName: 'Pizza',
      unitPrice: 8.99,
      stockLocation: 'Warehouse B',
      quantity: 15,
      description: 'A classic cheese pizza with tomato sauce.',
      category: 'FastFood',
      imagePath: '/images/pizza.jpg'
    },
    {
      itemId: 3,
      itemName: 'Ice Cream',
      unitPrice: 2.99,
      stockLocation: 'Warehouse C',
      quantity: 30,
      description: 'Vanilla and chocolate ice cream mix.',
      category: 'Dessert',
      imagePath: '/images/icecream.jpg'
    },
    {
      itemId: 4,
      itemName: 'Orange Juice',
      unitPrice: 3.49,
      stockLocation: 'Warehouse A',
      quantity: 50,
      description: 'Freshly squeezed orange juice.',
      category: 'Drinks',
      imagePath: '/images/orange_juice.jpg'
    }
  ]);

  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [editItemIndex, setEditItemIndex] = useState(null);
  const [newItem, setNewItem] = useState({
    itemName: '',
    unitPrice: '',
    stockLocation: '',
    quantity: '',
    description: '',
    category: '',
    imagePath: ''
  });

  const [editItem, setEditItem] = useState({
    itemId: '',
    itemName: '',
    unitPrice: '',
    stockLocation: '',
    quantity: '',
    description: '',
    category: '',
    imagePath: ''
  });

  // Handle adding a new item
  const handleAddItem = () => {
    if (!newItem.imagePath) {
      alert("Please provide an image.");
      return;
    }

    const newItemData = {
      itemId: inventory.length + 1, // Simulate a unique ID
      itemName: newItem.itemName,
      unitPrice: parseFloat(newItem.unitPrice),
      stockLocation: newItem.stockLocation,
      quantity: parseInt(newItem.quantity, 10),
      description: newItem.description,
      category: newItem.category,
      imagePath: newItem.imagePath
    };

    setInventory([...inventory, newItemData]);

    // Reset the form and close the add item form
    setNewItem({
      itemName: '',
      unitPrice: '',
      stockLocation: '',
      quantity: '',
      description: '',
      category: '',
      imagePath: ''
    });
    setShowAddItemForm(false); // Close the form after submission
  };

  // Handle editing an item
  const handleEditItem = (index) => {
    setEditItemIndex(index);
    setEditItem(inventory[index]);
  };

  // Handle updating an item
  const handleUpdateItem = () => {
    const updatedInventory = [...inventory];
    updatedInventory[editItemIndex] = editItem;
    setInventory(updatedInventory);

    setEditItemIndex(null);
    setEditItem({
      itemId: '',
      itemName: '',
      unitPrice: '',
      stockLocation: '',
      quantity: '',
      description: '',
      category: '',
      imagePath: ''
    });
  };

  // Handle deleting an item
  const handleDeleteItem = (index) => {
    const updatedInventory = inventory.filter((_, i) => i !== index);
    setInventory(updatedInventory);
  };

  // Handle image path change for the new item
  const handleImagePathChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      alert("No image selected.");
      return;
    }

    const imagePath = `/images/${file.name}`;
    setNewItem({ ...newItem, imagePath });
  };

  return (
    <div className="inventory-container">
      <Header />

      {/* Add Item Button */}
      <div className="add-item-section">
        <button className="add-item-btn" onClick={() => setShowAddItemForm(true)}>
          Add New Item
        </button>
      </div>

      {/* Add Item Form */}
      {showAddItemForm && (
        <div className="add-item-form">
          <h2>Add New Item</h2>
          <div className="input-group">
            {/* Item Name */}
            <div className="input-field">
              <label htmlFor="item-name">Item Name</label>
              <input
                type="text"
                id="item-name"
                value={newItem.itemName}
                onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
                placeholder="Enter item name"
              />
            </div>

            {/* Unit Price */}
            <div className="input-field">
              <label htmlFor="unit-price">Unit Price</label>
              <input
                type="number"
                id="unit-price"
                value={newItem.unitPrice}
                onChange={(e) => setNewItem({ ...newItem, unitPrice: e.target.value })}
                placeholder="Enter price"
              />
            </div>

            {/* Stock Location */}
            <div className="input-field">
              <label htmlFor="edit-stock-location">Stock Location</label>
              <select
                id="edit-stock-location"
                value={newItem.stockLocation}
                onChange={(e) => setNewItem({ ...newItem, stockLocation: e.target.value })}
              >
                <option value="">Select Stock Location</option>
                <option value="Warehouse A">Warehouse A</option>
                <option value="Warehouse B">Warehouse B</option>
                <option value="Warehouse C">Warehouse C</option>
              </select>
            </div>

            {/* Quantity */}
            <div className="input-field">
              <label htmlFor="quantity">Quantity</label>
              <input
                type="number"
                id="quantity"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                placeholder="Enter quantity"
              />
            </div>

            {/* Description */}
            <div className="input-field">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                placeholder="Enter item description"
              />
            </div>

            {/* Category */}
            <div className="input-field">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              >
                <option value="">Select category</option>
                <option value="FastFood">FastFood</option>
                <option value="Dessert">Dessert</option>
                <option value="Drinks">Drinks</option>
                <option value="Fruits">Fruits</option>
              </select>
            </div>

            {/* Image Upload */}
            <div className="input-field">
              <label htmlFor="image">Upload Image</label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImagePathChange}
              />
            </div>
          </div>

          <div className="button-field">
            <button className="save-btn" onClick={handleAddItem}>
              Save Item
            </button>
            <button className="cancel-btn" onClick={() => setShowAddItemForm(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Inventory List Table */}
      <div className="inventory-list">
        <h2>Inventory</h2>
        {inventory.length > 0 ? (
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Item ID</th>
                <th>Item Name</th>
                <th>Unit Price</th>
                <th>Stock Location</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item, index) => (
                <tr key={`${item.itemId || index}-${item.itemName}`}>
                  <td>{item.itemId}</td>
                  <td>{item.itemName}</td>
                  <td>{typeof item.unitPrice === 'number' ? `$${item.unitPrice.toFixed(2)}` : 'N/A'}</td>
                  <td>{item.stockLocation}</td>
                  <td>{item.quantity}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEditItem(index)}>
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => handleDeleteItem(index)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No items in inventory.</p>
        )}
      </div>

      {/* Edit Item Modal */}
      {editItemIndex !== null && (
        <div className="edit-item-form">
          <h2>Edit Item</h2>
          <div className="input-group">
            {/* Item Name */}
            <div className="input-field">
              <label htmlFor="edit-item-name">Item Name</label>
              <input
                type="text"
                id="edit-item-name"
                value={editItem.itemName}
                disabled
                onChange={(e) => setEditItem({ ...editItem, itemName: e.target.value })}
              />
            </div>

            {/* Unit Price */}
            <div className="input-field">
              <label htmlFor="edit-unit-price">Unit Price</label>
              <input
                type="number"
                id="edit-unit-price"
                value={editItem.unitPrice}
                onChange={(e) => setEditItem({ ...editItem, unitPrice: e.target.value })}
              />
            </div>

            {/* Stock Location */}
            <div className="input-field">
              <label htmlFor="edit-stock-location">Stock Location</label>
              <select
                id="edit-stock-location"
                value={editItem.stockLocation}
                onChange={(e) => setEditItem({ ...editItem, stockLocation: e.target.value })}
              >
                <option value="">Select Stock Location</option>
                <option value="Warehouse A">Warehouse A</option>
                <option value="Warehouse B">Warehouse B</option>
                <option value="Warehouse C">Warehouse C</option>
              </select>
            </div>

            {/* Quantity */}
            <div className="input-field">
              <label htmlFor="edit-quantity">Quantity</label>
              <input
                type="number"
                id="edit-quantity"
                value={editItem.quantity}
                onChange={(e) => setEditItem({ ...editItem, quantity: e.target.value })}
              />
            </div>
          </div>

          <div className="button-field">
            <button className="save-btn" onClick={handleUpdateItem}>
              Save Changes
            </button>
            <button className="cancel-btn" onClick={() => setEditItemIndex(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;
