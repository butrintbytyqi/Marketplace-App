import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import colors from '../config/colors';

const { width } = Dimensions.get('window');

function ImageSwiper({ images, height }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = new Animated.Value(0);

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setActiveIndex(index);
  };

  const renderImage = ({ item }) => (
    <Image
      source={{ uri: item.url }}
      style={[styles.image, { height }]}
      resizeMode="cover"
    />
  );

  const renderPagination = () => {
    return (
      <View style={styles.pagination}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === activeIndex && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <View>
      <FlatList
        data={images}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderImage}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          {
            useNativeDriver: false,
            listener: handleScroll,
          }
        )}
      />
      {renderPagination()}
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: width,
  },
  pagination: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.white,
    opacity: 0.5,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    opacity: 1,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});

export default ImageSwiper;
