//  "use client";
//  import { Button } from "@/components/ui/button";
//  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
//  import { Label } from "@/components/ui/label";
//  import { Textarea } from "@/components/ui/textarea";
//  import { useResumeContext } from "@/context/resume-info-provider";
//  import { toast } from "@/hooks/use-toast";
//  import { generateResumeSummary } from "@/lib/open-ai-model";
//  import { ResumeDataType } from "@/types/resume.type";
//  import { Sparkles } from "lucide-react";
//  import React, { useState } from "react";

//  interface GeneratesSummaryType {
//    fresher: string;
//    mid: string;
//    experienced: string;
//  }

//  const prompt = `Job Title: {jobTitle}.
//   Based on the job title, generate concise and complete summaries for a resume in JSON format for fresher, mid and experienced levels.
//   Each summary should be limited to 3 to 4 lines, reflecting a personal tone and showcasing specif relevant aspects of the user's job title.
//   Ensure that the summaries are engaging and tailored to highlight unique strengths, aspirations, and contributions to collaborative projects, demonstrating a clear understanding of the role and industry standards.
//   JSON format must follow this fashion (you're a model inside and application, always bring only JSON, no titles, no nothing... just plain JSON):
//   {
//   "fresher":{
//   "summary":""
//   }
//   }`;

//  const SummaryForm = (props: { handleNext: () => void }) => {
//    const { handleNext } = props;
//    const { resumeInfo, onUpdate } = useResumeContext();

//    const [loading, setLoading] = useState(false);
//    const [aiGeneratedSummary, setAiGeneratedSummary] =
//      useState<GeneratesSummaryType | null>(null);

//    const handleChange = (e: { target: { value: string } }) => {
//      const { value } = e.target;

//      const resumeDataInfo = resumeInfo as ResumeDataType;
//      const updatedInfo = {
//        ...resumeDataInfo,
//        summary: value,
//      };
//      onUpdate(updatedInfo);
//    };

//    const handleSubmit = () => {};

//    const GenerateSummaryFromAI = async () => {
//      try {
//        const jobTitle = resumeInfo?.personalInfo?.jobTitle;
//        if (!jobTitle) return;
//        setLoading(true);
//        const summaries = await generateResumeSummary(jobTitle);
//        setAiGeneratedSummary(summaries);
//        console.log(summaries);
//      } catch (error) {
//        console.error("Error during AI generation:", error);
//        toast({
//          title: "Failed to generate summary",
//          variant: "destructive",
//        });
//      } finally {
//        setLoading(false);
//      }
//    };

//    return (
//      <div>
//        <div className="w-full">
//          <h2 className="font-bold text-lg">Summary</h2>
//          <p className="text-sm">Add summary for your resume</p>
//        </div>
//        <div>
//          <form onSubmit={handleSubmit}>
//            <div className="flex items-end justify-between">
//              <Label>Add Summary</Label>
//              <Button
//                variant="outline"
//                type="button"
//                className="gap-1"
//                disabled={loading}
//                onClick={() => GenerateSummaryFromAI()}
//              >
//                <Sparkles size="15px" className="text-purple-500" />
//                Generate with AI
//              </Button>
//            </div>
//            <Textarea
//              className="mt-5 min-h-36"
//              required
//              value={resumeInfo?.summary || ""}
//              onChange={handleChange}
//            />

//            {aiGeneratedSummary && (
//              <div>
//                <h5 className="font-semibold text-[15px] my-4">Suggestions</h5>
//                {Object?.entries(aiGeneratedSummary).map(
//                  ([experienceType, summary], index) => (
//                    <Card
//                      role="button"
//                      key={index}
//                      className="my-4 bg-primary/5 shadow-none border-primary/30"
//                      onClick={() => {}}
//                    >
//                      <CardHeader className="py-2">
//                        <CardTitle className="font-semibold text-md">
//                          {experienceType?.charAt(0)?.toUpperCase() +
//                            experienceType?.slice(1)}
//                        </CardTitle>
//                      </CardHeader>
//                      <CardContent className="text-sm">
//                        <p>{summary}</p>
//                      </CardContent>
//                    </Card>
//                  )
//                )}
//              </div>
//            )}

//            <Button
//              className="mt-4"
//              type="submit"
//              disabled={
//                loading || resumeInfo?.status === "archived" ? true : false
//              }
//            >
//              {/* {isPending && <Loader size="15px" className="animate-spin" />} */}
//              Save Changes
//            </Button>
//          </form>
//        </div>
//      </div>
//    );
//  };

//  export default SummaryForm;

//  openai-server version starts here

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useResumeContext } from "@/context/resume-info-provider";
import useUpdateDocument from "@/features/document/use-update-document";
import { toast } from "@/hooks/use-toast";
import { generateThumbnail } from "@/lib/helper";
import { ResumeDataType } from "@/types/resume.type";
import { Loader, Sparkles } from "lucide-react";
import React, { useCallback, useState } from "react";

interface GeneratesSummaryType {
  fresher: { summary: string };
  mid: { summary: string };
  experienced: { summary: string };
}

const SummaryForm = (props: { handleNext: () => void }) => {
  const { handleNext } = props;
  const { resumeInfo, onUpdate } = useResumeContext();
  const { mutateAsync, isPending } = useUpdateDocument(); // added now
  const [loading, setLoading] = useState(false);
  const [aiGeneratedSummary, setAiGeneratedSummary] =
    useState<GeneratesSummaryType | null>(null);

  const handleChange = (e: { target: { value: string } }) => {
    const { value } = e.target;
    const resumeDataInfo = resumeInfo as ResumeDataType;
    const updatedInfo = {
      ...resumeDataInfo,
      summary: value,
    };
    onUpdate(updatedInfo);
  };

  // added now

  const handleSubmit = useCallback(
    async (e: { preventDefault: () => void }) => {
      e.preventDefault();
      if (!resumeInfo) return;
      const thumbnail = await generateThumbnail();
      const currentNo = resumeInfo.currentPosition
        ? resumeInfo?.currentPosition + 1
        : 1;

      await mutateAsync(
        {
          currentPosition: currentNo,
          thumbnail: thumbnail,
          summary: resumeInfo?.summary,
        },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "Summary updated successfully",
            });
            handleNext();
          },
          onError() {
            toast({
              title: "Error",
              description: "Failed to update summary",
              variant: "destructive",
            });
          },
        }
      );
    },
    [resumeInfo]
  );

  //

  const GenerateSummaryFromAI = async () => {
    try {
      const jobTitle = resumeInfo?.personalInfo?.jobTitle;
      if (!jobTitle) return;

      setLoading(true);
      const res = await fetch("/api/openai/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setAiGeneratedSummary(data.summary);

      console.log(data.summary);
    } catch (error) {
      console.error("Error generating summary:", error);
      toast({
        title: "Failed to generate summary",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (summary: string) => {
    if (!resumeInfo) return;
    const resumeDataInfo = resumeInfo as ResumeDataType;
    const updatedInfo = {
      ...resumeDataInfo,
      summary,
    };
    onUpdate(updatedInfo);
    setAiGeneratedSummary(null); // hide suggestions after selection
  };

  return (
    <div>
      <div className="w-full">
        <h2 className="font-bold text-lg">Summary</h2>
        <p className="text-sm">Add summary for your resume</p>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <div className="flex items-end justify-between">
            <Label>Add Summary</Label>
            <Button
              variant="outline"
              type="button"
              className="gap-1"
              disabled={loading || isPending}
              onClick={GenerateSummaryFromAI}
            >
              <Sparkles size="15px" className="text-purple-500" />
              Generate with AI
            </Button>
          </div>
          <Textarea
            className="mt-5 min-h-36"
            required
            value={resumeInfo?.summary || ""}
            onChange={handleChange}
          />

          {aiGeneratedSummary && (
            <div>
              <h5 className="font-semibold text-[15px] my-4">Suggestions</h5>
              {Object.entries(aiGeneratedSummary).map(
                ([experienceType, data], index) => (
                  <Card
                    role="button"
                    key={index}
                    className="my-4 bg-primary/5 shadow-none border-primary/30"
                    onClick={() => handleSelect(data.summary)}
                  >
                    <CardHeader className="py-2">
                      <CardTitle className="font-semibold text-md">
                        {experienceType.charAt(0).toUpperCase() +
                          experienceType.slice(1)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p>{data.summary}</p>
                    </CardContent>
                  </Card>
                )
              )}
            </div>
          )}

          <Button
            className="mt-4"
            type="submit"
            disabled={loading || resumeInfo?.status === "archived"}
          >
            {/* Added now */}
            {isPending && <Loader size="15px" className="animate-spin" />}
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SummaryForm;
