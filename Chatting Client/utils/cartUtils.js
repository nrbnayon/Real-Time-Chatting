// Function to get items from the cart
export const getCartItems = () => {
  if (typeof window !== "undefined") {
    const cartItems = localStorage.getItem("cartItems");
    return cartItems ? JSON.parse(cartItems) : [];
  }
  return [];
};

// Function to add an item to the cart
export const addToCart = (product) => {
  const cartItems = getCartItems();
  const existingItem = cartItems.find((item) => item.id === product.id);

  if (existingItem) {
    const updatedItems = cartItems.map((item) =>
      item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
    );
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
  } else {
    const updatedItems = [...cartItems, { ...product, quantity: 1 }];
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cartUpdated"));
  }

  return getCartItems();
};

// Function to get the total cart count
export const getCartCount = () => {
  const cartItems = getCartItems();
  return cartItems.reduce((total, item) => total + item.quantity, 0);
};

// export const getCartItems = () => {
//   if (typeof window !== "undefined") {
//     const cartItems = localStorage.getItem("cartItems");
//     return cartItems ? JSON.parse(cartItems) : [];
//   }
//   return [];
// };

// // Add item to cart
// export const addToCart = (product) => {
//   const cartItems = getCartItems();
//   const existingItem = cartItems.find((item) => item.id === product.id);

//   if (existingItem) {
//     const updatedItems = cartItems.map((item) =>
//       item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
//     );
//     localStorage.setItem("cartItems", JSON.stringify(updatedItems));
//   } else {
//     const updatedItems = [...cartItems, { ...product, quantity: 1 }];
//     localStorage.setItem("cartItems", JSON.stringify(updatedItems));
//   }

//   if (typeof window !== "undefined") {
//     window.dispatchEvent(new Event("cartUpdated"));
//   }

//   return getCartItems();
// };

// // Get total cart count
// export const getCartCount = () => {
//   const cartItems = getCartItems();
//   return cartItems.reduce((total, item) => total + item.quantity, 0);
// };
