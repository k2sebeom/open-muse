import React from 'react';

type LogoProps = {
  fontSize?: number;
  onClick?: () => void;
};

const Logo = ({ fontSize = 80, onClick }: LogoProps) => {
  return (
    <>
      <div className="container" onClick={onClick}>
        <h1 id="open">Open</h1>
        <h1 id="muse">Muse</h1>
      </div>

      <style jsx>{`
        .container {
          cursor: ${!onClick ? 'default' : 'pointer'};
        }

        h1 {
          display: inline;
          font-size: ${fontSize}px;
          margin: 0;
        }

        div {
          display: flex;
          justify-content: center;
        }

        #open {
          color: #000;
        }

        #muse {
          color: #6700ff;
        }
      `}</style>
    </>
  );
};

export default Logo;
