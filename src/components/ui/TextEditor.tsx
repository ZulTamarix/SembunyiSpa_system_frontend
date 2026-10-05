import { useEffect, useRef, useState } from "react";

const COMMANDS = [
  "bold",
  "italic",
  "underline",
  "insertUnorderedList",
  "insertOrderedList",
];
const BUTTONS = [
  { cmd: "bold", label: "B", title: "Bold (Ctrl+B)", className: "font-bold" },
  { cmd: "italic", label: "I", title: "Italic (Ctrl+I)", className: "italic" },
  { cmd: "underline", label: "U", title: "Underline (Ctrl+U)", className: "underline" },
  { divider: true },
  { cmd: "insertUnorderedList", label: "•", title: "Bullet list" },
  { cmd: "insertOrderedList", label: "1.", title: "Numbered list" },
];

interface TextEditorProps {
    onChange?: (value: string) => void;
}

export default function TextEditor({ onChange }: TextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState<Record<string, boolean>>({});
    const [isEmpty, setIsEmpty] = useState(true);
    const [chars, setChars] = useState(0);

    // Highlight toolbar buttons that match the formatting at the caret/selection
    const refreshActive = () => {
        const sel = window.getSelection();
        const el = editorRef.current;

        if (!sel?.rangeCount || !el?.contains(sel.anchorNode))
            return;

        const next: Record<string, boolean> = {};
        COMMANDS.forEach((c) => {
            next[c] = document.queryCommandState(c);
        });
        setActive(next);
    };

    // useEffect
    useEffect(() => {
        document.addEventListener("selectionchange", refreshActive);

        return () => {
            document.removeEventListener("selectionchange", refreshActive);
        };
    }, []);

    // handle input
    const handleInput = () => {
        const el = editorRef.current;

        if (!el) return;

        const text = el.innerText.replace(/\n$/, "");

        setIsEmpty(text.trim() === "" && !el.querySelector("li"));
        setChars(text.length);

        onChange?.(el.innerHTML);
    };

    const exec = (cmd: string) => {
        const el = editorRef.current;

        if (!el) return;

        el.focus();

        document.execCommand(cmd, false, undefined);

        handleInput();
        refreshActive();
    };

    // Paste as plain text so copied web pages don't bring in messy styles
    const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
        e.preventDefault();

        const text = e.clipboardData.getData("text/plain");

        document.execCommand("insertText", false, text);
    };


    return (

        <div className=" flex h-75 w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm focus-within:border-border focus-within:ring-2 focus-within:ring-border">
            {/* Toolbar */}
            <div className="flex items-center gap-1 border-b border-gray-200 bg-gray-50 px-2 py-1.5">
                {BUTTONS.map((b, i) =>
                    b.divider ? (
                        <div key={i} className="mx-1 h-5 w-px bg-border" />
                    ) : (
                    <button
                        key={b.cmd}
                        type="button"
                        title={b.title}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => b.cmd && exec(b.cmd)}
                        className={`flex h-8 min-w-8 items-center justify-center rounded px-2 text-sm hover:bg-gray-200 ${
                            b.cmd && active[b.cmd] ? "bg-gray-300 text-gray-900" : "text-gray-700"
                        } ${b.className ?? ""}`}
                    >
                        {b.label}
                    </button>
                    )
                )}
                <span className="ml-auto pr-2 text-xs text-gray-500">{chars} chars</span>
            </div>

            {/* Editor */}
            <div className="relative flex min-h-0 flex-1 flex-col">
                {isEmpty && (
                    <div className="pointer-events-none absolute left-4 top-4 text-sm leading-6 text-title">
                        Start typing...
                    </div>
                )}
                <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    onInput={handleInput}
                    onPaste={handlePaste}
                    className="flex-1 overflow-y-auto p-4 text-sm leading-6 text-title outline-none [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6"
                />
            </div>
        </div>

    );
}