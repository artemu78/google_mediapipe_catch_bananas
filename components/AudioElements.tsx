import React from 'react';
import { CATCH_SOUND, LEVEL_UP_SOUND, MISS_SOUND } from '../hooks/useAudio';

interface AudioElementsProps {
  audioRefs: {
    catchSoundRef: React.RefObject<HTMLAudioElement>;
    levelUpSoundRef: React.RefObject<HTMLAudioElement>;
    missSoundRef: React.RefObject<HTMLAudioElement>;
  };
}

const AudioElements: React.FC<AudioElementsProps> = ({ audioRefs }) => {
  return (
    <>
      <audio ref={audioRefs.catchSoundRef} src={CATCH_SOUND} preload="auto"></audio>
      <audio ref={audioRefs.levelUpSoundRef} src={LEVEL_UP_SOUND} preload="auto"></audio>
      <audio ref={audioRefs.missSoundRef} src={MISS_SOUND} preload="auto"></audio>
    </>
  );
};

export default AudioElements;
