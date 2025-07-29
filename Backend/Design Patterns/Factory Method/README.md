# Factory Method Pattern

## Core Explanation

The Factory Method Pattern is a creational design pattern that provides an interface for creating objects in a superclass, but allows subclasses to alter the type of objects that will be created.

This pattern is useful when you have a class that cannot anticipate the class of objects it must create. The Factory Method lets a class defer instantiation to subclasses.

**When to use it:**

*   When a class doesn't know which class of objects it needs to create.
*   When a class wants its subclasses to specify the objects it creates.
*   When you want to provide a way to extend your library or framework with new types of objects.

## Real-World Project Example: A Document Management System

Imagine you're building a document management system that can create different types of documents, such as reports, presentations, and spreadsheets. The core application logic for creating and managing documents is the same, but the actual document creation process differs for each type.

We'll use **Go** for this example.

### Project Structure

```
/Design Patterns/Factory Method
|-- README.md
|-- document_management/
    |-- main.go
    |-- document.go
    |-- report.go
    |-- presentation.go
    |-- spreadsheet.go
    |-- document_factory.go
```

### Implementation

First, let's create the directory for our project.
```bash
mkdir -p "Design Patterns/Factory Method/document_management"
```

**`document_management/document.go`** (The Product Interface)
```go
package main

type IDocument interface {
    SetTitle(title string)
    SetContent(content string)
    Render()
}
```

**`document_management/report.go`** (A Concrete Product)
```go
package main

import "fmt"

type Report struct {
    Title   string
    Content string
}

func (r *Report) SetTitle(title string) {
    r.Title = title
}

func (r *Report) SetContent(content string) {
    r.Content = content
}

func (r *Report) Render() {
    fmt.Printf("--- Report: %s ---\n%s\n", r.Title, r.Content)
}
```

**`document_management/presentation.go`** (Another Concrete Product)
```go
package main

import "fmt"

type Presentation struct {
    Title   string
    Content string
}

func (p *Presentation) SetTitle(title string) {
    p.Title = title
}

func (p *Presentation) SetContent(content string) {
    p.Content = content
}

func (p *Presentation) Render() {
    fmt.Printf("--- Presentation: %s ---\n%s\n", p.Title, p.Content)
}
```

**`document_management/spreadsheet.go`** (And another one)
```go
package main

import "fmt"

type Spreadsheet struct {
    Title   string
    Content string
}

func (s *Spreadsheet) SetTitle(title string) {
    s.Title = title
}

func (s *Spreadsheet) SetContent(content string) {
    s.Content = content
}

func (s *Spreadsheet) Render() {
    fmt.Printf("--- Spreadsheet: %s ---\n%s\n", s.Title, s.Content)
}
```

**`document_management/document_factory.go`** (The Factory)
```go
package main

import "fmt"

func GetDocument(docType string) (IDocument, error) {
    if docType == "report" {
        return &Report{}, nil
    }
    if docType == "presentation" {
        return &Presentation{}, nil
    }
    if docType == "spreadsheet" {
        return &Spreadsheet{}, nil
    }
    return nil, fmt.Errorf("unknown document type: %s", docType)
}
```

**`document_management/main.go`** (The Client)
```go
package main

func main() {
    report, _ := GetDocument("report")
    report.SetTitle("Monthly Sales Report")
    report.SetContent("Sales are up by 10%")
    report.Render()

    presentation, _ := GetDocument("presentation")
    presentation.SetTitle("Q3 Product Launch")
    presentation.SetContent("We are launching a new product in Q3.")
    presentation.Render()

    spreadsheet, _ := GetDocument("spreadsheet")
    spreadsheet.SetTitle("Financial Projections")
    spreadsheet.SetContent("Projected revenue for next year is $1M.")
    spreadsheet.Render()
}
```

## Step-by-Step Explanation

1.  **The Product Interface (`document.go`):** The `IDocument` interface defines the common methods that all document types will implement. This ensures that the client code can work with any document type through this common interface.

2.  **Concrete Products (`report.go`, `presentation.go`, `spreadsheet.go`):** These are the concrete implementations of the `IDocument` interface. Each struct represents a specific type of document and implements the `SetTitle`, `SetContent`, and `Render` methods.

3.  **The Factory (`document_factory.go`):** The `GetDocument` function is our factory. It takes a `docType` string as input and returns the corresponding document object. This function encapsulates the logic of which document class to instantiate.

4.  **The Client (`main.go`):** The client code uses the `GetDocument` factory to create document objects. It doesn't need to know the concrete class of the document it's creating. It just requests a document of a certain type and then works with it through the `IDocument` interface.

This example demonstrates how the Factory Method pattern can be used to create a flexible and extensible document management system. Adding a new document type (e.g., "Memo") is as simple as creating a new `Memo` struct that implements the `IDocument` interface and updating the `GetDocument` factory to handle the "memo" type. The client code doesn't need to be changed.

