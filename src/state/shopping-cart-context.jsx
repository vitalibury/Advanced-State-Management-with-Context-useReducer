import { createContext, useReducer } from "react";
import { DUMMY_PRODUCTS } from "../dummy-products";

export const CartContext = createContext({
    items: [],
    addItemToCart: () => {},
    updateCartItemQuantity: () => {}
});

function cartStateReducer(state, action) {
    let updatedItems = [...state.items];

    switch (action.type) {
        case 'ADD_ITEM':
        const existingCartItemIndex = updatedItems.findIndex(
            (cartItem) => cartItem.id === action.payload
        );
        const existingCartItem = updatedItems[existingCartItemIndex];

        if (existingCartItem) {
            const updatedItem = {
            ...existingCartItem,
            quantity: existingCartItem.quantity + 1,
            };
            updatedItems[existingCartItemIndex] = updatedItem;
        } else {
            const product = DUMMY_PRODUCTS.find((product) => product.id === action.payload);
            updatedItems.push({
            id: action.payload,
            name: product.title,
            price: product.price,
            quantity: 1,
            });
        }

        return {
            items: updatedItems,
        };
        
        case 'UPDATE_QUANTITY':
        const updatedItemIndex = updatedItems.findIndex(
            (item) => item.id === action.productId
        );

        const updatedItem = {
            ...updatedItems[updatedItemIndex],
        };

        updatedItem.quantity += action.amount;

        if (updatedItem.quantity <= 0) {
            updatedItems.splice(updatedItemIndex, 1);
        } else {
            updatedItems[updatedItemIndex] = updatedItem;
        }

        return {
            items: updatedItems,
        };
    }
}

export default function CartContextProvider({children}) {
  const [shoppingCart, cartUpdateDispatch] = useReducer(cartStateReducer, {
    items: []
  });

  function handleAddItemToCart(id) {
    cartUpdateDispatch({
        type: 'ADD_ITEM',
        payload: id
    });
  }

  function handleUpdateCartItemQuantity(productId, amount) {
    cartUpdateDispatch({
        type: 'UPDATE_QUANTITY',
        productId,
        amount
    });
  }

    const cartCtx = {
        items: shoppingCart.items,
        addItemToCart: handleAddItemToCart,
        updateCartItemQuantity: handleUpdateCartItemQuantity
    };

    return (
        <CartContext.Provider value={cartCtx} >
            {children}
        </CartContext.Provider>
    )
}