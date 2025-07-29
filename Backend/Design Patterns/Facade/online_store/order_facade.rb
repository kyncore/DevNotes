require_relative 'inventory_system'
require_relative 'payment_system'
require_relative 'shipping_system'

class OrderFacade
  def initialize
    @inventory_system = InventorySystem.new
    @payment_system = PaymentSystem.new
    @shipping_system = ShippingSystem.new
  end

  def place_order(product_id, amount, address)
    puts "Placing order for product ##{product_id}"
    if @inventory_system.check_stock(product_id) && @payment_system.process_payment(amount)
      @shipping_system.ship_product(product_id, address)
      puts "Order placed successfully"
    else
      puts "Failed to place order"
    end
  end
end
