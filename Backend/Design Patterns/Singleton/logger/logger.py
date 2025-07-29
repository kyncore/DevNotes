class Logger:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Logger, cls).__new__(cls)
            cls._instance.messages = []
        return cls._instance

    def log(self, message):
        self.messages.append(message)

    def print_messages(self):
        for message in self.messages:
            print(message)

