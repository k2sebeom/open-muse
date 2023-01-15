import React from 'react';

type LogoProps = {
  fontSize?: number;
};

const Logo = ({ fontSize = 80 }: LogoProps) => {
  return (
    <>
      <div>
        <h1 id="open">Open</h1>
        <h1 id="muse">Muse</h1>
      </div>

      <style jsx>{`
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
