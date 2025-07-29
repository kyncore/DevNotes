require_relative 'order_facade'

order_facade = OrderFacade.new
order_facade.place_order(123, 100, "123 Main St")
