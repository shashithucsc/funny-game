import wave
import math
import struct
import os
import random

def generate_wav(filename, duration, gen_sample_func):
    sample_rate = 44100
    num_samples = int(duration * sample_rate)
    
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1) # mono
        wav_file.setsampwidth(2) # 16-bit
        wav_file.setframerate(sample_rate)
        
        for i in range(num_samples):
            t = i / sample_rate
            sample = gen_sample_func(t, num_samples, i)
            # clamp and convert to 16-bit int
            sample = max(-1.0, min(1.0, sample))
            wav_file.writeframes(struct.pack('h', int(sample * 32767)))

# 1. Collect (Ding) - nice and relaxing
def collect_sound(t, total_samples, i):
    # Base freq 880 (A5), rising to 1200
    freq = 880 + (400 * (t / 0.3))
    # Decay envelope
    envelope = math.exp(-t * 15)
    return 0.5 * envelope * math.sin(2 * math.pi * freq * t)

# 2. Jump (Swoosh)
def jump_sound(t, total_samples, i):
    # Freq rising from 300 to 600
    freq = 300 + (300 * (t / 0.4))
    envelope = math.exp(-t * 10)
    return 0.4 * envelope * math.sin(2 * math.pi * freq * t)

# 3. Hit (Thud)
def hit_sound(t, total_samples, i):
    # Low freq dropping
    freq = 150 - (100 * (t / 0.5))
    envelope = math.exp(-t * 12)
    # Add some noise
    noise = random.uniform(-1, 1)
    return 0.5 * envelope * (math.sin(2 * math.pi * freq * t) * 0.7 + noise * 0.3)

if __name__ == '__main__':
    generate_wav('public/assets/sfx/collect.wav', 0.4, collect_sound)
    generate_wav('public/assets/sfx/jump.wav', 0.4, jump_sound)
    generate_wav('public/assets/sfx/hit.wav', 0.5, hit_sound)
    print("Generated SFX.")
