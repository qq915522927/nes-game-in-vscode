import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NesService {

SCREEN_WIDTH = 256;
SCREEN_HEIGHT = 240;
FRAMEBUFFER_SIZE = this.SCREEN_WIDTH * this.SCREEN_HEIGHT;

canvas_ctx; 
image;
framebuffer_u8;
framebuffer_u32;

AUDIO_BUFFERING = 512;
SAMPLE_COUNT = 4 * 1024;
SAMPLE_MASK = this.SAMPLE_COUNT - 1;
audio_samples_L = new Float32Array(this.SAMPLE_COUNT);
audio_samples_R = new Float32Array(this.SAMPLE_COUNT);
audio_write_cursor = 0;
audio_read_cursor = 0;

  constructor() { }
}
