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
  Image,
  ImageToolbar,
  ImageCaption,
  ImageStyle,
  ImageResize,
  ImageInsert,
  AutoImage,
  LinkImage,
  PictureEditing,
  SimpleUploadAdapter,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";

/**
 * Rich-text editor for blog bodies (client-only — CKEditor needs the browser).
 * Outputs HTML kept in sync via onChange. Supports inline images: upload (saved
 * to /uploads via /admin/blog/upload-image) or insert-by-URL.
 */
export default function RichEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  return (
    <div className="rich-editor rounded-lg border border-line">
      <CKEditor
        editor={ClassicEditor}
        data={value}
        config={{
          licenseKey: "GPL",
          plugins: [
            Essentials, Paragraph, Heading, Bold, Italic, Link, List, BlockQuote, Undo,
            Image, ImageToolbar, ImageCaption, ImageStyle, ImageResize, ImageInsert, AutoImage, LinkImage, PictureEditing, SimpleUploadAdapter,
          ],
          toolbar: [
            "undo", "redo", "|",
            "heading", "|",
            "bold", "italic", "link", "insertImage", "|",
            "bulletedList", "numberedList", "blockQuote",
          ],
          image: {
            toolbar: [
              "toggleImageCaption", "imageTextAlternative", "|",
              "imageStyle:inline", "imageStyle:block", "imageStyle:side", "|",
              "resizeImage",
            ],
          },
          simpleUpload: {
            uploadUrl: "/admin/blog/upload-image",
          },
        }}
        onChange={(_evt, editor) => onChange(editor.getData())}
      />
    </div>
  );
}
