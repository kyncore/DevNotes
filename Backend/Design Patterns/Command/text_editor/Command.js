class Command {
  constructor(editor, text) {
    this.editor = editor;
    this.text = text;
    this.executed = false;
  }

  execute() {
    this.editor.text += this.text;
    this.executed = true;
  }

  undo() {
    if (!this.executed) {
      return;
    }
    this.editor.text = this.editor.text.slice(0, -this.text.length);
    this.executed = false;
  }
}

module.exports = Command;
