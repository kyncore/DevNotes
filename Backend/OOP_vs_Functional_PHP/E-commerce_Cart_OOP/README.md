# E-commerce Cart: OOP Approach

This example demonstrates a shopping cart using Object-Oriented Programming.

## Core Idea

The `Cart` is an **object**. It encapsulates its own data (the items) and the behaviors that can modify that data (adding, removing, calculating totals). The state is managed internally by the object itself.

## Key Characteristics

*   **Encapsulation:** The `$items` array is `private`, meaning it cannot be directly manipulated from outside the `Cart` class. You must use the public methods (`addItem`, `getTotal`).
*   **Stateful:** The `Cart` object holds its state. Each time you call `addItem`, you are mutating that specific object's internal state.
*   **Clear Responsibility:** The `Cart` class is solely responsible for all cart-related logic.
