# Data Processing Pipeline: Functional Approach

This example demonstrates processing a list of user data using a Functional approach.

## Core Idea

We treat the user list as data and create a "pipeline" by passing this data through a series of pure functions. Each function takes data as input and returns the transformed data as output.

## Key Characteristics

*   **Composition:** The entire process is a composition of functions. We chain `array_filter` and `array_map` together. This is a very common pattern in FP.
*   **Declarative:** The code *describes* what the result should be (a filtered and mapped array), not *how* to loop through it step-by-step. This can make the intent clearer at a glance.
*   **Stateless:** There is no object holding state. The `$users` array is passed into the pipeline, and the `$result` is a completely new array. The original `$users` array is never modified.
*   **Concise:** For data and list manipulation, the functional approach is often much more concise than its OOP equivalent.
