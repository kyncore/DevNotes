const Editor = require('./Editor');
const Command = require('./Command');

const editor = new Editor();
const commandHistory = [];

const command1 = new Command(editor, 'Hello, ');
command1.execute();
commandHistory.push(command1);
console.log(editor.text);

const command2 = new Command(editor, 'world!');
command2.execute();
commandHistory.push(command2);
console.log(editor.text);

commandHistory.pop().undo();
console.log(editor.text);

commandHistory.pop().undo();
console.log(editor.text);
