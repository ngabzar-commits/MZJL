import { Component, ElementRef, ViewChild, AfterViewInit, signal, inject, computed, effect, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { JapaneseDataService } from '../services/data.service';
import { WritingDataService } from '../services/writing-data.service';
import { Kanji, Kana } from '../types';

@Component({
  selector: 'app-writing',
  imports: [CommonModule, RouterLink, FormsModule],
  styles: [`
    /* Scoped SVG Styles for Writing Canvas Only */
    :host ::ng-deep .writing-area svg {
      width: 100%;
      height: 100%;
      overflow: visible;
    }
    
    /* Layer 2: Guide (Shadow/Bayangan) Styles */
    :host ::ng-deep .guide-layer path {
      fill: none;
      stroke: #334155; /* Slate-700 */
      stroke-width: 10px;
      stroke-linecap: round;
      stroke-linejoin: round;
      opacity: 0.2;
    }
    :host ::ng-deep .guide-layer text { display: none; }

    /* Layer 3: Tutorial Animation Styles */
    :host ::ng-deep .anim-layer path {
      fill: none;
      stroke: #c084fc; /* Purple-400 */
      stroke-width: 10px;
      stroke-linecap: round;
      stroke-linejoin: round;
      filter: drop-shadow(0 0 2px rgba(192, 132, 252, 0.6));
    }
    
    /* Stroke Numbers */
    :host ::ng-deep .anim-layer text { 
      fill: #fbbf24; /* Amber-400 */
      font-size: 5px;
      font-family: sans-serif;
      font-weight: 800;
      opacity: 0.8;
      stroke: none;
    }
  `],
  template: `
    <div class="min-h-screen bg-slate-950 pb-20 overflow-hidden">
      <!-- Header -->
      <div class="p-4 border-b border-slate-800 flex items-center gap-4 sticky top-0 bg-slate-950 z-20">
        <a routerLink="/" class="text-slate-400 hover:text-white transition-colors">
           <!-- Tombol Kembali Normal (w-6 h-6) -->
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </a>
        <h1 class="text-xl font-bold text-purple-400">Latihan Menulis</h1>
      </div>

      <div class="p-4 flex flex-col items-center">
        
        <!-- Category Tabs -->
        <div class="flex w-full bg-slate-900 p-1 rounded-xl mb-4">
          <button (click)="setCategory('HIRAGANA')" 
            [class]="category() === 'HIRAGANA' ? 'flex-1 py-2 bg-purple-600 text-white rounded-lg font-medium transition text-sm' : 'flex-1 py-2 text-slate-400 hover:text-white transition text-sm'">
            Hiragana
          </button>
          <button (click)="setCategory('KATAKANA')" 
            [class]="category() === 'KATAKANA' ? 'flex-1 py-2 bg-purple-600 text-white rounded-lg font-medium transition text-sm' : 'flex-1 py-2 text-slate-400 hover:text-white transition text-sm'">
            Katakana
          </button>
          <button (click)="setCategory('KANJI')" 
            [class]="category() === 'KANJI' ? 'flex-1 py-2 bg-purple-600 text-white rounded-lg font-medium transition text-sm' : 'flex-1 py-2 text-slate-400 hover:text-white transition text-sm'">
            Kanji
          </button>
        </div>

        <!-- Kanji Level Selector -->
        @if (category() === 'KANJI') {
          <div class="flex w-full gap-2 mb-4 animate-in slide-in-from-top-2 duration-200">
            <button (click)="setKanjiLevel('N5')" 
              [class]="kanjiLevel() === 'N5' ? 'flex-1 py-1.5 bg-slate-800 border border-purple-500 text-purple-300 rounded-lg text-sm font-medium' : 'flex-1 py-1.5 bg-slate-900 border border-slate-800 text-slate-500 rounded-lg text-sm hover:bg-slate-800'">
              Level N5
            </button>
            <button (click)="setKanjiLevel('N4')" 
              [class]="kanjiLevel() === 'N4' ? 'flex-1 py-1.5 bg-slate-800 border border-purple-500 text-purple-300 rounded-lg text-sm font-medium' : 'flex-1 py-1.5 bg-slate-900 border border-slate-800 text-slate-500 rounded-lg text-sm hover:bg-slate-800'">
              Level N4
            </button>
          </div>
        }

        <!-- WRITING AREA CONTAINER -->
        <div class="writing-area relative w-[300px] h-[300px] bg-slate-900 rounded-2xl border-2 border-slate-800 overflow-hidden touch-none shadow-2xl mb-4">
           
           <!-- LAYER 0: Info Header (Meaning/Readings) -->
           <!-- PENTING: z-50 agar tetap di atas overlay tutorial (z-20) sehingga teks tidak pudar -->
           <div class="absolute top-0 left-0 right-0 p-3 z-50 flex flex-col items-center pointer-events-none bg-gradient-to-b from-slate-900/80 to-transparent">
              @if (charInfo(); as info) {
                @if (info.type === 'KANJI') {
                  <div class="text-blue-300 font-bold text-lg leading-none mb-1 drop-shadow-md">{{ info.data.meaning }}</div>
                  <div class="flex gap-3 text-[10px] bg-slate-950/60 px-2 py-1 rounded-full border border-slate-700/50 backdrop-blur-[1px]">
                    @if (info.data.onyomi.length > 0) {
                      <span class="text-slate-400">ON: <span class="text-cyan-300 font-bold">{{ info.data.onyomi[0] }}</span></span>
                    }
                    @if (info.data.kunyomi.length > 0) {
                      <span class="text-slate-400">KUN: <span class="text-rose-300 font-bold">{{ info.data.kunyomi[0] }}</span></span>
                    }
                  </div>
                } @else {
                  <div class="text-slate-300 font-mono text-xl font-bold tracking-[0.2em] opacity-80 drop-shadow-md">
                    {{ info.data.romaji.toUpperCase() }}
                  </div>
                }
              }
           </div>

           <!-- LAYER 1: Grid Lines -->
           <div class="absolute inset-0 pointer-events-none z-0">
             <div class="w-full h-1/2 border-b border-dashed border-slate-700/50"></div>
             <div class="h-full w-1/2 border-r border-dashed border-slate-700/50 absolute top-0"></div>
           </div>

           <!-- LAYER 2: Guide Character (Shadow/Bayangan) -->
           <div class="absolute inset-0 p-4 pointer-events-none z-10 flex items-center justify-center guide-layer">
              @if (currentSvgContent) {
                <div [innerHTML]="currentSvgContent" class="w-full h-full"></div>
              } @else {
                <!-- Fallback Font -->
                <span class="text-[180px] font-serif text-slate-800 leading-none opacity-50 pt-8">{{ currentChar() }}</span>
              }
           </div>

           <!-- LAYER 3: Tutorial Animation -->
           @if (showTutorial() && currentSvgContent) {
             <div #animContainer class="absolute inset-0 p-4 pointer-events-none z-20 flex items-center justify-center anim-layer bg-slate-950/80 backdrop-blur-[2px]">
                <div [innerHTML]="currentSvgContent" class="w-full h-full"></div>
             </div>
           }

           <!-- LAYER 4: User Drawing Canvas -->
           <canvas #canvas class="absolute inset-0 w-full h-full cursor-crosshair z-30"
             (mousedown)="startDrawing($event)"
             (mousemove)="draw($event)"
             (mouseup)="stopDrawing()"
             (mouseleave)="stopDrawing()"
             (touchstart)="startDrawingTouch($event)"
             (touchmove)="drawTouch($event)"
             (touchend)="stopDrawing()"
           ></canvas>

           <!-- Loading Indicator -->
           @if (loadingVector()) {
             <div class="absolute top-4 right-4 z-40 bg-slate-900/80 p-2 rounded-full backdrop-blur-sm border border-slate-700">
               <div class="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
             </div>
           }
        </div>

        <!-- Navigation Buttons -->
        <div class="flex justify-between w-full max-w-[320px] mb-3">
            <button (click)="prevChar()" class="flex-1 mr-1 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 active:bg-slate-950 transition flex items-center justify-center gap-2 group">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 group-hover:-translate-x-1 transition-transform">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
                <span class="text-xs font-bold uppercase tracking-wider">Sebelumnya</span>
            </button>
            <button (click)="nextChar()" class="flex-1 ml-1 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 active:bg-slate-950 transition flex items-center justify-center gap-2 group">
                <span class="text-xs font-bold uppercase tracking-wider">Selanjutnya</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 group-hover:translate-x-1 transition-transform">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
            </button>
        </div>

        <!-- Controls Group -->
        <div class="flex gap-2 mb-6 w-full max-w-[320px]">
          <button (click)="clearCanvas()" class="flex-1 py-3 bg-slate-800 text-white rounded-xl font-bold text-xs sm:text-sm hover:bg-slate-700 border border-slate-700 transition active:scale-95">
            Hapus
          </button>
          
          <button (click)="toggleTutorial()" 
            [class]="showTutorial() ? 'flex-1 py-3 bg-purple-900/50 text-purple-300 rounded-xl font-bold text-xs sm:text-sm border border-purple-500 transition active:scale-95' : 'flex-1 py-3 bg-slate-800 text-purple-400 rounded-xl font-bold text-xs sm:text-sm hover:bg-slate-700 border border-purple-900/50 transition active:scale-95'">
            {{ showTutorial() ? 'Tutup' : 'Tutorial' }}
          </button>

           <button class="flex-1 py-3 bg-purple-600 text-white rounded-xl font-bold text-xs sm:text-sm hover:bg-purple-500 shadow-lg shadow-purple-900/20 transition active:scale-95">
            Simpan
          </button>
        </div>

        <div class="w-full border-t border-slate-800 my-2"></div>

        <!-- Character Selector List -->
        <div class="w-full">
          <div class="flex justify-between items-end mb-3 pl-1">
            <h3 class="text-slate-400 text-sm font-bold">Pilih Huruf:</h3>
            <div class="w-1/2">
                <input type="text" [(ngModel)]="searchQuery" placeholder="Cari..." 
                  class="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:border-purple-500 outline-none" />
            </div>
          </div>
          
          <div class="h-[240px] overflow-y-auto pr-1 no-scrollbar bg-slate-900/30 rounded-xl border border-slate-800/50 p-2">
            <div class="grid grid-cols-5 gap-2">
              @for(char of displayList(); track char) {
                <button (click)="selectChar(char)" 
                    [class]="currentChar() === char ? 'aspect-square flex items-center justify-center bg-purple-900/50 border-2 border-purple-500 rounded-lg text-white font-serif font-bold text-xl shadow-[0_0_10px_rgba(168,85,247,0.5)]' : 'aspect-square flex items-center justify-center bg-slate-900 border border-slate-800 rounded-lg text-slate-400 font-serif text-lg hover:bg-slate-800 hover:text-white transition'">
                    {{char}}
                </button>
              } @empty {
                <div class="col-span-5 text-center text-slate-500 text-xs py-4">Tidak ditemukan.</div>
              }
            </div>
          </div>
        </div>

      </div>
    </div>
  `
})
export class WritingComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('animContainer') animContainerRef!: ElementRef<HTMLDivElement>;
  
  private ctx!: CanvasRenderingContext2D;
  private isDrawing = false;
  private animationTimeouts: any[] = [];
  
  dataService = inject(JapaneseDataService);
  writingDataService = inject(WritingDataService);
  sanitizer = inject(DomSanitizer);

  category = signal<'HIRAGANA' | 'KATAKANA' | 'KANJI'>('HIRAGANA');
  kanjiLevel = signal<'N5' | 'N4'>('N5');
  currentChar = signal('あ');
  searchQuery = signal('');

  currentSvgContent: SafeHtml | null = null;
  loadingVector = signal(false);
  showTutorial = signal(false);

  // COMPUTED: Get Details for the Current Character
  charInfo = computed(() => {
    const c = this.currentChar();
    const cat = this.category();

    if (cat === 'KANJI') {
      const k = this.dataService.getKanji('ALL').find(x => x.char === c);
      return k ? { type: 'KANJI', data: k } : null;
    } else {
      // Find Kana Data (Search all groups)
      const groups = ['GOJUUON', 'DAKUON', 'HANDAKUON', 'YOON'] as const;
      for (const g of groups) {
         const found = this.dataService.getKana(cat, g).find(k => k.char === c);
         if (found) return { type: 'KANA', data: found };
      }
      return null;
    }
  });

  displayList = computed(() => {
    const cat = this.category();
    const query = this.searchQuery().toLowerCase().trim();
    let chars: string[] = [];

    if (cat === 'HIRAGANA') {
      chars = this.dataService.getKana('HIRAGANA', 'GOJUUON').map(k => k.char);
    } else if (cat === 'KATAKANA') {
      chars = this.dataService.getKana('KATAKANA', 'GOJUUON').map(k => k.char);
    } else {
      const level = this.kanjiLevel();
      chars = this.dataService.getKanji(level).map(k => k.char);
    }

    if (query) {
      // Simple filter: Check if char matches query
      // For Kanji, checking char is easy. Checking reading is harder without mapping here.
      // But for display list it's usually just chars.
      // If user types 'a', we might want to match 'あ'.
      // For simplicity in Writing Mode, just match the character itself.
      // Or extend logic to check romaji if available in full list data.
      
      // Better logic: Filter based on full data available
      if (cat === 'KANJI') {
         return this.dataService.getKanji(this.kanjiLevel())
           .filter(k => k.char.includes(query) || k.meaning.toLowerCase().includes(query))
           .map(k => k.char);
      } else {
         return this.dataService.getKana(cat, 'GOJUUON')
           .filter(k => k.char.includes(query) || k.romaji.includes(query))
           .map(k => k.char);
      }
    }

    return chars;
  });

  constructor() {
    effect(() => {
      // Auto select first match if search changes list and current is lost
      const list = this.displayList();
      if (list.length > 0 && !list.includes(this.currentChar())) {
        this.selectChar(list[0]);
      }
    }, { allowSignalWrites: true });
  }

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    // Set resolusi eksplisit agar tidak buram
    canvas.width = 300;
    canvas.height = 300;
    
    this.ctx = canvas.getContext('2d')!;
    this.ctx.strokeStyle = '#a855f7'; // Purple-500
    this.ctx.lineWidth = 10; 
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
  }

  ngOnDestroy() {
    this.clearAnimation();
  }

  setCategory(c: 'HIRAGANA' | 'KATAKANA' | 'KANJI') {
    this.category.set(c);
    this.searchQuery.set(''); // Clear search on category change
    this.closeTutorial();
  }

  setKanjiLevel(l: 'N5' | 'N4') {
    this.kanjiLevel.set(l);
    this.closeTutorial();
  }

  selectChar(c: string) {
    this.currentChar.set(c);
    this.clearCanvas();
    this.closeTutorial();
    this.fetchVector(c);
  }

  // Navigasi ke huruf sebelumnya
  prevChar() {
    const list = this.displayList();
    const curr = this.currentChar();
    const idx = list.indexOf(curr);
    
    if (list.length === 0) return;

    // Loop ke akhir jika di awal
    const newIdx = (idx - 1 + list.length) % list.length;
    this.selectChar(list[newIdx]);
  }

  // Navigasi ke huruf selanjutnya
  nextChar() {
    const list = this.displayList();
    const curr = this.currentChar();
    const idx = list.indexOf(curr);

    if (list.length === 0) return;

    // Loop ke awal jika di akhir
    const newIdx = (idx + 1) % list.length;
    this.selectChar(list[newIdx]);
  }

  clearCanvas() {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, 300, 300);
    }
  }

  async fetchVector(char: string) {
    this.loadingVector.set(true);
    this.currentSvgContent = null;

    // 1. Cek Database Lokal
    const localVector = this.writingDataService.getVector(char);
    if (localVector) {
      this.currentSvgContent = this.sanitizer.bypassSecurityTrustHtml(localVector);
      this.loadingVector.set(false);
      return;
    }

    // 2. Cek Remote (KanjiVG)
    const code = char.charCodeAt(0).toString(16).padStart(5, '0');
    const url = `https://cdn.jsdelivr.net/gh/KanjiVG/kanjiVg/kanji/${code}.svg`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Not found');
      
      let svgText = await response.text();
      
      // Bersihkan style bawaan SVG
      svgText = svgText.replace(/style="[^"]*"/g, '');
      svgText = svgText.replace(/stroke="[^"]*"/g, '');
      svgText = svgText.replace(/stroke-width="[^"]*"/g, '');
      
      this.currentSvgContent = this.sanitizer.bypassSecurityTrustHtml(svgText);
    } catch (e) {
      console.warn('Vector data not found for:', char);
      this.currentSvgContent = null;
    } finally {
      this.loadingVector.set(false);
    }
  }

  toggleTutorial() {
    this.showTutorial.update(v => !v);
    
    if (this.showTutorial()) {
      setTimeout(() => this.animateStrokes(), 50);
    } else {
      this.clearAnimation();
    }
  }

  closeTutorial() {
    this.showTutorial.set(false);
    this.clearAnimation();
  }

  clearAnimation() {
    this.animationTimeouts.forEach(t => clearTimeout(t));
    this.animationTimeouts = [];
  }

  animateStrokes() {
    this.clearAnimation();
    if (!this.animContainerRef) return;
    
    const svgPaths = this.animContainerRef.nativeElement.querySelectorAll('path');
    
    // Reset kondisi awal
    svgPaths.forEach((path: any) => {
      path.style.transition = 'none';
      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
    });

    let delay = 500;

    svgPaths.forEach((path: any) => {
      const length = path.getTotalLength();
      const duration = Math.min(Math.max(length * 5, 400), 1000);

      const timeout = setTimeout(() => {
        path.style.transition = `stroke-dashoffset ${duration}ms ease-out`;
        path.style.strokeDashoffset = '0';
      }, delay);
      
      this.animationTimeouts.push(timeout);
      delay += duration + 200;
    });
  }

  startDrawing(e: MouseEvent) {
    this.isDrawing = true;
    this.ctx.beginPath();
    this.ctx.moveTo(e.offsetX, e.offsetY);
  }

  draw(e: MouseEvent) {
    if (!this.isDrawing) return;
    this.ctx.lineTo(e.offsetX, e.offsetY);
    this.ctx.stroke();
  }

  startDrawingTouch(e: TouchEvent) {
    e.preventDefault();
    this.isDrawing = true;
    const touch = e.touches[0];
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    this.ctx.beginPath();
    this.ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
  }

  drawTouch(e: TouchEvent) {
    e.preventDefault();
    if (!this.isDrawing) return;
    const touch = e.touches[0];
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    this.ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
    this.ctx.stroke();
  }

  stopDrawing() {
    this.isDrawing = false;
    this.ctx.closePath();
  }
}