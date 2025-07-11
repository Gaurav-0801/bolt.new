// src/components/PreviewFrame.tsx
import React, { useEffect, useState } from 'react';
import { WebContainer } from '@webcontainer/api';
import { FileItem } from '../types';

interface PreviewFrameProps {
  files: FileItem[];
  webContainer?: WebContainer; // ← optional
}

export function PreviewFrame({ files, webContainer }: PreviewFrameProps) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (!webContainer) return;

    const runServer = async () => {
      const installProcess = await webContainer.spawn('npm', ['install']);

      installProcess.output.pipeTo(new WritableStream({
        write(data) {
          console.log(data);
        }
      }));

      await webContainer.spawn('npm', ['run', 'dev']);

      webContainer.on('server-ready', (port, url) => {
        console.log(`Preview running at ${url}`);
        setUrl(url);
      });
    };

    runServer();
  }, [webContainer]);

  if (!webContainer) {
    return <div className="text-gray-400 p-4">Initializing preview environment...</div>;
  }

  return (
    <div className="h-full flex items-center justify-center text-gray-400">
      {!url ? (
        <div className="text-center">
          <p className="mb-2">Loading preview...</p>
        </div>
      ) : (
        <iframe width="100%" height="100%" src={url} />
      )}
    </div>
  );
}
