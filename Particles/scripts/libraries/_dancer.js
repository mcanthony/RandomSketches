/*
 * dancer - v0.4.0 - 2014-02-01
 * https://github.com/jsantell/dancer.js
 * Copyright (c) 2014 Jordan Santell
 * Licensed MIT
 */
function FourierTransform(a,b){this.bufferSize=a,this.sampleRate=b,this.bandwidth=2/a*b/2,this.spectrum=new Float32Array(a/2),this.real=new Float32Array(a),this.imag=new Float32Array(a),this.peakBand=0,this.peak=0,this.getBandFrequency=function(a){return this.bandwidth*a+this.bandwidth/2},this.calculateSpectrum=function(){for(var b,c,d,e=this.spectrum,f=this.real,g=this.imag,h=2/this.bufferSize,i=Math.sqrt,j=0,k=a/2;k>j;j++)b=f[j],c=g[j],d=h*i(b*b+c*c),d>this.peak&&(this.peakBand=j,this.peak=d),e[j]=d}}function FFT(a,b){FourierTransform.call(this,a,b),this.reverseTable=new Uint32Array(a);for(var c,d=1,e=a>>1;a>d;){for(c=0;d>c;c++)this.reverseTable[c+d]=this.reverseTable[c]+e;d<<=1,e>>=1}for(this.sinTable=new Float32Array(a),this.cosTable=new Float32Array(a),c=0;a>c;c++)this.sinTable[c]=Math.sin(-Math.PI/c),this.cosTable[c]=Math.cos(-Math.PI/c)}!function(){function a(){for(var a in this.sections)this.sections[a].condition()&&this.sections[a].callback.call(this)}var b=function(){this.audioAdapter=b._getAdapter(this),this.events={},this.sections=[],this.bind("update",a)};b.version="0.3.2",b.adapters={},b.prototype={load:function(a){return a instanceof HTMLElement?(this.source=a,"flash"===b.isSupported()&&(this.source={src:b._getMP3SrcFromAudio(a)})):(this.source=window.Audio?new Audio:{},this.source.src=b._makeSupportedPath(a.src,a.codecs)),this.audio=this.audioAdapter.load(this.source),this},play:function(){return this.audioAdapter.play(),this},pause:function(){return this.audioAdapter.pause(),this},setVolume:function(a){return this.audioAdapter.setVolume(a),this},createKick:function(a){return new b.Kick(this,a)},bind:function(a,b){return this.events[a]||(this.events[a]=[]),this.events[a].push(b),this},unbind:function(a){return this.events[a]&&delete this.events[a],this},trigger:function(a){var b=this;return this.events[a]&&this.events[a].forEach(function(a){a.call(b)}),this},getVolume:function(){return this.audioAdapter.getVolume()},getProgress:function(){return this.audioAdapter.getProgress()},getTime:function(){return this.audioAdapter.getTime()},getFrequency:function(a,b){var c=0;if(void 0!==b){for(var d=a;b>=d;d++)c+=this.getSpectrum()[d];return c/(b-a+1)}return this.getSpectrum()[a]},getWaveform:function(){return this.audioAdapter.getWaveform()},getSpectrum:function(){return this.audioAdapter.getSpectrum()},isLoaded:function(){return this.audioAdapter.isLoaded},isPlaying:function(){return this.audioAdapter.isPlaying},after:function(a,b){var c=this;return this.sections.push({condition:function(){return c.getTime()>a},callback:b}),this},before:function(a,b){var c=this;return this.sections.push({condition:function(){return c.getTime()<a},callback:b}),this},between:function(a,b,c){var d=this;return this.sections.push({condition:function(){return d.getTime()>a&&d.getTime()<b},callback:c}),this},onceAt:function(a,b){var c=this,d=null;return this.sections.push({condition:function(){return c.getTime()>a&&!this.called},callback:function(){b.call(this),d.called=!0},called:!1}),d=this.sections[this.sections.length-1],this}},window.Dancer=b}(),function(a){function b(){var a=!!(navigator.vendor||"").match(/Apple/),b=navigator.userAgent.match(/Version\/([^ ]*)/);return b=b?parseFloat(b[1]):0,a&&6>=b}var c={mp3:"audio/mpeg;",ogg:'audio/ogg; codecs="vorbis"',wav:'audio/wav; codecs="1"',aac:'audio/mp4; codecs="mp4a.40.2"'},d=document.createElement("audio");a.options={},a.setOptions=function(b){for(var c in b)b.hasOwnProperty(c)&&(a.options[c]=b[c])},a.isSupported=function(){return window.Float32Array&&window.Uint32Array?b()||!window.AudioContext&&!window.webkitAudioContext?d&&d.mozSetup?"audiodata":FlashDetect.versionAtLeast(9)?"flash":"":"webaudio":null},a.canPlay=function(b){d.canPlayType;return!!("flash"===a.isSupported()?"mp3"===b.toLowerCase():d.canPlayType&&d.canPlayType(c[b.toLowerCase()]).replace(/no/,""))},a.addPlugin=function(b,c){void 0===a.prototype[b]&&(a.prototype[b]=c)},a._makeSupportedPath=function(b,c){if(!c)return b;for(var d=0;d<c.length;d++)if(a.canPlay(c[d]))return b+"."+c[d];return b},a._getAdapter=function(b){switch(a.isSupported()){case"webaudio":return new a.adapters.webaudio(b);case"audiodata":return new a.adapters.moz(b);case"flash":return new a.adapters.flash(b);default:return null}},a._getMP3SrcFromAudio=function(a){var b=a.children;if(a.src)return a.src;for(var c=b.length;c--;)if((b[c].type||"").match(/audio\/mpeg/))return b[c].src;return null}}(window.Dancer),function(a){var b=function(b,c){c=c||{},this.dancer=b,this.frequency=c.frequency!==a?c.frequency:[0,10],this.threshold=c.threshold!==a?c.threshold:.3,this.decay=c.decay!==a?c.decay:.02,this.onKick=c.onKick,this.offKick=c.offKick,this.isOn=!1,this.currentThreshold=this.threshold;var d=this;this.dancer.bind("update",function(){d.onUpdate()})};b.prototype={on:function(){return this.isOn=!0,this},off:function(){return this.isOn=!1,this},set:function(b){b=b||{},this.frequency=b.frequency!==a?b.frequency:this.frequency,this.threshold=b.threshold!==a?b.threshold:this.threshold,this.decay=b.decay!==a?b.decay:this.decay,this.onKick=b.onKick||this.onKick,this.offKick=b.offKick||this.offKick},onUpdate:function(){if(this.isOn){var a=this.maxAmplitude(this.frequency);a>=this.currentThreshold&&a>=this.threshold?(this.currentThreshold=a,this.onKick&&this.onKick.call(this.dancer,a)):(this.offKick&&this.offKick.call(this.dancer,a),this.currentThreshold-=this.decay)}},maxAmplitude:function(a){var b=0,c=this.dancer.getSpectrum();if(!a.length)return a<c.length?c[~~a]:null;for(var d=a[0],e=a[1];e>=d;d++)c[d]>b&&(b=c[d]);return b}},window.Dancer.Kick=b}(),function(){function a(){this.source=this.context.createMediaElementSource(this.audio),this.source.connect(this.proc),this.source.connect(this.gain),this.gain.connect(this.context.destination),this.proc.connect(this.context.destination),this.isLoaded=!0,this.progress=1,this.dancer.trigger("loaded")}var b=2048,c=44100,d=function(a){this.dancer=a,this.audio=new Audio,this.context=window.AudioContext?new window.AudioContext:new window.webkitAudioContext};d.prototype={load:function(d){var e=this;return this.audio=d,this.isLoaded=!1,this.progress=0,this.context.createScriptProcessor||(this.context.createScriptProcessor=this.context.createJavascriptNode),this.proc=this.context.createScriptProcessor(b/2,1,1),this.proc.onaudioprocess=function(a){e.update.call(e,a)},this.context.createGain||(this.context.createGain=this.context.createGainNode),this.gain=this.context.createGain(),this.fft=new FFT(b/2,c),this.signal=new Float32Array(b/2),this.audio.readyState<3?this.audio.addEventListener("canplay",function(){a.call(e)}):a.call(e),this.audio.addEventListener("progress",function(a){a.currentTarget.duration&&(e.progress=a.currentTarget.seekable.end(0)/a.currentTarget.duration)}),this.audio},play:function(){this.audio.play(),this.isPlaying=!0},pause:function(){this.audio.pause(),this.isPlaying=!1},setVolume:function(a){this.gain.gain.value=a},getVolume:function(){return this.gain.gain.value},getProgress:function(){return this.progress},getWaveform:function(){return this.signal},getSpectrum:function(){return this.fft.spectrum},getTime:function(){return this.audio.currentTime},update:function(a){if(this.isPlaying&&this.isLoaded){var c,d=[],e=a.inputBuffer.numberOfChannels,f=b/e,g=function(a,b){return a[c]+b[c]};for(c=e;c--;)d.push(a.inputBuffer.getChannelData(c));for(c=0;f>c;c++)this.signal[c]=e>1?d.reduce(g)/e:d[0][c];this.fft.forward(this.signal),this.dancer.trigger("update")}}},Dancer.adapters.webaudio=d}(),function(){function a(){this.fbLength=this.audio.mozFrameBufferLength,this.channels=this.audio.mozChannels,this.rate=this.audio.mozSampleRate,this.fft=new FFT(this.fbLength/this.channels,this.rate),this.signal=new Float32Array(this.fbLength/this.channels),this.isLoaded=!0,this.progress=1,this.dancer.trigger("loaded")}var b=function(a){this.dancer=a,this.audio=new Audio};b.prototype={load:function(b){var c=this;return this.audio=b,this.isLoaded=!1,this.progress=0,this.audio.readyState<3?this.audio.addEventListener("loadedmetadata",function(){a.call(c)},!1):a.call(c),this.audio.addEventListener("MozAudioAvailable",function(a){c.update(a)},!1),this.audio.addEventListener("progress",function(a){a.currentTarget.duration&&(c.progress=a.currentTarget.seekable.end(0)/a.currentTarget.duration)},!1),this.audio},play:function(){this.audio.play(),this.isPlaying=!0},pause:function(){this.audio.pause(),this.isPlaying=!1},setVolume:function(a){this.audio.volume=a},getVolume:function(){return this.audio.volume},getProgress:function(){return this.progress},getWaveform:function(){return this.signal},getSpectrum:function(){return this.fft.spectrum},getTime:function(){return this.audio.currentTime},update:function(a){if(this.isPlaying&&this.isLoaded){for(var b=0,c=this.fbLength/2;c>b;b++)this.signal[b]=(a.frameBuffer[2*b]+a.frameBuffer[2*b+1])/2;this.fft.forward(this.signal),this.dancer.trigger("update")}}},Dancer.adapters.moz=b}(),function(){function a(){var a=this;f=!0,b(Dancer.options.flashJS,function(){soundManager=new SoundManager,soundManager.flashVersion=9,soundManager.flash9Options.useWaveformData=!0,soundManager.useWaveformData=!0,soundManager.useHighPerformance=!0,soundManager.useFastPolling=!0,soundManager.multiShot=!1,soundManager.debugMode=!1,soundManager.debugFlash=!1,soundManager.url=Dancer.options.flashSWF,soundManager.onready(function(){e=!0,a.load()}),soundManager.ontimeout(function(){console.error("Error loading SoundManager2.swf")}),soundManager.beginDelayedInit()})}function b(a,b){var c=document.createElement("script"),d=document.getElementsByTagName("script")[0];c.type="text/javascript",c.src=a,c.onload=b,d.parentNode.insertBefore(c,d)}var c=1024,d=44100,e=!1,f=!1,g=.93,h=function(a){this.dancer=a,this.wave_L=[],this.wave_R=[],this.spectrum=[],window.SM2_DEFER=!0};h.prototype={load:function(b){var e=this;return this.path=b?b.src:this.path,this.isLoaded=!1,this.progress=0,!window.soundManager&&!f&&a.call(this),window.soundManager&&(this.audio=soundManager.createSound({id:"dancer"+Math.random(),url:this.path,stream:!0,autoPlay:!1,autoLoad:!0,whileplaying:function(){e.update()},whileloading:function(){e.progress=this.bytesLoaded/this.bytesTotal},onload:function(){e.fft=new FFT(c,d),e.signal=new Float32Array(c),e.waveform=new Float32Array(c),e.isLoaded=!0,e.progress=1,e.dancer.trigger("loaded")}}),this.dancer.audio=this.audio),this.audio},play:function(){this.audio.play(),this.isPlaying=!0},pause:function(){this.audio.pause(),this.isPlaying=!1},setVolume:function(a){this.audio.setVolume(100*a)},getVolume:function(){return this.audio.volume/100},getProgress:function(){return this.progress},getWaveform:function(){return this.waveform},getSpectrum:function(){return this.fft.spectrum},getTime:function(){return this.audio.position/1e3},update:function(){if(this.isPlaying||this.isLoaded){this.wave_L=this.audio.waveformData.left,this.wave_R=this.audio.waveformData.right;for(var a,b=0,c=this.wave_L.length;c>b;b++)a=parseFloat(this.wave_L[b])+parseFloat(this.wave_R[b]),this.waveform[2*b]=a/2,this.waveform[2*b+1]=a/2,this.signal[2*b]=a*g,this.signal[2*b+1]=a*g;this.fft.forward(this.signal),this.dancer.trigger("update")}}},Dancer.adapters.flash=h}(),FFT.prototype.forward=function(a){var b=this.bufferSize,c=this.cosTable,d=this.sinTable,e=this.reverseTable,f=this.real,g=this.imag,h=(this.spectrum,Math.floor(Math.log(b)/Math.LN2));if(Math.pow(2,h)!==b)throw"Invalid buffer size, must be a power of 2.";if(b!==a.length)throw"Supplied buffer is not the same size as defined FFT. FFT Size: "+b+" Buffer Size: "+a.length;var i,j,k,l,m,n,o,p,q,r=1;for(q=0;b>q;q++)f[q]=a[e[q]],g[q]=0;for(;b>r;){i=c[r],j=d[r],k=1,l=0;for(var s=0;r>s;s++){for(q=s;b>q;)m=q+r,n=k*f[m]-l*g[m],o=k*g[m]+l*f[m],f[m]=f[q]-n,g[m]=g[q]-o,f[q]+=n,g[q]+=o,q+=r<<1;p=k,k=p*i-l*j,l=p*j+l*i}r<<=1}return this.calculateSpectrum()};var FlashDetect=new function(){var a=this;a.installed=!1,a.raw="",a.major=-1,a.minor=-1,a.revision=-1,a.revisionStr="";var b=[{name:"ShockwaveFlash.ShockwaveFlash.7",version:function(a){return c(a)}},{name:"ShockwaveFlash.ShockwaveFlash.6",version:function(a){var b="6,0,21";try{a.AllowScriptAccess="always",b=c(a)}catch(d){}return b}},{name:"ShockwaveFlash.ShockwaveFlash",version:function(a){return c(a)}}],c=function(a){var b=-1;try{b=a.GetVariable("$version")}catch(c){}return b},d=function(a){var b=-1;try{b=new ActiveXObject(a)}catch(c){b={activeXError:!0}}return b},e=function(a){var b=a.split(",");return{raw:a,major:parseInt(b[0].split(" ")[1],10),minor:parseInt(b[1],10),revision:parseInt(b[2],10),revisionStr:b[2]}},f=function(a){var b=a.split(/ +/),c=b[2].split(/\./),d=b[3];return{raw:a,major:parseInt(c[0],10),minor:parseInt(c[1],10),revisionStr:d,revision:g(d)}},g=function(b){return parseInt(b.replace(/[a-zA-Z]/g,""),10)||a.revision};a.majorAtLeast=function(b){return a.major>=b},a.minorAtLeast=function(b){return a.minor>=b},a.revisionAtLeast=function(b){return a.revision>=b},a.versionAtLeast=function(){var b=[a.major,a.minor,a.revision],c=Math.min(b.length,arguments.length);for(i=0;c>i;i++){if(b[i]>=arguments[i]){if(c>i+1&&b[i]==arguments[i])continue;return!0}return!1}},a.FlashDetect=function(){if(navigator.plugins&&navigator.plugins.length>0){var c="application/x-shockwave-flash",g=navigator.mimeTypes;if(g&&g[c]&&g[c].enabledPlugin&&g[c].enabledPlugin.description){var h=g[c].enabledPlugin.description,i=f(h);a.raw=i.raw,a.major=i.major,a.minor=i.minor,a.revisionStr=i.revisionStr,a.revision=i.revision,a.installed=!0}}else if(-1==navigator.appVersion.indexOf("Mac")&&window.execScript)for(var h=-1,j=0;j<b.length&&-1==h;j++){var k=d(b[j].name);if(!k.activeXError&&(a.installed=!0,h=b[j].version(k),-1!=h)){var i=e(h);a.raw=i.raw,a.major=i.major,a.minor=i.minor,a.revision=i.revision,a.revisionStr=i.revisionStr}}}()};FlashDetect.JS_RELEASE="1.0.4";