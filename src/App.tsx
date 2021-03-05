import React, { useState } from 'react';

import { Button } from 'antd';
import CustomEditor from './editor/CustomEditor';
import { Node } from 'slate';

const App: React.FC<{}> = (props) => {
  const [val, setVal] = useState<Node[]>([
    { type: 'subject', children: [{ text: '' }] },
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
