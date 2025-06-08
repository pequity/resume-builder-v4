"use client";
import { cn } from "@/lib/utils";
import React from "react";
import EducationPreview from "@/components/preview/EducationPreview";
import ExperiencePreview from "@/components/preview/ExperiencePreview";
import PersonalInfo from "@/components/preview/PersonalInfo";
import SkillsPreview from "@/components/preview/SkillsPreview";
import SummaryPreview from "@/components/preview/SummaryPreview";
import { useResumeContext } from "@/context/resume-info-provider";

const ResumePreview = () => {
  const { resumeInfo, isLoading } = useResumeContext();

  return (
    <div
      id="resume-preview-id"
      className={cn(
        `shadow-lg bg-white w-full flex-[1.02] h-full p-10 !font-open-sans dark:border dark:bg-card dark:border-b-gray-800 dark:border-x-gray-800`
      )}
      style={{ borderTop: `13px solid ${resumeInfo?.themeColor}` }}
    >
      {/* {Personal Info} */}
      <PersonalInfo isLoading={isLoading} resumeInfo={resumeInfo} />

      {/* {Summary} */}
      <SummaryPreview isLoading={isLoading} resumeInfo={resumeInfo} />

      {/* {Professional Experience} */}
      <ExperiencePreview isLoading={isLoading} resumeInfo={resumeInfo} />

      {/* {Educational Info} */}
      <EducationPreview isLoading={isLoading} resumeInfo={resumeInfo} />

      {/* {Skills} */}
      <SkillsPreview isLoading={isLoading} resumeInfo={resumeInfo} />
    </div>
  );
};

export default ResumePreview;
