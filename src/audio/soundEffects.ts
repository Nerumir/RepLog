import { createAudioPlayer } from 'expo-audio';

const players = {
  tap: createAudioPlayer(require('@/assets/sounds/tap.wav')),
  tick: createAudioPlayer(require('@/assets/sounds/tick.wav')),
  success: createAudioPlayer(require('@/assets/sounds/success.wav')),
  fanfare: createAudioPlayer(require('@/assets/sounds/fanfare.wav')),
  error: createAudioPlayer(require('@/assets/sounds/error.wav')),
  achievement: createAudioPlayer(require('@/assets/sounds/achievement.wav')),
};

function replay(player: (typeof players)[keyof typeof players]) {
  player.seekTo(0);
  player.play();
}

export function playTap() {
  replay(players.tap);
}

export function playTick() {
  replay(players.tick);
}

export function playSuccess() {
  replay(players.success);
}

export function playFanfare() {
  replay(players.fanfare);
}

export function playError() {
  replay(players.error);
}

export function playAchievement() {
  replay(players.achievement);
}
