import React from 'react';
import Logo from './Logo';

function Header() {
  return (
    <>
      <div>
        <Logo fontSize={30} />
        <p>Welcome</p>
      </div>
      <style jsx>{`
        div {
          width: 100%;
          display: flex;
          justify-content: space-between;
          padding-left: 20px;
          padding-right: 20px;
          margin-top: 10px;
        }

        p {
          display: inline;
        }
      `}</style>
    </>
  );
}

export default Header;
