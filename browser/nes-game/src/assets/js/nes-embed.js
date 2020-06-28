


var SCREEN_WIDTH = 256;
var SCREEN_HEIGHT = 240;
var FRAMEBUFFER_SIZE = SCREEN_WIDTH * SCREEN_HEIGHT;

var canvas_ctx, image;
var framebuffer_u8, framebuffer_u32;

var AUDIO_BUFFERING = 512;
var SAMPLE_COUNT = 4 * 1024;
var SAMPLE_MASK = SAMPLE_COUNT - 1;
var audio_samples_L = new Float32Array(SAMPLE_COUNT);
var audio_samples_R = new Float32Array(SAMPLE_COUNT);
var audio_write_cursor = 0, audio_read_cursor = 0;

var player = 1;

var nes = new jsnes.NES({
	onFrame: function (framebuffer_24) {
		for (var i = 0; i < FRAMEBUFFER_SIZE; i++) framebuffer_u32[i] = 0xFF000000 | framebuffer_24[i];
	},
	onAudioSample: function (l, r) {
		audio_samples_L[audio_write_cursor] = l;
		audio_samples_R[audio_write_cursor] = r;
		audio_write_cursor = (audio_write_cursor + 1) & SAMPLE_MASK;
	},
});


function onAnimationFrame() {
	window.requestAnimationFrame(onAnimationFrame);

	image.data.set(framebuffer_u8);
	canvas_ctx.putImageData(image, 0, 0);
	nes.frame();
}

function audio_remain() {
	return (audio_write_cursor - audio_read_cursor) & SAMPLE_MASK;
}

function audio_callback(event) {
	var dst = event.outputBuffer;
	var len = dst.length;

	// Attempt to avoid buffer underruns.
	if (audio_remain() < AUDIO_BUFFERING) nes.frame();

	var dst_l = dst.getChannelData(0);
	var dst_r = dst.getChannelData(1);
	for (var i = 0; i < len; i++) {
		var src_idx = (audio_read_cursor + i) & SAMPLE_MASK;
		dst_l[i] = audio_samples_L[src_idx];
		dst_r[i] = audio_samples_R[src_idx];
	}

	audio_read_cursor = (audio_read_cursor + len) & SAMPLE_MASK;
}

function keyboardDown(event) {
	var player = 1;
	callback = nes.buttonDown
	switch (event.keyCode) {
		case 87: // w => up
			callback(player, jsnes.Controller.BUTTON_UP); break;
		case 83: // s => down
			callback(player, jsnes.Controller.BUTTON_DOWN); break;
		case 65: // a => left
			callback(player, jsnes.Controller.BUTTON_LEFT); break;
		case 68: // d => right
			callback(player, jsnes.Controller.BUTTON_RIGHT); break;
		case 75: // 'k' => A
			callback(player, jsnes.Controller.BUTTON_A); break;
		case 85: // 'i' => X
			clickXYDown('Y'); break;
		case 74: // 'j' => B
			callback(player, jsnes.Controller.BUTTON_B); break;
		case 73: // 'u' => Y
			clickXYDown('X'); break;
		case 84: // t => select
			callback(player, jsnes.Controller.BUTTON_SELECT); break;
		case 32: // Space => start
			callback(player, jsnes.Controller.BUTTON_START); break;
		default: break;
	}
}

var selfInterval;

function clickXYUp() {
	console.log('XY UP')
	down = false;
	pressDownflag = false;
	if(selfInterval) {
		clearInterval(selfInterval)
		selfInterval = null
	}
	nesButtonUp(jsnes.Controller.BUTTON_A, player)
	nesButtonUp(jsnes.Controller.BUTTON_B, player)
}
var pressDownflag = true;
var down = false;
function clickXYDown(key) {
	if(key == 'X') {
		console.log("press X")
		if(!down) {
			nesButtonDown(jsnes.Controller.BUTTON_A, player)
			selfInterval = setInterval(() => {
				// change flag
				pressDownflag = !pressDownflag;
				if(pressDownflag) {
				nesButtonDown(jsnes.Controller.BUTTON_A, player)
				nesButtonDown(jsnes.Controller.BUTTON_A, player)

				} else {
				nesButtonUp(jsnes.Controller.BUTTON_A, player)

				}
				// nesButtonDown(jsnes.Controller.BUTTON_A, player)
			}, 50)

		}
	} else if (key == 'Y') {
		selfInterval = setInterval(() => {
			console.log('Y DOWN')
			nesButtonDown(jsnes.Controller.BUTTON_B, player)
		}, 500)
	}
	down = true;
}
function keyboardUp(event) {
	callback = nes.buttonUp
	switch (event.keyCode) {
		case 87: // w => up
			callback(player, jsnes.Controller.BUTTON_UP); break;
		case 83: // s => down
			callback(player, jsnes.Controller.BUTTON_DOWN); break;
		case 65: // a => left
			callback(player, jsnes.Controller.BUTTON_LEFT); break;
		case 68: // d => right
			callback(player, jsnes.Controller.BUTTON_RIGHT); break;
		case 75: // 'k' => A
			callback(player, jsnes.Controller.BUTTON_A); break;
		case 85:
			clickXYUp(); break;
		case 74: // 'j' => B
			callback(player, jsnes.Controller.BUTTON_B); break;
		case 73:
			clickXYUp(); break;
		case 84: // t => select
			callback(player, jsnes.Controller.BUTTON_SELECT); break;
		case 32: // Space => start
			callback(player, jsnes.Controller.BUTTON_START); break;
		default: break;
	}

}

function nes_init(canvas_id) {
	var canvas = document.getElementById(canvas_id);
	canvas_ctx = canvas.getContext("2d");
	image = canvas_ctx.getImageData(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

	canvas_ctx.fillStyle = "black";
	canvas_ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

	// Allocate framebuffer array.
	var buffer = new ArrayBuffer(image.data.length);
	framebuffer_u8 = new Uint8ClampedArray(buffer);
	framebuffer_u32 = new Uint32Array(buffer);

	// Setup audio.
	var audio_ctx = new window.AudioContext();
	var script_processor = audio_ctx.createScriptProcessor(AUDIO_BUFFERING, 0, 2);
	script_processor.onaudioprocess = audio_callback;
	script_processor.connect(audio_ctx.destination);
}

function nes_boot(rom_data) {
	nes.loadROM(rom_data);
	window.requestAnimationFrame(onAnimationFrame);
}

function nes_load_data(canvas_id, rom_data) {
	nes_init(canvas_id);
	nes_boot(rom_data);
}

function nes_load_url(canvas_id, path) {
	nes_init(canvas_id);
	var req = new XMLHttpRequest();

	req.open("GET", path);
	req.overrideMimeType("text/plain; charset=x-user-defined");
	req.onerror = () => {
		console.log(`Error loading ${path}: ${req.statusText}`);
	}

	req.onload = function () {
		if (this.status === 200) {
			nes_boot(this.responseText);
		} else if (this.status === 0) {
			// Aborted, so ignore error
		} else {
			req.onerror();
		}
	};

	req.send();
}

function nesButtonDown(key, playnum) {
	nes.buttonDown(playnum, key);
}
function nesButtonUp(key, playnum) {
	nes.buttonUp(playnum, key);
}
function nesButtonValue(key, value, playnum) {
	nes.buttonValue(playnum, key, value);
}

document.addEventListener('keydown', (event) => { keyboardDown(event) });
document.addEventListener('keyup', (event) => { keyboardUp(event) });
