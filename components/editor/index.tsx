// tutorial's prompt

//   const PROMPT = `Given the job title "{jobTitle}",
//  create 6-7 concise and personal bullet points in
//   HTML stringify format that highlight my key
//   skills, relevant technologies, and significant
//    contributions in that role. Do not include
//     the job title itself in the output. Provide
//      only the bullet points inside an unordered
//      list.`;

// tutorial's AI

// const GenerateSummaryFromAI = async () => {
//   try {
//     if (!jobTitle) {
//       toast({ title: "Must provide Job Position", variant: "destructive" });
//       return;
//     }
//     setLoading(true);
//     const prompt = PROMPT.replace("{jobTitle}", jobTitle);
//     const result = await AIChatSession.sendMessage(promt);
//     const responseText = await result.response.text();
//     console.log(responseText, "responseText");
//     const validJsonArray = JSON.parse(`[${responseText}]`);
//     console.log(validJsonArray, "validJsonArray");
//     setValue(validJsonArray?.[0]);
//     onEditorChange(validJsonArray?.[0]);
//   } catch (error) {
//     console.log(error);
//     toast({ title: "Failed to generate summary", variant: "destructive" });
//   } finally {
//     setLoading(false);
//   }
// };

//

// const GenerateSummaryFromAI = async () => {
//   try {
//     if (!jobTitle) {
//       toast({ title: "Must provide Job Position", variant: "destructive" });
//       return;
//     }

//     setLoading(true);
//     const res = await fetch("/api/openai/summary", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ jobTitle }),
//     });

//     const data = await res.json();
//     if (!res.ok) throw new Error(data.error);

//     const htmlString = data?.summary?.experienced?.summary ?? "";
//     setValue(htmlString);
//     onEditorChange(htmlString);
//   } catch (error) {
//     console.log(error);
//     toast({ title: "Failed to generate summary", variant: "destructive" });
//   } finally {
//     setLoading(false);
//   }
// };

// import React, { useState } from "react";
// import { Label } from "../ui/label";
// import { Button } from "../ui/button";
// import { Loader, Sparkles } from "lucide-react";
// import {
//   EditorProvider,
//   Editor,
//   Toolbar,
//   BtnBold,
//   BtnItalic,
//   BtnUnderline,
//   BtnStrikeThrough,
//   Separator,
//   BtnNumberedList,
//   BtnBulletList,
//   BtnLink,
// } from "react-simple-wysiwyg";
// import { toast } from "@/hooks/use-toast";

// const RichTextEditor = (props: {
//   jobTitle: string | null;
//   initialValue: string;
//   onEditorChange: (e: any) => void;
// }) => {
//   const { jobTitle, initialValue, onEditorChange } = props;
//   const [loading, setLoading] = useState(false);
//   const [value, setValue] = useState(initialValue || "");

//   const GenerateSummaryFromAI = async () => {
//     try {
//       if (!jobTitle) {
//         toast({ title: "Must provide Job Position", variant: "destructive" });
//         return;
//       }

//       const PROMPT = `Given the job title "{jobTitle}", create 6-7 concise and personal bullet points in HTML format
//   that highlight my key skills, relevant technologies, and significant contributions in that role.
//   Do not include the job title itself in the output. Provide only the bullet points inside an unordered list,
//   formatted using <ul><li>...</li></ul> HTML. Do not include extra commentary or preamble.`;

//       setLoading(true);
//       const res = await fetch("/api/openai/summary", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ jobTitle, prompt: PROMPT }),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error);

//       const html = data.summary; // already stringified html
//       setValue(html);
//       onEditorChange(html);
//     } catch (error) {
//       console.log(error);
//       toast({ title: "Failed to generate summary", variant: "destructive" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <div className="flex items-center justify-between my-2">
//         <Label>Work Summary</Label>
//         <Button
//           variant="outline"
//           type="button"
//           className="gap-1"
//           disabled={loading}
//           onClick={GenerateSummaryFromAI} // change to gpt logic here
//         >
//           <>
//             <Sparkles size="15px" className="text-purple-500" />
//             Generate with AI
//           </>
//           {loading && <Loader size="13px" className="animate-spin" />}
//         </Button>
//       </div>
//       <EditorProvider>
//         <Editor
//           value={value}
//           containerProps={{
//             style: { resize: "vertical", lineHeight: 1.2, fontSize: "13.5px" },
//           }}
//           onChange={(e) => {
//             setValue(e.target.value);
//             onEditorChange(e.target.value);
//           }}
//         >
//           <Toolbar>
//             <BtnBold />
//             <BtnItalic />
//             <BtnUnderline />
//             <BtnStrikeThrough />
//             <Separator />
//             <BtnNumberedList />
//             <BtnBulletList />
//             <Separator />
//             <BtnLink />
//           </Toolbar>
//         </Editor>
//       </EditorProvider>
//     </div>
//   );
// };

// export default RichTextEditor;

import React, { useState } from "react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Loader, Sparkles } from "lucide-react";
import {
  EditorProvider,
  Editor,
  Toolbar,
  BtnBold,
  BtnItalic,
  BtnUnderline,
  BtnStrikeThrough,
  Separator,
  BtnNumberedList,
  BtnBulletList,
  BtnLink,
} from "react-simple-wysiwyg";
import { toast } from "@/hooks/use-toast";

const RichTextEditor = (props: {
  jobTitle: string | null;
  initialValue: string;
  onEditorChange: (e: any) => void;
  aiType?: "summary" | "experience";
}) => {
  const { jobTitle, initialValue, onEditorChange, aiType = "summary" } = props;
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(initialValue || "");

  const GenerateSummaryFromAI = async () => {
    try {
      if (!jobTitle) {
        toast({ title: "Must provide Job Position", variant: "destructive" });
        return;
      }

      const PROMPT = `Given the job title "{jobTitle}", create 6-7 concise and personal bullet points in HTML format
      that highlight my key skills, relevant technologies, and significant contributions in that role.
      Do not include the job title itself in the output. Provide only the bullet points inside an unordered list,
      formatted using <ul><li>...</li></ul> HTML. Do not include extra commentary or preamble.`;

      setLoading(true);
      const res = await fetch("/api/openai/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle,
          prompt: PROMPT,
          aiType: "experience", // <-- REQUIRED
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const html = data.summary;
      setValue(html);
      onEditorChange(html);
    } catch (error) {
      console.log(error);
      toast({ title: "Failed to generate summary", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between my-2">
        <Label>Work Summary</Label>
        <Button
          variant="outline"
          type="button"
          className="gap-1"
          disabled={loading}
          onClick={GenerateSummaryFromAI}
        >
          <>
            <Sparkles size="15px" className="text-purple-500" />
            Generate with AI
          </>
          {loading && <Loader size="13px" className="animate-spin" />}
        </Button>
      </div>
      <EditorProvider>
        <Editor
          value={value}
          containerProps={{
            style: { resize: "vertical", lineHeight: 1.2, fontSize: "13.5px" },
          }}
          onChange={(e) => {
            setValue(e.target.value);
            onEditorChange(e.target.value);
          }}
        >
          <Toolbar>
            <BtnBold />
            <BtnItalic />
            <BtnUnderline />
            <BtnStrikeThrough />
            <Separator />
            <BtnNumberedList />
            <BtnBulletList />
            <Separator />
            <BtnLink />
          </Toolbar>
        </Editor>
      </EditorProvider>
    </div>
  );
};

export default RichTextEditor;
