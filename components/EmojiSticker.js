import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { View } from "react-native";

export default function EmojiSticker({ imageSize, stickerSource }) {
  const tranlateX = useSharedValue(0);
  const tranlateY = useSharedValue(0);
  const scaleImage = useSharedValue(imageSize);

  const drag = Gesture.Pan().onChange((event) => {
    tranlateX.value += event.changeX;
    tranlateY.value += event.changeY;
  });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      if (scaleImage.value !== imageSize * 2) {
        scaleImage.value = scaleImage.value * 2;
      }
    });

  const containerStyle = useAnimatedStyle(() => {
    // hook to return an array of transforms.
    return {
      transform: [
        {
          translateX: tranlateX.value,
        },
        {
          translateY: tranlateY.value,
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
      <Animated.View style={[containerStyle, { top: -350 }]}>
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
