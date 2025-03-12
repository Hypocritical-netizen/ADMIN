import { useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-json';

const Code = ({ children }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [children]);

  return (
    <pre style={{ overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
      <code className="language-json">{children}</code>
    </pre>
  );
};

export default Code;
