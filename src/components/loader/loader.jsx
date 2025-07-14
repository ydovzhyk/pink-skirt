'use client'

import { PuffLoader } from 'react-spinners'

const LoaderSpinner = () => {
  return (
    <div className="fixed-loader flex items-center justify-center z-[100]">
      <PuffLoader color="#E63993" size={100} />
    </div>
  );
}

export default LoaderSpinner
