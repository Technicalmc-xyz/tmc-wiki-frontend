import {Editable, Slate, withReact} from "slate-react";
import {BlockButton, InsertImageButton, LinkButton, MarkButton, toggleMark, Toolbar} from "./RichUtils";
import isHotkey from "is-hotkey";
import React, {useCallback, useMemo, useState} from "react";
import {Element, Leaf, withImages, withLinks} from "./Elements";
import {withHistory} from "slate-history";
import {createEditor, Node} from "slate";
import { Box } from "@chakra-ui/react";

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

const ArticleEditor = (props: Props) => {
    const [value, setValue] = useState<Node[]>(props.initValue)
    const renderElement = useCallback(props => <Element {...props} />, [])
    const renderLeaf = useCallback(props => <Leaf {...props} />, [])
    const editor = useMemo(
        () => withImages(withLinks(withHistory(withReact(createEditor())))),
        []
    )
    return (
        <Box mb={"3vh"}>
            <Slate
            editor={editor}
            value={value}
            onChange={value => {
                setValue(value)
                const content = JSON.stringify(value)
                localStorage.setItem('content', content)
            }}
        >
            {!props.readonly
                ? <Toolbar>
                    <MarkButton format="bold" icon="format_bold"/>
                    <MarkButton format="italic" icon="format_italic"/>
                    <MarkButton format="underline" icon="format_underlined"/>
                    <MarkButton format="code" icon="code"/>
                    <BlockButton format="heading-one" icon="looks_one"/>
                    <BlockButton format="heading-two" icon="looks_two"/>
                    <BlockButton format="block-quote" icon="format_quote"/>
                    <BlockButton format="numbered-list" icon="format_list_numbered"/>
                    <BlockButton format="bulleted-list" icon="format_list_bulleted"/>
                    <BlockButton format="footnote" icon="format_list_bulleted"/>
                    <InsertImageButton/>
                    <LinkButton/>
                </Toolbar>
                : <div/>
            }

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
            {/*{withFooterLinks(editor, renderElement)}*/}
        </Box>
    );
}
export default ArticleEditor