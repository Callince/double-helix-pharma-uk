"use client";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Heading,
  Bold,
  Italic,
  Link,
  List,
  BlockQuote,
  Undo,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";

/**
 * Rich-text editor for blog bodies. Loaded client-side only (CKEditor needs the
 * browser). Outputs HTML, kept in sync with the parent form via onChange.
 */
export default function RichEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  return (
    <div className="rich-editor rounded-lg border border-line">
      <CKEditor
        editor={ClassicEditor}
        data={value}
        config={{
          licenseKey: "GPL",
          plugins: [Essentials, Paragraph, Heading, Bold, Italic, Link, List, BlockQuote, Undo],
          toolbar: [
            "undo", "redo", "|",
            "heading", "|",
            "bold", "italic", "link", "|",
            "bulletedList", "numberedList", "blockQuote",
          ],
        }}
        onChange={(_evt, editor) => onChange(editor.getData())}
      />
    </div>
  );
}
