import React, { useState } from 'react';

import { Button } from 'antd';
import { Node } from 'slate';
import CustomEditor from './editor/CustomEditor';

const App: React.FC<{}> = (props) => {
  const [val, setVal] = useState<Node[]>([
    { children: [{ type: 'subject', children: [{ text: '' }] }] },
  ]);
  const [readOnly, setReadOnly] = useState(false);

  return (
    <div>
      <CustomEditor
        value={val}
        onChange={(value) => setVal(value)}
        readOnly={readOnly}
      />
      <Button onClick={() => setReadOnly(!readOnly)}>toggle</Button>
    </div>
  );
};

export default App;
