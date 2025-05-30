"use client";
import { useResumeContext } from "@/context/resume-info-provider";
import { cn } from "@/lib/utils";
import React from "react";
import PersonalInfo from "./preview/PersonalInfo";
import SummaryPreview from "./preview/SummaryPreview";
import ExperiencePreview from "./preview/ExperiencePreview";
import EducationPreview from "./preview/EducationPreview";
import SkillsPreview from "./preview/SkillsPreview";

const ResumePreview = () => {
  const { resumeInfo, isLoading } = useResumeContext();

  return (
    <div
      id="resume-preview-id"
      className={cn(
        `shadow-lg bg-white w-full flex-[1.02] h-full p-10 dark:border dark:bg-card dark:border-b-gray-800 dark:border-x-gray-800`
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
