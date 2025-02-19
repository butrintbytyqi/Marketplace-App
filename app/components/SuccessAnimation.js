import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import LottieView from 'lottie-react-native';
import Text from './Text';
import { colors } from '../config/theme';

function SuccessAnimation({ 
  visible = false, 
  onDone, 
  message = "Success!", 
  animation = require('../assets/animations/success.json'),
  duration = 2000
}) {
  const animation_ref = useRef(null);

  useEffect(() => {
    if (visible && animation_ref.current) {
      animation_ref.current.reset();
      animation_ref.current.play();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent>
      <View style={styles.container}>
        <View style={styles.animation}>
          <LottieView
            ref={animation_ref}
            source={animation}
            autoPlay
            loop={false}
            style={styles.lottie}
            onAnimationFinish={() => {
              setTimeout(() => {
                if (onDone) onDone();
              }, 500); // Add a small delay before closing
            }}
            speed={1.5}
          />
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  animation: {
    width: 200,
    height: 200,
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 25,
    padding: 20,
  },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  lottie: {
    width: '100%',
  },
  message: {
    color: colors.dark,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
    textAlign: 'center',
  }
});

export default SuccessAnimation;
