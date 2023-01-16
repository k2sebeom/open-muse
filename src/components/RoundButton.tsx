import React from 'react';

type RoundButtonProps = {
  title: string;
  onClick?: () => void;
  backgroundColor?: string;
  fontSize?: number;
  width?: number;
  height?: number;
  children?: React.ReactNode;
};

function RoundButton({
  width,
  height,
  title,
  fontSize,
  backgroundColor,
  onClick,
  children,
}: RoundButtonProps) {
  return (
    <>
      <button onClick={onClick}>
        {title}
        {children}
      </button>
      <style jsx>{`
        button {
          padding: 10px;
          border-radius: 20px;
          background-color: ${!backgroundColor ? '#6700FF' : backgroundColor};
          color: #fff;
          font-size: ${!fontSize ? '20px' : fontSize};
          font-weight: bold;
          width: ${width}px;
          height: ${height}px;
          margin-top: 10px;
          margin-bottom: 10px;
          cursor: pointer;
        }
      `}</style>
    </>
  );
}

export default RoundButton;
