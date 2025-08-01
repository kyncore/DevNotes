# E-commerce Cart: Functional Approach

This example demonstrates a shopping cart using Functional Programming principles.

## Core Idea

The cart is just **data** (a simple array). We use **pure functions** to perform operations. These functions take the cart data as input and return a *new*, transformed copy of the cart data as output.

## Key Characteristics

*   **Immutability:** The original `$cart` array is never changed. Each function (`addItemToCart`) returns a new array representing the updated state. This makes the flow of data explicit and predictable.
*   **Pure Functions:** The functions have no side effects. They don't modify any external state; their output depends only on their input. This makes them easy to test and reason about.
*   **Separation of Data and Behavior:** The cart data (`$cart` array) is completely separate from the functions that operate on it.
