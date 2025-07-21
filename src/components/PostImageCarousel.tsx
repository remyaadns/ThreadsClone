// import React from 'react';
// import { View, Dimensions, Pressable } from 'react-native';
// import { useSharedValue } from 'react-native-reanimated';
// import Carousel from 'react-native-reanimated-carousel';
// import SupabaseImage from './SupabaseImage';

// const { width: screenWidth } = Dimensions.get('window');

// interface PostImageCarouselProps {
//   images: string[];
//   context?: 'feed' | 'detail';
// }

// export default function PostImageCarousel({ 
//   images, 
//   context = 'feed' 
// }: PostImageCarouselProps) {
//   const progress = useSharedValue<number>(0);

//   // If only one image, display it normally without carousel
//   if (images.length === 1) {
//     return (
//       <Pressable 
//         className="mt-2"
//         onPress={(e) => {
//           // Prevent single image clicks from navigating to post details
//           e.stopPropagation();
//         }}
//       >
//         <SupabaseImage
//           bucket="media"
//           path={images[0]}
//           className="w-full aspect-square rounded-lg"
//         />
//       </Pressable>
//     );
//   }

//   // Calculate carousel width based on context
//   const getCarouselWidth = () => {
//     if (context === 'detail') {
//       return screenWidth;
//     }
//     // For feed context, use full width minus padding
//     return screenWidth - 32; // Accounting for padding
//   };

//   // Configure parallax settings based on context
//   const getParallaxConfig = () => {
//     if (context === 'detail') {
//       return {
//         parallaxScrollingScale: 0.9,
//         parallaxScrollingOffset: 50,
//       };
//     }
//     // More subtle parallax for feed
//     return {
//       parallaxScrollingScale: 0.95,
//       parallaxScrollingOffset: 30,
//     };
//   };

//   const carouselWidth = getCarouselWidth();
//   const parallaxConfig = getParallaxConfig();

//   const renderItem = ({ item }: { item: string }) => (
//     <Pressable 
//       className="flex-1 px-1"
//       onPress={(e) => {
//         // Prevent event from bubbling up to parent Link
//         e.stopPropagation();
//       }}
//     >
//       <SupabaseImage
//         bucket="media"
//         path={item}
//         className="w-full aspect-square rounded-lg"
//       />
//     </Pressable>
//   );

//   return (
//     <Pressable 
//       className="mt-2"
//       onPress={(e) => {
//         // Prevent carousel area clicks from navigating
//         e.stopPropagation();
//       }}
//     >
//       <Carousel
//         data={images}
//         height={carouselWidth} // Square aspect ratio
//         loop={false}
//         pagingEnabled={true}
//         snapEnabled={true}
//         width={carouselWidth}
//         style={{ width: carouselWidth }}
//         mode="parallax"
//         modeConfig={parallaxConfig}
//         onProgressChange={progress}
//         renderItem={renderItem}
//         panGestureHandlerProps={{
//           activeOffsetX: [-10, 10],
//         }}
//       />
      
//       {/* Image indicator dots */}
//       <View className="flex-row justify-center mt-2 gap-1">
//         {images.map((_, index) => (
//           <View
//             key={index}
//             className={`w-1.5 h-1.5 rounded-full ${
//               index === Math.round(progress.value) 
//                 ? 'bg-white' 
//                 : 'bg-gray-600'
//             }`}
//           />
//         ))}
//       </View>
//     </Pressable>
//   );
// }



// updated PostImageCarousel component to handle details 
import React from 'react';
import { View, Dimensions, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import SupabaseImage from './SupabaseImage';

const { width: screenWidth } = Dimensions.get('window');

interface PostImageCarouselProps {
  images: string[];
  context?: 'feed' | 'detail';
}

export default function PostImageCarousel({ 
  images, 
  context = 'feed' 
}: PostImageCarouselProps) {
  const progress = useSharedValue<number>(0);

  // If only one image, display it normally without carousel
  if (images.length === 1) {
    return (
      <Pressable 
        className="mt-2"
        onPress={(e) => {
          // Prevent single image clicks from navigating to post details
          e.stopPropagation();
        }}
      >
        <SupabaseImage
          bucket="media"
          path={images[0]}
          className={`w-full rounded-lg ${
            context === 'detail' ? 'h-[500px]' : 'aspect-square'
          }`}
        />
      </Pressable>
    );
  }

  // Calculate carousel width based on context
  const getCarouselWidth = () => {
    if (context === 'detail') {
      return screenWidth;
    }
    // For feed context, use full width minus padding
    return screenWidth - 32; // Accounting for padding
  };

  // Configure parallax settings based on context
  const getParallaxConfig = () => {
    if (context === 'detail') {
      return {
        parallaxScrollingScale: 0.9,
        parallaxScrollingOffset: 50,
      };
    }
    // More subtle parallax for feed
    return {
      parallaxScrollingScale: 0.95,
      parallaxScrollingOffset: 30,
    };
  };

  // Calculate height based on context
  const getCarouselHeight = () => {
    if (context === 'detail') {
      return 400; // Taller for detail view
    }
    return carouselWidth; // Square for feed
  };

  const carouselWidth = getCarouselWidth();
  const carouselHeight = getCarouselHeight();
  const parallaxConfig = getParallaxConfig();

  const renderItem = ({ item }: { item: string }) => (
    <Pressable 
      className="flex-1 px-1"
      onPress={(e) => {
        // Prevent event from bubbling up to parent Link
        e.stopPropagation();
      }}
    >
      <SupabaseImage
        bucket="media"
        path={item}
        className={`w-full rounded-lg ${
          context === 'detail' ? 'h-[400px]' : 'aspect-square'
        }`}
      />
    </Pressable>
  );

  return (
    <Pressable 
      className="mt-2"
      onPress={(e) => {
        // Prevent carousel area clicks from navigating
        e.stopPropagation();
      }}
    >
      <Carousel
        data={images}
        height={carouselHeight}
        loop={false}
        pagingEnabled={true}
        snapEnabled={true}
        width={carouselWidth}
        style={{ width: carouselWidth }}
        mode="parallax"
        modeConfig={parallaxConfig}
        onProgressChange={progress}
        renderItem={renderItem}
      />
      
      <View className="flex-row justify-center mt-2 gap-1">
  {images.map((_, index) => {
    const animatedStyle = useAnimatedStyle(() => {
      const isActive = index === Math.round(progress.value);
      return {
        backgroundColor: isActive ? '#ffffff' : '#4b5563',
      };
    });

    return (
      <Animated.View
        key={index}
        className="w-1.5 h-1.5 rounded-full"
        style={animatedStyle}
      />
    );
  })}
</View>
    </Pressable>
  );
}