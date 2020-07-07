import React, { useEffect, useRef, Fragment } from 'react';
import ContentLoader from 'react-content-loader';

const Preloader = () => {
  const containerRef = useRef(null);
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView(true);
    }
  }, []);

  return (
    <ContentLoader
      backgroundColor={`#f5f5f5`}
      width={`100%`}
      height={390}
      preserveAspectRatio="none"
      viewBox="0 0 500 390"
    >
      {new Array(6).fill(``).map((_, index) => (
        <Fragment key={`line-${index}`}>
          <rect x="20" y={index * 60 + 30} rx="5" ry="5" width="220" height="30" />
          <rect x="260" y={index * 60 + 30} rx="5" ry="5" width="220" height="30" />
        </Fragment>
      ))}
    </ContentLoader>
  );
};

export default Preloader;
