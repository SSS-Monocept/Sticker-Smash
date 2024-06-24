import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export default function EmojiSticker({
  imageSize,
  stickerSource,
  containerDimensions,
}) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scaleImage = useSharedValue(imageSize);

  const drag = Gesture.Pan().onChange((event) => {
    const newX = translateX.value + event.changeX;
    const newY = translateY.value + event.changeY;

    // Boundary checks
    const maxX = containerDimensions.width - scaleImage.value;
    const maxY = containerDimensions.height - scaleImage.value;

    if (newX >= 0 && newX <= maxX) {
      translateX.value = newX;
    }
    if (newY >= 0 && newY <= maxY) {
      translateY.value = newY;
    }
  });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      if (scaleImage.value !== imageSize * 2) {
        scaleImage.value = scaleImage.value * 2;
      } else {
        scaleImage.value = scaleImage.value / 2;
      }
    });

  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
        {
          translateY: translateY.value,
        },
      ],
    };
  });

  const imageStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(scaleImage.value),
      height: withSpring(scaleImage.value),
    };
  });

  return (
    <GestureDetector gesture={drag}>
      <Animated.View style={[containerStyle, { top: -440 }]}>
        <GestureDetector gesture={doubleTap}>
          <Animated.Image
            source={stickerSource}
            resizeMode="contain"
            style={[imageStyle, { width: imageSize, height: imageSize }]}
          />
        </GestureDetector>
      </Animated.View>
    </GestureDetector>
  );
}
