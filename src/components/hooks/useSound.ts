// import { useEffect, useRef } from 'react';
// import { Audio } from 'expo-av';

// const useSound = (soundFile) => {
//   const soundObject = useRef(new Audio.Sound());

//   useEffect(() => {
//     const loadSound = async () => {
//       try {
//         await soundObject.current.loadAsync({ uri: soundFile });
//       } catch (error) {
//         console.error('Error loading sound:', error);
//       }
//     };

//     loadSound();

//     return () => {
//       soundObject.current.unloadAsync();
//     };
//   }, [soundFile]);

//   const playSound = async () => {
//     try {
//       await soundObject.current.replayAsync();
//     } catch (error) {
//       console.error('Error playing sound:', error);
//     }
//   };

//   return playSound;
// };

// export default useSound;
