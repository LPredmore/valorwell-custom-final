import React from 'react';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';

interface JsonEditorProps {
  value: any;
  onChange: (value: any) => void;
  placeholder?: any;
  height?: string;
}

export const JsonEditor: React.FC<JsonEditorProps> = ({
  value,
  onChange,
  placeholder,
  height = '400px'
}) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <JSONInput
        id="json-editor"
        placeholder={placeholder || value}
        locale={locale}
        height={height}
        width="100%"
        onChange={(content) => {
          if (content.jsObject !== undefined) {
            onChange(content.jsObject);
          }
        }}
        theme="light_mitsuketa_tribute"
        style={{
          body: {
            fontSize: '14px',
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
          }
        }}
      />
    </div>
  );
};