<?php

/**
 * Adds an item to a cart.
 * This is a PURE FUNCTION. It does not modify the original $cart.
 * It returns a new cart array with the item added.
 *
 * @param array $cart The original cart data.
 * @param string $product
 * @param float $price
 * @return array The new cart state.
 */
function addItemToCart(array $cart, string $product, float $price): array
{
    echo "Adding {$product} to the cart.\n";
    $newCart = $cart; // Create a copy
    $newCart[] = ['product' => $product, 'price' => $price];
    return $newCart;
}

/**
 * Calculates the total price of all items in the cart.
 * This is also a PURE FUNCTION.
 *
 * @param array $cart The cart data.
 * @return float The total.
 */
function calculateTotal(array $cart): float
{
    // array_reduce is a classic functional tool for "reducing" a list to a single value.
    return array_reduce(
        $cart,
        fn(float $total, array $item) => $total + $item['price'],
        0.0
    );
}

// --- Usage ---

echo "Functional Shopping Cart Example\n";
echo "------------------------------\n";

// The cart is just a simple array (data).
$cartState1 = [];
$cartState2 = addItemToCart($cartState1, 'Laptop', 1200.00);
$cartState3 = addItemToCart($cartState2, 'Mouse', 25.00);

echo "\nCurrent Cart Total: $" . number_format(calculateTotal($cartState3), 2) . "\n";
echo "Current Items:\n";
print_r($cartState3);

echo "\nOriginal cart state is unchanged:\n";
print_r($cartState1); // Demonstrates immutability

echo "\nAdding another item...\n";
$cartState4 = addItemToCart($cartState3, 'Keyboard', 75.00);

echo "\nFinal Cart Total: $" . number_format(calculateTotal($cartState4), 2) . "\n";
echo "Final Items:\n";
print_r($cartState4);
