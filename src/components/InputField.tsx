import React from 'react';

type InputFieldProps = {
  placeholder?: string;
  value?: string;
  onChange?: (val: string) => void;

  width?: string;
  height?: string;
  fontSize?: number;
};

function InputField({
  fontSize = 20,
  width = '100%',
  height = '50px',
  placeholder,
  value,
  onChange,
}: InputFieldProps) {
  return (
    <>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          if (onChange) {
            onChange(e.target.value);
          }
        }}
        style={{
          width: width,
          height: height,
        }}
      />
      <style jsx>{`
        input {
          border: 2px solid #000;
          border-radius: 20px;
          padding-left: 30px;
          padding-right: 30px;
          padding-top: 10px;
          padding-bottom: 10px;

          font-size: ${fontSize}px;

          margin-top: 5px;
          margin-bottom: 5px;
        }
      `}</style>
    </>
  );
}

export default InputField;
