# Adapter Pattern

The Adapter pattern is a structural design pattern that allows objects with incompatible interfaces to collaborate.

## Use Cases

- When you want to use an existing class, but its interface is not compatible with the rest of your code.
- When you want to reuse several existing subclasses that lack some common functionality that can’t be added to the superclass.

## Pros

- Single Responsibility Principle. You can separate the interface or data conversion logic from the business logic of the primary class.
- Open/Closed Principle. You can introduce new types of adapters into the program without breaking the existing client code, as long as they work with the adapters through the target interface.

## Cons

- The overall complexity of the code increases because you need to introduce a set of new interfaces and classes. Sometimes it’s simpler to change the service class so that it matches the rest of your code.
