import React, { useState } from 'react';
import {useFocused, useSelected} from "slate-react";
import {css} from "emotion";
import isUrl from "is-url";
import imageExtensions from 'image-extensions'
import {Node, Editor, Range, Transforms, Element as SlateElement,Point} from "slate";
import {HashLink} from 'react-router-hash-link';
import {Heading, Code, useClipboard, UnorderedList, OrderedList, ListItem} from '@chakra-ui/react';
import { GoLink } from 'react-icons/go';
const SHORTCUTS = {
    '*': 'list-item',
    '-': 'list-item',
    '+': 'list-item',
    '>': 'block-quote',
    '#': 'heading-one',
    '##': 'heading-two',
    '```': 'block-code',
    '`': 'code',
}
export const Element = props => {
    const {attributes, children, element} = props
    switch (element.type) {
        case 'block-quote':
            return <blockquote {...attributes}>{children}</blockquote>
        case 'heading-one':
            return <Header1Element {...props}/>
        case 'heading-two':
            return <Header2Element {...props}/>
        case 'block-code':
            return <CodeNode {...props}/>
        case 'bulleted-list':
            return <UnorderedList {...attributes} ml={10}>{children}</UnorderedList>
        case 'numbered-list':
            return <OrderedList {...attributes} ml={10}>{children}</OrderedList>
        case 'list-item':
            return <ListItem {...attributes}>{children}</ListItem>
        case 'image':
            return <ImageElement {...props} />
        case 'link':
            return (
                <a {...attributes} href={element.url} target={"_blank"} rel="noopener noreferrer"
                   style={{color: "cornflowerblue", textDecoration: "underline"}}>
                    {children}
                </a>
            )
        default:
            return <p {...attributes}>{children}</p>
    }
}
export const Leaf = ({attributes, children, leaf}) => {
    if (leaf.bold) {
        children = <strong>{children}</strong>
    }

    if (leaf.code) {
        children = <Code>{children}</Code>
    }

    if (leaf.italic) {
        children = <em>{children}</em>
    }

    if (leaf.underline) {
        children = <u>{children}</u>
    }

    return <span {...attributes}>{children}</span>
}

const CodeNode = props => (
    <Code
        display={"block"}
        whiteSpace={"pre"}
        children={props.children}
    />
);
const CopyLinkButton = (props) => {
    const [value] = useState(props.link)
    const { onCopy } = useClipboard(value)
    return (
        <>
                <button onClick={onCopy} style={{marginRight: "0.25rem"}}>
                    <GoLink size={props.size}/>
                </button>
        </>
    )
};

const Header1Element = ({attributes, children, element}) => {
    const anchorId = Node.string(element).toLowerCase().replaceAll(/\s+/g, '-')
    return (
        <Heading mt={5} id={anchorId}{...attributes}>
            <HashLink to={`#${anchorId}`}>{children}</HashLink>
            <CopyLinkButton link={`${window.location.href.replace(window.location.hash,"")}#${anchorId}`} size={"25"}/>
            <hr/>
        </Heading>
    )
}

const Header2Element = ({attributes, children, element}) => {
    const anchorId = Node.string(element).toLowerCase().replaceAll(/\s+/g, '-')
    return (
        <Heading size={"md"} id={anchorId}{...attributes}>
            <HashLink
                to={`#${anchorId}`}>{children}
            </HashLink> <CopyLinkButton link={`${window.location.href.replace(window.location.hash,"")}#${anchorId}`} size={"15"}/>
            <hr/>
        </Heading>
    )
}
export const ImageElement = ({attributes, children, element}) => {
    const selected = useSelected()
    const focused = useFocused()
    return (
        <div {...attributes}>
            <div contentEditable={false}>
                <a href={element.url} rel={"noreferrer noopener"} target={"_blank"}>
                    <img
                        src={element.url}
                        alt={"cannot find"}
                        className={css`
                          display: block;
                          max-width: 100%;
                          max-height: 20em;
                          border: 1px black solid;
                          box-shadow: ${selected && focused ? '0 0 0 3px #B4D5FF' : 'none'};
                        `}
                    />
                </a>
            </div>
            {children}
        </div>
    )
}


export const withShortcuts = editor => {
    const { deleteBackward, insertText } = editor

    editor.insertText = text => {
        const { selection } = editor

        if (text === ' ' && selection && Range.isCollapsed(selection)) {
            const { anchor } = selection
            const block = Editor.above(editor, {
                match: n => Editor.isBlock(editor, n),
            })
            const path = block ? block[1] : []
            const start = Editor.start(editor, path)
            const range = { anchor, focus: start }
            const beforeText = Editor.string(editor, range)
            const type = SHORTCUTS[beforeText]

            if (type) {
                Transforms.select(editor, range)
                Transforms.delete(editor)
                const newProperties: Partial<SlateElement> = {
                    type,
                }
                Transforms.setNodes(editor, newProperties, {
                    match: n => Editor.isBlock(editor, n),
                })

                if (type === 'list-item') {
                    const list = { type: 'bulleted-list', children: [] }
                    Transforms.wrapNodes(editor, list, {
                        match: n =>
                            !Editor.isEditor(n) &&
                            SlateElement.isElement(n) &&
                            n.type === 'list-item',
                    })
                }

                return
            }
        }

        insertText(text)
    }

    editor.deleteBackward = (...args) => {
        const { selection } = editor

        if (selection && Range.isCollapsed(selection)) {
            const match = Editor.above(editor, {
                match: n => Editor.isBlock(editor, n),
            })

            if (match) {
                const [block, path] = match
                const start = Editor.start(editor, path)

                if (
                    !Editor.isEditor(block) &&
                    SlateElement.isElement(block) &&
                    block.type !== 'paragraph' &&
                    Point.equals(selection.anchor, start)
                ) {
                    const newProperties: Partial<SlateElement> = {
                        type: 'paragraph',
                    }
                    Transforms.setNodes(editor, newProperties)

                    if (block.type === 'list-item') {
                        Transforms.unwrapNodes(editor, {
                            match: n =>
                                !Editor.isEditor(n) &&
                                SlateElement.isElement(n) &&
                                n.type === 'bulleted-list',
                            split: true,
                        })
                    }

                    return
                }
            }

            deleteBackward(...args)
        }
    }

    return editor
}

export const withImages = editor => {
    const {insertData, isVoid} = editor
    editor.isVoid = element => {
        return element.type === 'image' ? true : isVoid(element)
    }
    editor.insertData = data => {
        const text = data.getData('text/plain')
        const {files} = data
        if (files && files.length > 0) {
            for (const file of files) {
                const reader = new FileReader()
                const [mime] = file.type.split('/')

                if (mime === 'image') {
                    reader.addEventListener('load', () => {
                        const url = reader.result
                        insertImage(editor, url)
                    })

                    reader.readAsDataURL(file)
                }
            }
        } else if (isImageUrl(text)) {
            insertImage(editor, text)
        } else {
            insertData(data)
        }
    }

    return editor
}
const isImageUrl = url => {
    if (!url) return false
    if (!isUrl(url)) return false
    const ext = new URL(url).pathname.split('.').pop()
    return imageExtensions.includes(ext)
}
export const insertImage = (editor, url) => {
    const text = {text: ''}
    const image = {type: 'image', url, children: [text]}
    Transforms.insertNodes(editor, image)
}
export const withLinks = editor => {
    const {insertData, insertText, isInline} = editor
    editor.isInline = element => {
        return element.type === 'link' ? true : isInline(element)
    }
    editor.insertText = text => {
        if (text && isUrl(text)) {
            wrapLink(editor, text)
        } else {
            insertText(text)
        }
    }
    editor.insertData = data => {
        const text = data.getData('text/plain')

        if (text && isUrl(text)) {
            wrapLink(editor, text)
        } else {
            insertData(data)
        }
    }
    return editor
}

export const insertLink = (editor, url) => {
    if (editor.selection) {
        wrapLink(editor, url)
    }
}

export const isLinkActive = editor => {
    const [link] = Editor.nodes(editor, {match: n => n.type === 'link'})
    return !!link
}

const unwrapLink = editor => {
    Transforms.unwrapNodes(editor, {match: n => n.type === 'link'})
}

const wrapLink = (editor, url) => {
    if (isLinkActive(editor)) {
        unwrapLink(editor)
    }

    const {selection} = editor
    const isCollapsed = selection && Range.isCollapsed(selection)
    const link = {
        type: 'link',
        url,
        children: isCollapsed ? [{text: url}] : [],
    }

    if (isCollapsed) {
        Transforms.insertNodes(editor, link)
    } else {
        Transforms.wrapNodes(editor, link, {split: true})
        Transforms.collapse(editor, {edge: 'end'})
    }
}


