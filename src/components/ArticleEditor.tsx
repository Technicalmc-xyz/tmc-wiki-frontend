import {Editable, Slate, withReact} from "slate-react";
import {BlockButton, InsertImageButton, LinkButton, MarkButton, toggleMark, Toolbar} from "./RichUtils";
import isHotkey from "is-hotkey";
import React, {useCallback, useMemo, useState} from "react";
import {Element, Leaf, withImages, withLinks} from "./Elements";
import {withHistory} from "slate-history";
import {createEditor, Node} from "slate";
const HOTKEYS = {
    'mod+b': 'bold',
    'mod+i': 'italic',
    'mod+u': 'underline',
    'mod+`': 'code',
}
interface Props {
    initValue: any;
    placeholder?: string;
    readonly?: boolean
}

const Slate = (props: Props) => {
    const [madeChanges, setMadeChanges] = useState(false)
    const [value, setValue] = useState<Node[]>(props.initValue)
    const renderElement = useCallback(props => <Element {...props} />, [])
    const renderLeaf = useCallback(props => <Leaf {...props} />, [])
    const editor = useMemo(
        () => withImages(withLinks(withHistory(withReact(createEditor())))),
        []
    )
    return (
        <Slate
            editor={editor}
            value={value}
            onChange={value => {
                setValue(value)
                setMadeChanges(true)
                const content = JSON.stringify(value)
                localStorage.setItem('content', content)
            }}
        >
            <Editable
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                placeholder={props.placeholder}
                spellCheck
                autoFocus
                readOnly={props.readonly}
                onKeyDown={event => {
                    for (const hotkey in HOTKEYS) {
                        if (isHotkey(hotkey, event as any)) {
                            event.preventDefault();
                            const mark = HOTKEYS[hotkey];
                            toggleMark(editor, mark);
                        }
                    }
                }}

            />
        </Slate>
    );
}