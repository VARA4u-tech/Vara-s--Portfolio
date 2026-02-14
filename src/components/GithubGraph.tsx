import React from "react";
import { GitHubCalendar } from "react-github-calendar";

const GithubGraph = () => {
  return (
    <div className="border-4 border-black p-4 bg-white text-black hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
      <h3 className="font-mono text-xl font-bold mb-4 border-b-2 border-black pb-2 uppercase tracking-tighter">
        GitHub Activity_
      </h3>
      <div className="flex justify-center overflow-x-auto pb-2">
        <GitHubCalendar
          username="VARA4u-tech"
          colorScheme="light"
          style={{
            fontFamily: "monospace",
          }}
          theme={{
            light: ["#e5e5e5", "#a3a3a3", "#737373", "#404040", "#171717"],
          }}
          blockSize={12}
          blockMargin={4}
          fontSize={12}
        />
      </div>
      <div className="mt-2 text-right font-mono text-xs text-gray-600">
        // contribs over last year
      </div>
    </div>
  );
};

export default GithubGraph;
