package main

import "fmt"

func main() {
	for i := 0; i < 10; i++ {
		go getInstance()
	}

	// Scanln is similar to fmt.Scanln, but it reads from standard input.
	// It's used here to prevent the main function from exiting immediately,
	// allowing the goroutines to finish their execution.
	fmt.Scanln()
}
