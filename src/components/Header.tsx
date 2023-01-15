import { useRouter } from 'next/router';
import React from 'react';
import Logo from './Logo';


type HeaderProps = {
  username?: string
}

function Header({ username }: HeaderProps) {
  const router = useRouter();

  return (
    <>
      <div>
        <Logo fontSize={30} onClick={() => {
          router.push('/');
        }}/>
        <p>Welcome {username}</p>
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
