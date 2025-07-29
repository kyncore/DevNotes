# Bridge Pattern

The Bridge pattern is a structural design pattern that divides business logic or a monolithic class into separate class hierarchies that can be developed independently.

## Use Cases

- When you want to divide and organize a monolithic class that has several variants of some functionality (for example, if the class can work with various database servers).
- When you need to extend a class in several independent dimensions.
- When you need to be able to switch implementations at runtime.

## Pros

- You can create platform-independent classes and apps.
- The client code works with high-level abstractions. It isn’t exposed to the platform details.
- Open/Closed Principle. You can introduce new abstractions and implementations independently from each other.
- Single Responsibility Principle. You can focus on high-level logic in the abstraction and on platform details in the implementation.

## Cons

- You might make the code more complicated by applying the pattern to a highly cohesive class.
