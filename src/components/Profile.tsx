import Image from 'next/image';
import React from 'react';

import NoteImage from '../assets/images/note.jpg';

type ProfileProps = {
  size?: number;
  name?: string;
};

function Profile({ size = 50, name = 'PRofile' }: ProfileProps) {
  return (
    <div className="profileContainer">
      <div className="clipShape">
        <Image src={NoteImage} alt="profile" width={size} height={size} />
      </div>

      <h2>{name}</h2>

      <style jsx>{`
        .clipShape {
          position: relative;
          overflow: hidden;
          background-color: red;
          border-radius: 50%;
          width: ${size}px;
          height: ${size}px;
          box-shadow: 4px 2px 6px black;
        }

        .profileContainer {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 10px;
        }

        h2 {
          margin-top: 10px;
          margin-bottom: 0px;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}

export default Profile;
