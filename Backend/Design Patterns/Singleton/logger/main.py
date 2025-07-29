from logger import Logger

logger1 = Logger()
logger2 = Logger()

logger1.log("First message.")
logger2.log("Second message.")

print(f"Are logger1 and logger2 the same instance? {logger1 is logger2}")

logger1.print_messages()
