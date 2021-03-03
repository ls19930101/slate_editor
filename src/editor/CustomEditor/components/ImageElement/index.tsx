import { RenderElementProps, useFocused, useSelected } from 'slate-react';

import React from 'react';

export const Image: React.FC<RenderElementProps> = (props) => {
  const { attributes, children, element } = props;

  const selected = useSelected();

  const focused = useFocused();

  return (
    <div {...attributes}>
      <div contentEditable={false}>
        {element.url ? (
          <img
            src={`${element.url}`}
            style={{
              display: 'block',
              maxWidth: '100%',
              maxHeight: '20em',
              borderRadius: '4px',
              boxShadow: `${selected && focused ? '0 0 0 2px #B4D5FF, 0 0 0 1px inset' : 'none'}`,
              // cursor: `${selected ? 'zoom-in' : 'default'}`,
            }}
          />
        ) : (
          <img />
        )}
      </div>
      {children}
    </div>
  );
};
