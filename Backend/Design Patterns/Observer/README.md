# Observer Pattern

## Core Explanation

The Observer Pattern is a behavioral design pattern that defines a one-to-many dependency between objects. When one object (the subject) changes its state, all its dependents (observers) are notified and updated automatically.

This pattern is useful when you have a set of objects that need to be notified of changes in another object's state, without the subject needing to know about the specific observers.

**When to use it:**

*   When a change in the state of one object needs to trigger changes in other, unrelated objects.
*   When you want to establish a dynamic relationship between objects, where observers can be added or removed at runtime.
*   To avoid tight coupling between the subject and its observers.

## Real-World Project Example: A Product Inventory System

Imagine you're building an e-commerce application where multiple parts of the system need to react when a product's stock level changes. For example, when a product goes out of stock, you might want to:

1.  Notify customers who have wish-listed the product.
2.  Alert the inventory management team to restock the product.
3.  Update the product's visibility on the website.

We'll use **Ruby on Rails** for this example, leveraging its built-in `Observable` module.

### Project Structure

This example will be conceptual, demonstrating how you would structure this in a Rails application.

```
/app
|-- models
|   |-- product.rb
|-- observers
|   |-- product_observer.rb
|-- mailers
|   |-- customer_mailer.rb
|-- services
|   |-- inventory_service.rb
```

### Implementation

**`app/models/product.rb`**

In Rails, you would define the `Product` model as the "subject."

```ruby
# app/models/product.rb
require 'observer'

class Product < ApplicationRecord
  include Observable

  def stock=(new_stock)
    old_stock = @stock
    @stock = new_stock

    if @stock != old_stock
      changed
      notify_observers(self)
    end
  end
end
```

**`app/observers/product_observer.rb`**

You would create an observer class to handle the notifications.

```ruby
# app/observers/product_observer.rb
class ProductObserver
  def update(product)
    if product.stock.zero?
      # Notify customers
      CustomerMailer.with(product: product).notify_wishlist_users.deliver_later

      # Alert inventory management
      InventoryService.new(product).request_restock

      # Log the event
      Rails.logger.info "Product #{product.name} is out of stock."
    end
  end
end
```

**`config/application.rb`**

To activate the observer, you would add it to your `config/application.rb` file.

```ruby
# config/application.rb
config.active_record.observers = :product_observer
```

## Step-by-Step Explanation

1.  **The Subject (`Product` model):** The `Product` model includes the `Observable` module, which provides the necessary methods to manage observers (`add_observer`, `delete_observer`, `notify_observers`). The `stock=` method is modified to check for a change in the stock level. If the stock changes, it calls `changed` to set the object's state as "changed" and then `notify_observers` to alert all registered observers.

2.  **The Observer (`ProductObserver`):** The `ProductObserver` class implements the `update` method, which is the standard method called by the `Observable` module. This method receives the subject (the `product` instance) as an argument. Inside the `update` method, it checks if the product's stock is zero. If it is, it triggers the necessary actions: sending emails, alerting the inventory service, and logging the event.

3.  **Registering the Observer:** In a Rails application, you can register observers in `config/application.rb`. This tells the application to attach the `ProductObserver` to the `Product` model. Now, whenever a `Product` instance changes and calls `notify_observers`, the `ProductObserver`'s `update` method will be automatically invoked.

This example illustrates how the Observer pattern can decouple the `Product` model from the various actions that need to be performed when its stock level changes. If you need to add a new action (e.g., updating a search index), you can simply add the logic to the `ProductObserver` without modifying the `Product` model itself.
