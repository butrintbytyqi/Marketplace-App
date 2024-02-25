import { useWindowDimensions } from 'react-native';

const useOrientation = () => {
  const { width, height } = useWindowDimensions();

  return { isPortrait: height > width };
};

export default useOrientation;