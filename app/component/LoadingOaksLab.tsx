import Image from 'next/image';
import React from 'react';

const LoadingOaksLab = () => {
  return (
    <div className="w-full h-full flex justify-center items-center flex-col">
      <div>Loading ...</div>
      <div>
        <Image
          src="/ball.png"
          width="200"
          height="200"
          alt="Pokemon ball as loader"
          className="animate-spin"
        ></Image>
      </div>
    </div>
  );
};

export default LoadingOaksLab;
