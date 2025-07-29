# Singleton Pattern

The Singleton pattern is a creational design pattern that ensures a class has only one instance and provides a global point of access to it.

## Use Cases

- When you need exactly one instance of a class to coordinate actions across the system. For example, a logging service, a database connection, or a file manager.
- When you need to control access to a shared resource.

## Pros

- Ensures that a class has only one instance.
- Provides a global point of access to that instance.
- The singleton instance is created only when it is requested for the first time (lazy initialization).

## Cons

- Violates the Single Responsibility Principle, as the class is responsible for both its business logic and for managing its own instance.
- Can mask bad design, for instance, when the components of the program know too much about each other.
- The pattern is difficult to test.
- Requires special treatment in a multithreaded environment so that multiple threads won’t create a singleton object several times.
