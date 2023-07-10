import { useRef } from "react";
import { Editor as TinyMCEEditor, IAllProps } from "@tinymce/tinymce-react";

type ExcludeProps = "init" | "apiKey";

interface EditorProps extends Omit<IAllProps, ExcludeProps> {
  height?: string | number | undefined;
}

const Editor = (props: EditorProps) => {
  const { height, ...restProps } = props;
  const editorRef = useRef<TinyMCEEditor | null>(null);

  return (
    <TinyMCEEditor
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_KEY}
      ref={(ref) => {
        editorRef.current = ref;
      }}
      init={{
        resize: false,
        height,
        plugins: [
          "file",
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "preview",
          "anchor",
          "searchreplace",
          "visualblocks",
          "code",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
          "code",
          "help",
          "wordcount",
        ],

        images_file_types: "jpg,svg,webp",
        toolbar:
          "undo redo | blocks | fontfamily | fontsize | " +
          "bold italic forecolor | alignleft aligncenter " +
          "alignright alignjustify | bullist numlist outdent indent | " +
          "removeformat | help",
        file_picker_types: "image",
        /* and here's our custom image picker*/
        file_picker_callback: (cb, value, meta) => {
          const input = document.createElement("input");
          input.setAttribute("type", "file");
          input.setAttribute("accept", "image/*");

          const tinyMce = editorRef.current;
          if (tinyMce == null) return;

          input.addEventListener("change", (e: any) => {
            const file = e.target.files[0];

            const reader = new FileReader();
            reader.addEventListener("load", () => {
              /*
                Note: Now we need to register the blob in TinyMCEs image blob
                registry. In the next release this part hopefully won't be
                necessary, as we are looking to handle it internally.
              */
              const id = "blobid" + new Date().getTime();

              const blobCache = editorRef.current.activeEditor.editorUpload
                .blobCache as any;

              const base64: any = reader.result.split(",")[1] as any;
              const blobInfo = blobCache.create(id, file, base64);
              blobCache.add(blobInfo);

              /* call the callback and populate the Title field with the file name */
              cb(blobInfo.blobUri(), { title: file.name });
            });
            reader.readAsDataURL(file);
          });

          input.click();
        },

        content_style: "body { font-family: Helvetica,Arial,sans-serif; font-size:12pt }",
      }}
      {...restProps}
    />
  );
};

export default Editor;
