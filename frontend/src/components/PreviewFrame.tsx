import { WebContainer } from '@webcontainer/api';
import { useEffect, useState } from 'react';

interface PreviewFrameProps {
  files: any[];
  webContainer?: WebContainer; // made optional
}

export function PreviewFrame({ files, webContainer }: PreviewFrameProps) {
  const [url, setUrl] = useState("");

  async function main() {
    if (!webContainer) return;

    const installProcess = await webContainer.spawn('npm', ['install']);

    installProcess.output.pipeTo(new WritableStream({
      write(data) {
        console.log(data);
      }
    }));

    await webContainer.spawn('npm', ['run', 'dev']);

    webContainer.on('server-ready', (port, url) => {
      console.log("Preview server ready:", url, port);
      setUrl(url);
    });
  }

  useEffect(() => {
    main();
  }, [webContainer]); // run effect when webContainer is set

  return (
    <div className="h-full flex items-center justify-center text-gray-400">
      {!url && <div className="text-center">
        <p className="mb-2">Loading preview...</p>
      </div>}
      {url && <iframe width="100%" height="100%" src={url} />}
    </div>
  );
}
