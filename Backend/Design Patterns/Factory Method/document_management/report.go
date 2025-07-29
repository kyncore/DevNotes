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

