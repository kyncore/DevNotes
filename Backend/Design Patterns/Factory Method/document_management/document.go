package main

type IDocument interface {
    SetTitle(title string)
    SetContent(content string)
    Render()
}
