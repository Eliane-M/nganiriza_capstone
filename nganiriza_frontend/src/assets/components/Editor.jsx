import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const Editor = forwardRef(({ defaultValue, readOnly = false, onSelectionChange, onTextChange, placeholder }, ref) => {
  const editorRef = useRef(null);
  const quillInstanceRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getLength: () => quillInstanceRef.current?.getLength(),
    getContents: () => quillInstanceRef.current?.getContents(),
    getText: () => quillInstanceRef.current?.getText(),
    getHTML: () => quillInstanceRef.current?.root.innerHTML,
    setContents: (delta) => {
      if (quillInstanceRef.current) {
        quillInstanceRef.current.setContents(delta);
      }
    },
    setHTML: (html) => {
      if (quillInstanceRef.current) {
        quillInstanceRef.current.root.innerHTML = html;
      }
    },
    focus: () => quillInstanceRef.current?.focus(),
  }));

  useEffect(() => {
    if (!editorRef.current || quillInstanceRef.current) return;

    const quill = new Quill(editorRef.current, {
      theme: 'snow',
      readOnly,
      placeholder: placeholder || 'Start typing...',
      modules: {
        toolbar: [
          [{ 'header': [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'align': [] }],
          ['link', 'image'],
          ['clean']
        ]
      }
    });

    quillInstanceRef.current = quill;

    // Set initial content if provided
    if (defaultValue) {
      if (typeof defaultValue === 'string') {
        quill.root.innerHTML = defaultValue;
      } else {
        quill.setContents(defaultValue);
      }
    }

    // Handle selection changes
    if (onSelectionChange) {
      quill.on('selection-change', (range) => {
        onSelectionChange(range);
      });
    }

    // Handle text changes
    if (onTextChange) {
      quill.on('text-change', (delta, oldDelta, source) => {
        onTextChange({
          ops: delta.ops,
          source
        });
      });
    }

    return () => {
      // Cleanup if needed
    };
  }, []);

  useEffect(() => {
    if (quillInstanceRef.current) {
      quillInstanceRef.current.enable(!readOnly);
    }
  }, [readOnly]);

  return (
    <div className="quill-editor-wrapper">
      <div ref={editorRef} className="quill-editor" />
    </div>
  );
});

Editor.displayName = 'Editor';

export default Editor;

