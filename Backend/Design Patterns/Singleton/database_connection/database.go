package main

import (
	"fmt"
	"sync"
)

type database struct {
}

func (d *database) query(q string) {
	fmt.Printf("Executing query: %s\n", q)
}

var lock = &sync.Mutex{}

var instance *database

func getInstance() *database {
	if instance == nil {
		lock.Lock()
		defer lock.Unlock()
		if instance == nil {
			fmt.Println("Creating single instance now.")
			instance = &database{}
		} else {
			fmt.Println("Single instance already created.")
		}
	} else {
		fmt.Println("Single instance already created.")
	}

	return instance
}
