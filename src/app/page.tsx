"use client";
import { useState } from "react";
import CreatineLog from "@/components/CreatineLog";

export default function Page() {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="min-h-screen flex flex-col">
      <CreatineLog onExpandedChange={setIsExpanded} />
      {/* Sibling content only visible when the log is collapsed */}
      {!isExpanded && (
        <div className="p-4">
          <p>Test</p>
        </div>
      )}
    </div>
  );
}
