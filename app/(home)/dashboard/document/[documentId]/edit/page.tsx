import EditResume from "../../../../_components/EditResume";
import { ResumeInfoProvider } from "@/context/resume-info-provider";
import React from "react";

const Page = () => {
  return (
    <ResumeInfoProvider>
      <EditResume />
    </ResumeInfoProvider>
  );
};

export default Page;
