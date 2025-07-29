# Decorator Pattern

## Core Explanation

The Decorator Pattern is a structural design pattern that allows you to add new functionality to an object without altering its structure. It involves a set of decorator classes that are used to wrap concrete components.

The decorator pattern is a flexible alternative to subclassing for extending functionality. It's especially useful when you need to add multiple, independent responsibilities to an object at runtime.

**When to use it:**

*   When you want to add responsibilities to individual objects dynamically and transparently, without affecting other objects.
*   When subclassing is impractical due to a large number of independent extensions.
*   To avoid feature-laden classes high up in the hierarchy.

## Real-World Project Example: A Coffee Shop Application

Imagine you're building a coffee shop application where customers can order a coffee and add various extras like milk, sugar, or whipped cream. The price of the coffee should be calculated based on the base coffee and the added extras.

We'll use **PHP** for this example.

### Project Structure

```
/Design Patterns/Decorator
|-- README.md
|-- coffee_shop/
    |-- index.php
    |-- Coffee.php
    |-- SimpleCoffee.php
    |-- CoffeeDecorator.php
    |-- MilkDecorator.php
    |-- SugarDecorator.php
    |-- WhippedCreamDecorator.php
```

### Implementation

First, let's create the directory for our project.
```bash
mkdir -p "Design Patterns/Decorator/coffee_shop"
```

**`coffee_shop/Coffee.php`** (The Component Interface)
```php
<?php

interface Coffee
{
    public function getCost(): int;
    public function getDescription(): string;
}
```

**`coffee_shop/SimpleCoffee.php`** (The Concrete Component)
```php
<?php

class SimpleCoffee implements Coffee
{
    public function getCost(): int
    {
        return 10;
    }

    public function getDescription(): string
    {
        return 'Simple coffee';
    }
}
```

**`coffee_shop/CoffeeDecorator.php`** (The Base Decorator)
```php
<?php

abstract class CoffeeDecorator implements Coffee
{
    protected $coffee;

    public function __construct(Coffee $coffee)
    {
        $this->coffee = $coffee;
    }

    public function getCost(): int
    {
        return $this->coffee->getCost();
    }

    public function getDescription(): string
    {
        return $this->coffee->getDescription();
    }
}
```

**`coffee_shop/MilkDecorator.php`** (A Concrete Decorator)
```php
<?php

class MilkDecorator extends CoffeeDecorator
{
    public function getCost(): int
    {
        return $this->coffee->getCost() + 2;
    }

    public function getDescription(): string
    {
        return $this->coffee->getDescription() . ', milk';
    }
}
```

**`coffee_shop/SugarDecorator.php`** (Another Concrete Decorator)
```php
<?php

class SugarDecorator extends CoffeeDecorator
{
    public function getCost(): int
    {}

    public function getDescription(): string
    {
        return $this->coffee->getDescription() . ', sugar';
    }
}
```

**`coffee_shop/WhippedCreamDecorator.php`** (And another one)
```php
<?php

class WhippedCreamDecorator extends CoffeeDecorator
{
    public function getCost(): int
    {
        return $this->coffee->getCost() + 5;
    }

    public function getDescription(): string
    {
        return $this->coffee->getDescription() . ', whipped cream';
    }
}
```

**`coffee_shop/index.php`** (The Client)
```php
<?php

require_once 'Coffee.php';
require_once 'SimpleCoffee.php';
require_once 'CoffeeDecorator.php';
require_once 'MilkDecorator.php';
require_once 'SugarDecorator.php';
require_once 'WhippedCreamDecorator.php';

$coffee = new SimpleCoffee();
echo $coffee->getDescription() . ' costs ' . $coffee->getCost() . "\n";

$coffeeWithMilk = new MilkDecorator($coffee);
echo $coffeeWithMilk->getDescription() . ' costs ' . $coffeeWithMilk->getCost() . "\n";

$coffeeWithMilkAndSugar = new SugarDecorator($coffeeWithMilk);
echo $coffeeWithMilkAndSugar->getDescription() . ' costs ' . $coffeeWithMilkAndSugar->getCost() . "\n";

$fancyCoffee = new WhippedCreamDecorator(new SugarDecorator(new MilkDecorator(new SimpleCoffee())));
echo $fancyCoffee->getDescription() . ' costs ' . $fancyCoffee->getCost() . "\n";
```

## Step-by-Step Explanation

1.  **The Component Interface (`Coffee.php`):** This interface defines the common methods (`getCost` and `getDescription`) that will be implemented by both the concrete component and the decorators.

2.  **The Concrete Component (`SimpleCoffee.php`):** This is the base object that we want to decorate. It implements the `Coffee` interface and provides the base cost and description.

3.  **The Base Decorator (`CoffeeDecorator.php`):** This abstract class also implements the `Coffee` interface and holds a reference to a `Coffee` object. It delegates the calls to the wrapped object's methods. This class is the foundation for all concrete decorators.

4.  **Concrete Decorators (`MilkDecorator.php`, `SugarDecorator.php`, `WhippedCreamDecorator.php`):** These classes extend the `CoffeeDecorator`. They wrap a `Coffee` object (which can be a `SimpleCoffee` or another decorator) and add their own functionality. For example, the `MilkDecorator` adds 2 to the cost and ", milk" to the description.

5.  **The Client (`index.php`):** The client code can create a simple coffee and then wrap it with any number of decorators to add extras. The beauty of this pattern is that you can combine decorators in any order to create different variations of the coffee.

This example shows how the Decorator pattern can be used to create a flexible system for adding functionality to objects. Adding a new extra (e.g., "Caramel") is as simple as creating a new `CaramelDecorator` class, without changing any existing code.

