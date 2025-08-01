# Data Processing Pipeline: OOP Approach

This example demonstrates processing a list of user data using an Object-Oriented approach.

## Core Idea

We create a `UserDataProcessor` class that is responsible for loading, filtering, and transforming the data. The logic is encapsulated within this object's methods.

## Key Characteristics

*   **Encapsulation:** The processor object holds the user data and the results. The internal workings are hidden from the outside world.
*   **Stateful:** The object's state changes as methods like `filterInactive()` and `formatUserNames()` are called. The order of method calls matters.
*   **Structured:** The logic is organized into a class, which can be easily managed by a dependency injection container and tested by mocking its dependencies (if it had any).
