<?php

class Cart
{
    private array $items = [];

    /**
     * Adds an item to the cart.
     * This method MUTATES the internal state of the object.
     */
    public function addItem(string $product, float $price): void
    {
        $this->items[] = ['product' => $product, 'price' => $price];
        echo "Added {$product} to the cart.\n";
    }

    /**
     * Calculates the total price of all items in the cart.
     */
    public function getTotal(): float
    {
        $total = 0.0;
        foreach ($this->items as $item) {
            $total += $item['price'];
        }
        return $total;
    }

    public function getItems(): array
    {
        return $this->items;
    }
}

// --- Usage ---

echo "OOP Shopping Cart Example\n";
echo "-------------------------\n";

// The cart object holds and manages its own state.
$cart = new Cart();
$cart->addItem('Laptop', 1200.00);
$cart->addItem('Mouse', 25.00);

echo "\nCurrent Cart Total: $" . number_format($cart->getTotal(), 2) . "\n";
echo "Current Items:\n";
print_r($cart->getItems());

echo "\nAdding another item...\n";
$cart->addItem('Keyboard', 75.00);

echo "\nFinal Cart Total: $" . number_format($cart->getTotal(), 2) . "\n";
echo "Final Items:\n";
print_r($cart->getItems());

