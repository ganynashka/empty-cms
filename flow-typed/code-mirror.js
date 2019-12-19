// @flow

declare module 'codemirror' {
    declare type CodeMirrorConfigType = {
        +lineNumbers: boolean,
        +mode: 'htmlmixed',
    };

    declare type CodeMirrorEditorEventNameType = 'change' | 'blur';

    declare class CodeMirrorEditor {
        +getValue: () => string,
        +on: (eventName: CodeMirrorEditorEventNameType, callback: () => mixed) => mixed,
    }

    declare type CodeMirrorType = {
        +fromTextArea: (textArea: HTMLTextAreaElement, config: CodeMirrorConfigType) => CodeMirrorEditor,
    };

    declare export default CodeMirrorType;
}

declare module 'codemirror/lib/codemirror.css' {
    declare export default mixed;
}

declare module 'codemirror/mode/htmlmixed/htmlmixed' {
    declare export default mixed;
}
