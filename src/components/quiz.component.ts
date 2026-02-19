import { Component, signal, computed, OnDestroy, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JapaneseDataService } from '../services/data.service';
import { KanaToRomajiPipe } from '../pipes/kana-to-romaji.pipe';
import { Question } from '../types';
import { TranslationService } from '../services/translation.service';
import { TtsService } from '../services/tts.service';

// --- IMPORT DATABASE SOAL (N5) ---
import { jlptn5_1 } from '../data/soal/jlptn5/jlptn5_1'; import { jlptn5_2 } from '../data/soal/jlptn5/jlptn5_2';
import { jlptn5_3 } from '../data/soal/jlptn5/jlptn5_3'; import { jlptn5_4 } from '../data/soal/jlptn5/jlptn5_4';
import { jlptn5_5 } from '../data/soal/jlptn5/jlptn5_5'; import { jlptn5_6 } from '../data/soal/jlptn5/jlptn5_6';
import { jlptn5_7 } from '../data/soal/jlptn5/jlptn5_7'; import { jlptn5_8 } from '../data/soal/jlptn5/jlptn5_8';
import { jlptn5_9 } from '../data/soal/jlptn5/jlptn5_9'; import { jlptn5_10 } from '../data/soal/jlptn5/jlptn5_10';
import { jlptn5_11 } from '../data/soal/jlptn5/jlptn5_11'; import { jlptn5_12 } from '../data/soal/jlptn5/jlptn5_12';
import { jlptn5_13 } from '../data/soal/jlptn5/jlptn5_13'; import { jlptn5_14 } from '../data/soal/jlptn5/jlptn5_14';
import { jlptn5_15 } from '../data/soal/jlptn5/jlptn5_15'; import { jlptn5_16 } from '../data/soal/jlptn5/jlptn5_16';
import { jlptn5_17 } from '../data/soal/jlptn5/jlptn5_17'; import { jlptn5_18 } from '../data/soal/jlptn5/jlptn5_18';
import { jlptn5_19 } from '../data/soal/jlptn5/jlptn5_19'; import { jlptn5_20 } from '../data/soal/jlptn5/jlptn5_20';
import { jlptn5_21 } from '../data/soal/jlptn5/jlptn5_21'; import { jlptn5_22 } from '../data/soal/jlptn5/jlptn5_22';
import { jlptn5_23 } from '../data/soal/jlptn5/jlptn5_23'; import { jlptn5_24 } from '../data/soal/jlptn5/jlptn5_24';
import { jlptn5_25 } from '../data/soal/jlptn5/jlptn5_25'; import { jlptn5_26 } from '../data/soal/jlptn5/jlptn5_26';
import { jlptn5_27 } from '../data/soal/jlptn5/jlptn5_27'; import { jlptn5_28 } from '../data/soal/jlptn5/jlptn5_28';
import { jlptn5_29 } from '../data/soal/jlptn5/jlptn5_29'; import { jlptn5_30 } from '../data/soal/jlptn5/jlptn5_30';
import { jlptn5_31 } from '../data/soal/jlptn5/jlptn5_31'; import { jlptn5_32 } from '../data/soal/jlptn5/jlptn5_32';
import { jlptn5_33 } from '../data/soal/jlptn5/jlptn5_33'; import { jlptn5_34 } from '../data/soal/jlptn5/jlptn5_34';
import { jlptn5_35 } from '../data/soal/jlptn5/jlptn5_35'; import { jlptn5_36 } from '../data/soal/jlptn5/jlptn5_36';
import { jlptn5_37 } from '../data/soal/jlptn5/jlptn5_37'; import { jlptn5_38 } from '../data/soal/jlptn5/jlptn5_38';
import { jlptn5_39 } from '../data/soal/jlptn5/jlptn5_39'; import { jlptn5_40 } from '../data/soal/jlptn5/jlptn5_40';
import { jlptn5_41 } from '../data/soal/jlptn5/jlptn5_41'; import { jlptn5_42 } from '../data/soal/jlptn5/jlptn5_42';
import { jlptn5_43 } from '../data/soal/jlptn5/jlptn5_43'; import { jlptn5_44 } from '../data/soal/jlptn5/jlptn5_44';
import { jlptn5_45 } from '../data/soal/jlptn5/jlptn5_45'; import { jlptn5_46 } from '../data/soal/jlptn5/jlptn5_46';
import { jlptn5_47 } from '../data/soal/jlptn5/jlptn5_47'; import { jlptn5_48 } from '../data/soal/jlptn5/jlptn5_48';
import { jlptn5_49 } from '../data/soal/jlptn5/jlptn5_49'; import { jlptn5_50 } from '../data/soal/jlptn5/jlptn5_50';
import { jlptn5_51 } from '../data/soal/jlptn5/jlptn5_51'; import { jlptn5_52 } from '../data/soal/jlptn5/jlptn5_52';
import { jlptn5_53 } from '../data/soal/jlptn5/jlptn5_53'; import { jlptn5_54 } from '../data/soal/jlptn5/jlptn5_54';
import { jlptn5_55 } from '../data/soal/jlptn5/jlptn5_55'; import { jlptn5_56 } from '../data/soal/jlptn5/jlptn5_56';
import { jlptn5_57 } from '../data/soal/jlptn5/jlptn5_57'; import { jlptn5_58 } from '../data/soal/jlptn5/jlptn5_58';
import { jlptn5_59 } from '../data/soal/jlptn5/jlptn5_59'; import { jlptn5_60 } from '../data/soal/jlptn5/jlptn5_60';
import { jlptn5_61 } from '../data/soal/jlptn5/jlptn5_61'; import { jlptn5_62 } from '../data/soal/jlptn5/jlptn5_62';
import { jlptn5_63 } from '../data/soal/jlptn5/jlptn5_63'; import { jlptn5_64 } from '../data/soal/jlptn5/jlptn5_64';
import { jlptn5_65 } from '../data/soal/jlptn5/jlptn5_65'; import { jlptn5_66 } from '../data/soal/jlptn5/jlptn5_66';
import { jlptn5_67 } from '../data/soal/jlptn5/jlptn5_67'; import { jlptn5_68 } from '../data/soal/jlptn5/jlptn5_68';
import { jlptn5_69 } from '../data/soal/jlptn5/jlptn5_69'; import { jlptn5_70 } from '../data/soal/jlptn5/jlptn5_70';
import { jlptn5_71 } from '../data/soal/jlptn5/jlptn5_71'; import { jlptn5_72 } from '../data/soal/jlptn5/jlptn5_72';
import { jlptn5_73 } from '../data/soal/jlptn5/jlptn5_73'; import { jlptn5_74 } from '../data/soal/jlptn5/jlptn5_74';
import { jlptn5_75 } from '../data/soal/jlptn5/jlptn5_75'; import { jlptn5_76 } from '../data/soal/jlptn5/jlptn5_76';
import { jlptn5_77 } from '../data/soal/jlptn5/jlptn5_77'; import { jlptn5_78 } from '../data/soal/jlptn5/jlptn5_78';
import { jlptn5_79 } from '../data/soal/jlptn5/jlptn5_79'; import { jlptn5_80 } from '../data/soal/jlptn5/jlptn5_80';

// --- IMPORT DATABASE SOAL (N4) ---
import { jlptn4_1 } from '../data/soal/jlptn4_1'; import { jlptn4_2 } from '../data/soal/jlptn4_2';
import { jlptn4_3 } from '../data/soal/jlptn4_3'; import { jlptn4_4 } from '../data/soal/jlptn4_4';
import { jlptn4_5 } from '../data/soal/jlptn4_5'; import { jlptn4_6 } from '../data/soal/jlptn4_6';
import { jlptn4_7 } from '../data/soal/jlptn4_7'; import { jlptn4_8 } from '../data/soal/jlptn4_8';
import { jlptn4_9 } from '../data/soal/jlptn4_9'; import { jlptn4_10 } from '../data/soal/jlptn4_10';
import { jlptn4_11 } from '../data/soal/jlptn4_11'; import { jlptn4_12 } from '../data/soal/jlptn4_12';
import { jlptn4_13 } from '../data/soal/jlptn4_13'; import { jlptn4_14 } from '../data/soal/jlptn4_14';
import { jlptn4_15 } from '../data/soal/jlptn4_15'; import { jlptn4_16 } from '../data/soal/jlptn4_16';
import { jlptn4_17 } from '../data/soal/jlptn4_17'; import { jlptn4_18 } from '../data/soal/jlptn4_18';
import { jlptn4_19 } from '../data/soal/jlptn4_19'; import { jlptn4_20 } from '../data/soal/jlptn4_20';

// --- IMPORT DATABASE SOAL (N3) ---
import { jlptn3_1 } from '../data/soal/jlptn3/jlptn3_1'; import { jlptn3_2 } from '../data/soal/jlptn3/jlptn3_2';
import { jlptn3_3 } from '../data/soal/jlptn3/jlptn3_3'; import { jlptn3_4 } from '../data/soal/jlptn3/jlptn3_4';
import { jlptn3_5 } from '../data/soal/jlptn3/jlptn3_5'; import { jlptn3_6 } from '../data/soal/jlptn3/jlptn3_6';
import { jlptn3_7 } from '../data/soal/jlptn3/jlptn3_7'; import { jlptn3_8 } from '../data/soal/jlptn3/jlptn3_8';
import { jlptn3_9 } from '../data/soal/jlptn3/jlptn3_9'; import { jlptn3_10 } from '../data/soal/jlptn3/jlptn3_10';
import { jlptn3_11 } from '../data/soal/jlptn3/jlptn3_11'; import { jlptn3_12 } from '../data/soal/jlptn3/jlptn3_12';
import { jlptn3_13 } from '../data/soal/jlptn3/jlptn3_13'; import { jlptn3_14 } from '../data/soal/jlptn3/jlptn3_14';
import { jlptn3_15 } from '../data/soal/jlptn3/jlptn3_15'; import { jlptn3_16 } from '../data/soal/jlptn3/jlptn3_16';
import { jlptn3_17 } from '../data/soal/jlptn3/jlptn3_17'; import { jlptn3_18 } from '../data/soal/jlptn3/jlptn3_18';
import { jlptn3_19 } from '../data/soal/jlptn3/jlptn3_19'; import { jlptn3_20 } from '../data/soal/jlptn3/jlptn3_20';

// --- IMPORT DATABASE SOAL (JFT A2) ---
import { jftA2b_1 } from '../data/soal/jftA2b_1'; import { jftA2b_2 } from '../data/soal/jftA2b_2';
import { jftA2b_3 } from '../data/soal/jftA2b_3'; import { jftA2b_4 } from '../data/soal/jftA2b_4';
import { jftA2b_5 } from '../data/soal/jftA2b_5'; import { jftA2b_6 } from '../data/soal/jftA2b_6';
import { jftA2b_7 } from '../data/soal/jftA2b_7'; import { jftA2b_8 } from '../data/soal/jftA2b_8';
import { jftA2b_9 } from '../data/soal/jftA2b_9'; import { jftA2b_10 } from '../data/soal/jftA2b_10';
import { jftA2b_11 } from '../data/soal/jftA2b_11'; import { jftA2b_12 } from '../data/soal/jftA2b_12';
import { jftA2b_13 } from '../data/soal/jftA2b_13'; import { jftA2b_14 } from '../data/soal/jftA2b_14';
import { jftA2b_15 } from '../data/soal/jftA2b_15'; import { jftA2b_16 } from '../data/soal/jftA2b_16';
import { jftA2b_17 } from '../data/soal/jftA2b_17'; import { jftA2b_18 } from '../data/soal/jftA2b_18';
import { jftA2b_19 } from '../data/soal/jftA2b_19'; import { jftA2b_20 } from '../data/soal/jftA2b_20';

// --- IMPORT DATABASE SOAL (KALIMAT) ---
import { latihan_kalimat_1 } from '../data/soal/latihan.kalimat_1'; import { latihan_kalimat_2 } from '../data/soal/latihan.kalimat_2';
import { latihan_kalimat_3 } from '../data/soal/latihan.kalimat_3'; import { latihan_kalimat_4 } from '../data/soal/latihan.kalimat_4';
import { latihan_kalimat_5 } from '../data/soal/latihan.kalimat_5'; import { latihan_kalimat_6 } from '../data/soal/latihan.kalimat_6';
import { latihan_kalimat_7 } from '../data/soal/latihan.kalimat_7'; import { latihan_kalimat_8 } from '../data/soal/latihan.kalimat_8';
import { latihan_kalimat_9 } from '../data/soal/latihan.kalimat_9'; import { latihan_kalimat_10 } from '../data/soal/latihan.kalimat_10';
import { latihan_kalimat_11 } from '../data/soal/latihan.kalimat_11'; import { latihan_kalimat_12 } from '../data/soal/latihan.kalimat_12';
import { latihan_kalimat_13 } from '../data/soal/latihan.kalimat_13'; import { latihan_kalimat_14 } from '../data/soal/latihan.kalimat_14';
import { latihan_kalimat_15 } from '../data/soal/latihan.kalimat_15'; import { latihan_kalimat_16 } from '../data/soal/latihan.kalimat_16';
import { latihan_kalimat_17 } from '../data/soal/latihan.kalimat_17'; import { latihan_kalimat_18 } from '../data/soal/latihan.kalimat_18';
import { latihan_kalimat_19 } from '../data/soal/latihan.kalimat_19'; import { latihan_kalimat_20 } from '../data/soal/latihan.kalimat_20';

// --- IMPORT DATABASE SOAL (PARTIKEL) ---
import { latihan_partikel_1 } from '../data/soal/latihan.partikel_1'; import { latihan_partikel_2 } from '../data/soal/latihan.partikel_2';
import { latihan_partikel_3 } from '../data/soal/latihan.partikel_3'; import { latihan_partikel_4 } from '../data/soal/latihan.partikel_4';
import { latihan_partikel_5 } from '../data/soal/latihan.partikel_5'; import { latihan_partikel_6 } from '../data/soal/latihan.partikel_6';
import { latihan_partikel_7 } from '../data/soal/latihan.partikel_7'; import { latihan_partikel_8 } from '../data/soal/latihan.partikel_8';
import { latihan_partikel_9 } from '../data/soal/latihan.partikel_9'; import { latihan_partikel_10 } from '../data/soal/latihan.partikel_10';
import { latihan_partikel_11 } from '../data/soal/latihan.partikel_11'; import { latihan_partikel_12 } from '../data/soal/latihan.partikel_12';
import { latihan_partikel_13 } from '../data/soal/latihan.partikel_13'; import { latihan_partikel_14 } from '../data/soal/latihan.partikel_14';
import { latihan_partikel_15 } from '../data/soal/latihan.partikel_15'; import { latihan_partikel_16 } from '../data/soal/latihan.partikel_16';
import { latihan_partikel_17 } from '../data/soal/latihan.partikel_17'; import { latihan_partikel_18 } from '../data/soal/latihan.partikel_18';
import { latihan_partikel_19 } from '../data/soal/latihan.partikel_19'; import { latihan_partikel_20 } from '../data/soal/latihan.partikel_20';


@Component({
  selector: 'app-quiz',
  imports: [CommonModule, RouterLink, FormsModule, KanaToRomajiPipe],
  template: `
    <div class="min-h-screen bg-slate-950 pb-20 text-slate-200">
      <div class="sticky top-0 bg-slate-950 z-20 p-4 border-b border-slate-800 flex items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <a routerLink="/" class="text-slate-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </a>
          <h1 class="text-xl font-bold text-slate-200">{{ ts.get('quiz.title') }}</h1>
        </div>
        
        <!-- Timer Display (Hanya muncul saat kuis jalan dan belum selesai) -->
        @if (isStarted() && !showResult()) {
          <div class="px-3 py-1 bg-slate-800 rounded-full border border-slate-700 font-mono text-lg font-bold" 
               [class.text-red-500]="remainingSeconds() < 60" 
               [class.text-blue-400]="remainingSeconds() >= 60">
            ⏱️ {{ formatTime(remainingSeconds()) }}
          </div>
        }
      </div>

      <div class="p-4">
        @if (!isStarted()) {
          <!-- MENU UTAMA KUIS -->
          <div class="space-y-8 mt-2 animate-in slide-in-from-bottom-4 duration-500">
            
            <!-- Section: Latihan Dasar -->
            <div>
              <h3 class="text-slate-400 text-sm font-bold uppercase tracking-wider mb-3 pl-1">Latihan Dasar</h3>
              <div class="grid grid-cols-1 gap-3">
                
                <!-- BUTTON KANA (Opens Selection Modal) -->
                <button (click)="openKanaSelection()" class="flex items-center p-4 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 hover:border-slate-700 transition group text-left">
                  <div class="w-12 h-12 rounded-lg bg-rose-900/30 flex items-center justify-center text-2xl mr-4 group-hover:scale-110 transition-transform">あ</div>
                  <div>
                    <div class="font-bold text-rose-400">Latihan Kana</div>
                    <div class="text-xs text-slate-500">Hafalan Hiragana & Katakana</div>
                  </div>
                </button>

                <button (click)="openConfig('KANJI')" class="flex items-center p-4 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 hover:border-slate-700 transition group text-left">
                  <div class="w-12 h-12 rounded-lg bg-blue-900/30 flex items-center justify-center text-2xl mr-4 group-hover:scale-110 transition-transform">字</div>
                  <div>
                    <div class="font-bold text-blue-400">Latihan Kanji N5/N4</div>
                    <div class="text-xs text-slate-500">Bacaan Onyomi & Kunyomi</div>
                  </div>
                </button>
                <button (click)="openConfig('VOCAB')" class="flex items-center p-4 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 hover:border-slate-700 transition group text-left">
                  <div class="w-12 h-12 rounded-lg bg-cyan-900/30 flex items-center justify-center text-2xl mr-4 group-hover:scale-110 transition-transform">単</div>
                  <div>
                    <div class="font-bold text-cyan-400">Latihan Kosakata</div>
                    <div class="text-xs text-slate-500">Arti kata & penggunaan</div>
                  </div>
                </button>
                 <button (click)="openConfig('PARTICLE')" class="flex items-center p-4 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 hover:border-slate-700 transition group text-left">
                  <div class="w-12 h-12 rounded-lg bg-amber-900/30 flex items-center justify-center text-2xl mr-4 group-hover:scale-110 transition-transform">は</div>
                  <div>
                    <div class="font-bold text-amber-400">{{ ts.get('quiz.menu.particle') }}</div>
                    <div class="text-xs text-slate-500">{{ ts.get('quiz.menu.particle_desc') }}</div>
                  </div>
                </button>
              </div>
            </div>

            <!-- Section: Simulasi Ujian -->
            <div>
              <h3 class="text-slate-400 text-sm font-bold uppercase tracking-wider mb-3 pl-1">Simulasi Ujian & Kalimat</h3>
              <div class="grid grid-cols-1 gap-3">
                <!-- JLPT N5 (NEW) -->
                <button (click)="openConfig('JLPT_N5')" class="relative overflow-hidden p-4 bg-slate-900 border border-amber-600/50 rounded-xl hover:bg-slate-800 transition group text-left">
                  <div class="absolute top-0 right-0 bg-amber-600 text-black text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">SIMULASI</div>
                  <div class="flex items-center">
                    <div class="w-12 h-12 rounded-lg bg-amber-900/20 border border-amber-600/30 flex items-center justify-center text-xl font-bold text-amber-500 mr-4 group-hover:scale-110 transition-transform">N5</div>
                    <div>
                      <div class="font-bold text-amber-400">JLPT N5 (Full Jepang)</div>
                      <div class="text-xs text-slate-500">Format soal asli 90% mirip</div>
                    </div>
                  </div>
                </button>

                <!-- JLPT N4 -->
                <button (click)="openConfig('JLPT_N4')" class="relative overflow-hidden p-4 bg-slate-900 border border-amber-600/50 rounded-xl hover:bg-slate-800 transition group text-left">
                  <div class="absolute top-0 right-0 bg-amber-600 text-black text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">SIMULASI</div>
                  <div class="flex items-center">
                    <div class="w-12 h-12 rounded-lg bg-amber-900/20 border border-amber-600/30 flex items-center justify-center text-xl font-bold text-amber-500 mr-4 group-hover:scale-110 transition-transform">N4</div>
                    <div>
                      <div class="font-bold text-amber-400">JLPT N4 (Full Jepang)</div>
                      <div class="text-xs text-slate-500">Tingkat lanjut, soal asli</div>
                    </div>
                  </div>
                </button>

                <!-- JLPT N3 -->
                <button (click)="openConfig('JLPT_N3')" class="relative overflow-hidden p-4 bg-slate-900 border border-indigo-600/50 rounded-xl hover:bg-slate-800 transition group text-left">
                  <div class="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">NEW</div>
                  <div class="flex items-center">
                    <div class="w-12 h-12 rounded-lg bg-indigo-900/20 border border-indigo-600/30 flex items-center justify-center text-xl font-bold text-indigo-400 mr-4 group-hover:scale-110 transition-transform">N3</div>
                    <div>
                      <div class="font-bold text-indigo-400">JLPT N3 (Menengah)</div>
                      <div class="text-xs text-slate-500">Kosakata, Kanji, dan Bacaan N3</div>
                    </div>
                  </div>
                </button>

                <!-- JFT A2 -->
                <button (click)="openConfig('JFT_A2')" class="relative overflow-hidden p-4 bg-slate-900 border border-emerald-600/50 rounded-xl hover:bg-slate-800 transition group text-left">
                  <div class="absolute top-0 right-0 bg-emerald-600 text-black text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">JFT</div>
                  <div class="flex items-center">
                    <div class="w-12 h-12 rounded-lg bg-emerald-900/20 border border-emerald-600/30 flex items-center justify-center text-xl font-bold text-emerald-500 mr-4 group-hover:scale-110 transition-transform">A2</div>
                    <div>
                      <div class="font-bold text-emerald-400">JFT Basic A2</div>
                      <div class="text-xs text-slate-500">Ujian hidup & kerja (Tokutei)</div>
                    </div>
                  </div>
                </button>

                <!-- Soal Kalimat -->
                <button (click)="openConfig('SENTENCE')" class="flex items-center p-4 bg-slate-900 border border-purple-800 rounded-xl hover:bg-slate-800 hover:border-purple-600 transition group text-left">
                  <div class="w-12 h-12 rounded-lg bg-purple-900/30 flex items-center justify-center text-2xl mr-4 group-hover:scale-110 transition-transform">✍️</div>
                  <div>
                    <div class="font-bold text-purple-400">Latihan Kalimat (Essay)</div>
                    <div class="text-xs text-slate-500">Terjemahan JP ↔ ID (Ketik)</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <!-- MODAL PEMILIHAN KANA (New) -->
          @if (showKanaSelectionModal()) {
            <div class="fixed inset-0 z-50 flex items-center justify-center px-4">
              <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" (click)="showKanaSelectionModal.set(false)"></div>
              <div class="relative bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in duration-200">
                <div class="text-center mb-6">
                  <h3 class="text-xl font-bold text-white mb-1">Pilih Jenis Soal Kana</h3>
                  <p class="text-slate-400 text-xs">Pilih huruf yang ingin dilatih</p>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <button (click)="selectKanaQuiz('KANA_HIRAGANA')" class="p-6 bg-slate-800 border border-slate-600 rounded-xl hover:bg-slate-700 hover:border-rose-500 transition group">
                    <div class="text-4xl text-rose-400 font-bold mb-2 group-hover:scale-110 transition-transform">あ</div>
                    <div class="text-sm font-bold text-white">Hiragana</div>
                  </button>
                  <button (click)="selectKanaQuiz('KANA_KATAKANA')" class="p-6 bg-slate-800 border border-slate-600 rounded-xl hover:bg-slate-700 hover:border-blue-500 transition group">
                    <div class="text-4xl text-blue-400 font-bold mb-2 group-hover:scale-110 transition-transform">ア</div>
                    <div class="text-sm font-bold text-white">Katakana</div>
                  </button>
                </div>
                <button (click)="showKanaSelectionModal.set(false)" class="mt-6 w-full py-3 text-slate-500 font-bold hover:text-slate-300">Batal</button>
              </div>
            </div>
          }

          <!-- MODAL KONFIGURASI -->
          @if (showConfigModal()) {
            <div class="fixed inset-0 z-50 flex items-center justify-center px-4">
              <!-- Backdrop -->
              <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" (click)="showConfigModal.set(false)"></div>
              
              <!-- Modal Content -->
              <div class="relative bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in duration-200">
                <div class="text-center mb-6">
                  <h3 class="text-xl font-bold text-white mb-1">Pengaturan Kuis</h3>
                  <p class="text-slate-400 text-xs">Sesuaikan latihanmu</p>
                </div>

                <div class="space-y-4">
                  <!-- Input Waktu -->
                  <div>
                    <label class="block text-sm font-medium text-slate-300 mb-1">Waktu (Menit)</label>
                    <div class="flex items-center">
                      <input type="number" min="1" max="500" [(ngModel)]="configDuration" 
                        class="block w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-center font-bold text-lg"
                        placeholder="1 - 500">
                    </div>
                    <div class="text-[10px] text-slate-500 mt-1 text-right">Maks: 500 menit</div>
                  </div>

                  <!-- Input Jumlah Soal -->
                  <div>
                    <label class="block text-sm font-medium text-slate-300 mb-1">Jumlah Soal</label>
                    <div class="flex items-center">
                      <input type="number" min="1" max="500" [(ngModel)]="configQuestionCount" 
                        class="block w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-center font-bold text-lg"
                        placeholder="1 - 500">
                    </div>
                    <!-- Tampilkan total ketersediaan soal -->
                    <div class="text-[10px] text-slate-500 mt-1 text-right">
                      Tersedia: <span class="text-blue-400 font-bold">{{ availableQuestionCount }}</span> soal
                    </div>
                  </div>
                </div>

                <div class="mt-8 flex gap-3">
                  <button (click)="showConfigModal.set(false)" class="flex-1 py-3 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700 border border-slate-700 transition">
                    Batal
                  </button>
                  <button (click)="proceedToQuiz()" class="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 shadow-lg shadow-blue-900/30 transition">
                    Mulai
                  </button>
                </div>
              </div>
            </div>
          }

        } @else if (currentQuestion()) {
          <!-- QUIZ INTERFACE -->
          <div class="mt-4 max-w-lg mx-auto animate-in fade-in duration-300">
             <!-- Progress Bar -->
             <div class="flex justify-between text-sm text-slate-500 mb-2">
               <span>Soal {{currentIndex() + 1}} / {{questions().length}}</span>
               <span>Skor: <span class="text-green-400 font-bold">{{score()}}</span></span>
             </div>
             <div class="h-1.5 bg-slate-800 rounded-full mb-8 overflow-hidden">
               <div class="h-full bg-blue-500 rounded-full transition-all duration-300 ease-out" [style.width.%]="((currentIndex() + 1) / questions().length) * 100"></div>
             </div>

             <!-- Question Card -->
             <div class="bg-slate-900 p-6 rounded-2xl border border-slate-800 min-h-[160px] flex flex-col items-center justify-center mb-6 text-center relative shadow-lg">
                <!-- Badge Tipe Soal -->
                <div class="absolute top-3 left-3 text-[10px] font-bold px-2 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  {{ getQuizLabel(currentQuestion()!.type) }}
                </div>

                <!-- ROMAJI TOGGLE BUTTON -->
                <button (click)="toggleRomaji()" 
                  class="absolute top-3 right-3 px-3 py-1.5 rounded-lg border border-slate-700 font-bold text-xs transition-all z-10"
                  [class.bg-amber-900_20]="showRomaji()"
                  [class.text-amber-400]="showRomaji()"
                  [class.border-amber-500_50]="showRomaji()"
                  [class.bg-slate-800]="!showRomaji()"
                  [class.text-slate-400]="!showRomaji()">
                  あ/A
                </button>
                
                <div class="flex items-center gap-2 mb-2 w-full justify-center relative">
                  <h2 class="text-xl md:text-2xl font-bold text-white leading-relaxed whitespace-pre-line">{{ currentQuestion()?.q }}</h2>
                  <!-- Speaker Icon for Question -->
                  <button (click)="speakQuestion()" class="p-2 rounded-full bg-slate-800 text-blue-400 hover:bg-slate-700 transition absolute right-[-40px]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                      <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 2.485.519 4.952 1.848 6.595.342 1.241 1.519 1.905 2.66 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 1 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
                    </svg>
                  </button>
                </div>

                <!-- ROMAJI DISPLAY (QUESTION) -->
                @if (showRomaji()) {
                  <div class="mt-4 text-amber-400/80 font-mono text-sm leading-relaxed border-t border-slate-800/50 pt-2 animate-in fade-in w-full">
                    {{ currentQuestion()?.q_romaji ? currentQuestion()!.q_romaji : (currentQuestion()?.q | kanaToRomaji) }}
                  </div>
                }
             </div>

             <!-- INPUT AREA: CHOICE vs ESSAY -->
             
             @if (currentQuestion()?.inputType === 'CHOICE') {
               <!-- PILIHAN GANDA -->
               <div class="grid grid-cols-1 gap-3">
                 @for (opt of currentQuestion()?.options; track opt; let i = $index) {
                   <button 
                    (click)="answerChoice(i)"
                    [disabled]="showResult()"
                    class="p-4 rounded-xl font-medium text-left transition-all border relative overflow-hidden group"
                    [class]="getOptionClass(i)"
                   >
                     <div class="flex items-start w-full">
                       <span class="inline-block w-6 h-6 rounded-full bg-slate-950/50 text-center leading-6 text-xs mr-3 border border-slate-700 text-slate-400 shrink-0 mt-0.5">{{ ['A','B','C','D'][i] }}</span>
                       <div class="flex-1 pr-6">
                         <div class="text-lg leading-relaxed">{{ opt }}</div>
                         <!-- ROMAJI DISPLAY (OPTION) -->
                         @if (showRomaji()) {
                           <div class="text-amber-400/80 font-mono text-xs mt-1 animate-in fade-in">
                             {{ opt | kanaToRomaji }}
                           </div>
                         }
                       </div>
                       <!-- Option Speaker Button -->
                       <div class="absolute right-3 top-3 z-10" *ngIf="!showResult()">
                          <button (click)="$event.stopPropagation(); tts.speak(opt, 'id-ID')" class="p-1.5 rounded-full text-slate-500 hover:text-blue-400 hover:bg-slate-800 transition">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                              <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 2.485.519 4.952 1.848 6.595.342 1.241 1.519 1.905 2.66 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 1 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
                            </svg>
                          </button>
                       </div>
                     </div>
                     
                     <!-- Result Icons -->
                     @if (showResult()) {
                       @if (i === currentQuestion()!.correct) {
                         <span class="absolute right-4 top-1/2 -translate-y-1/2 text-green-400 font-bold text-xl">✓</span>
                       }
                       @if (i === selectedAnswer() && i !== currentQuestion()!.correct) {
                         <span class="absolute right-4 top-1/2 -translate-y-1/2 text-red-400 font-bold text-xl">✕</span>
                       }
                     }
                   </button>
                 }
               </div>
             } @else {
               <!-- ESSAY INPUT -->
               <div class="flex flex-col gap-4">
                 <input 
                   type="text" 
                   [(ngModel)]="essayAnswer" 
                   [disabled]="showResult()"
                   (keyup.enter)="!showResult() ? checkEssay() : null"
                   class="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition text-center text-lg"
                   placeholder="Ketik jawaban di sini..."
                   autocomplete="off"
                 />
                 
                 @if (!showResult()) {
                   <button (click)="checkEssay()" 
                     [disabled]="!essayAnswer.trim()"
                     class="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-xl transition shadow-lg shadow-blue-900/20">
                     Jawab
                   </button>
                 } @else {
                   <!-- Essay Feedback -->
                   <div class="p-4 rounded-xl border text-center" 
                     [class]="isEssayCorrect ? 'bg-green-900/20 border-green-900 text-green-400' : 'bg-red-900/20 border-red-900 text-red-400'">
                     <div class="font-bold text-lg mb-1">{{ isEssayCorrect ? 'Benar!' : 'Kurang Tepat' }}</div>
                     @if (!isEssayCorrect) {
                        <div class="text-sm text-slate-400">Jawaban yang benar:</div>
                        <div class="text-white font-bold">{{ currentQuestion()?.correctAnswers?.[0] }}</div>
                     }
                   </div>
                 }
               </div>
             }

             <!-- Explanation & Next Button -->
             @if (showResult()) {
               <div class="mt-6 animate-in fade-in slide-in-from-bottom-2">
                 @if (currentQuestion()?.explanation) {
                   <div class="mb-4 p-4 bg-slate-800/80 rounded-xl text-sm text-slate-300 border border-slate-700/50 shadow-sm">
                     <div class="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2">
                        <span class="text-lg">💡</span>
                        <span class="font-bold text-blue-400 uppercase tracking-wider text-xs">Pembahasan Detail</span>
                     </div>
                     <div class="whitespace-pre-wrap leading-relaxed opacity-90 text-left">
                       {{ currentQuestion()?.explanation }}
                     </div>
                   </div>
                 }
                 
                 <div class="flex justify-center">
                   <button (click)="next()" class="px-8 py-3 bg-white text-slate-950 font-bold rounded-full hover:bg-slate-200 transition shadow-lg hover:scale-105 active:scale-95">
                     {{ currentIndex() < questions().length - 1 ? 'Soal Berikutnya →' : 'Lihat Hasil 🏆' }}
                   </button>
                 </div>
               </div>
             }
          </div>
        } @else {
          <!-- Result Screen -->
           <div class="text-center mt-12 space-y-6 px-4 animate-in zoom-in duration-300">
             <div class="text-7xl mb-4 filter drop-shadow-[0_0_15px_rgba(250,204,21,0.3)]">
               {{ score() > questions().length / 2 ? '🏆' : '💪' }}
             </div>
             <div>
               <h2 class="text-3xl font-bold text-white mb-2">Selesai!</h2>
               <p class="text-slate-400">{{ timeIsUp ? 'Waktu habis.' : 'Kamu telah menyelesaikan sesi ini.' }}</p>
             </div>
             
             <div class="py-6 bg-slate-900 rounded-2xl border border-slate-800 max-w-xs mx-auto">
                <div class="text-sm text-slate-500 uppercase tracking-widest font-bold mb-1">Skor Akhir</div>
                <div class="text-5xl font-black" [class]="getScoreColor()">
                  {{score()}} <span class="text-2xl text-slate-600 font-medium">/ {{questions().length}}</span>
                </div>
             </div>
             
             <button (click)="isStarted.set(false)" class="w-full max-w-xs py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition shadow-lg shadow-blue-900/20">
               Kembali ke Menu
             </button>
           </div>
        }
      </div>
    </div>
  `
})
export class QuizComponent implements OnDestroy {
  dataService = inject(JapaneseDataService);
  ts = inject(TranslationService);
  tts = inject(TtsService);

  // State Signals
  isStarted = signal(false);
  showResult = signal(false);
  showConfigModal = signal(false);
  showKanaSelectionModal = signal(false);
  
  // Configuration
  selectedQuizType: string | null = null;
  configDuration = 10;
  configQuestionCount = 10;
  availableQuestionCount = 0;

  // Quiz State
  questions = signal<Question[]>([]);
  currentIndex = signal(0);
  score = signal(0);
  selectedAnswer = signal<number | null>(null); // For choice
  essayAnswer = ''; // For essay
  isEssayCorrect = false;
  
  // Timer
  timerInterval: any;
  remainingSeconds = signal(0);
  timeIsUp = false;

  // UI State
  showRomaji = signal(false);

  // Computed
  currentQuestion = computed(() => this.questions()[this.currentIndex()]);

  constructor() {
    // Effect to clean up if needed
  }

  ngOnDestroy() {
    this.stopTimer();
    this.tts.cancel();
  }

  // Methods
  openConfig(type: string) {
    this.selectedQuizType = type;
    const allQuestions = this.getQuestionsByType(type);
    this.availableQuestionCount = allQuestions.length;
    this.configQuestionCount = Math.min(10, this.availableQuestionCount);
    this.showConfigModal.set(true);
  }

  openKanaSelection() {
    this.showKanaSelectionModal.set(true);
  }

  selectKanaQuiz(type: string) {
    this.selectedQuizType = type;
    this.showKanaSelectionModal.set(false);
    const allQuestions = this.getQuestionsByType(type);
    this.availableQuestionCount = allQuestions.length;
    this.configQuestionCount = Math.min(20, this.availableQuestionCount);
    this.showConfigModal.set(true);
  }

  getQuestionsByType(type: string): Question[] {
    let q: Question[] = [];
    if (type === 'JLPT_N5') {
       q = [...jlptn5_1, ...jlptn5_2, ...jlptn5_3, ...jlptn5_4, ...jlptn5_5, ...jlptn5_6, ...jlptn5_7, ...jlptn5_8, ...jlptn5_9, ...jlptn5_10, ...jlptn5_11, ...jlptn5_12, ...jlptn5_13, ...jlptn5_14, ...jlptn5_15, ...jlptn5_16, ...jlptn5_17, ...jlptn5_18, ...jlptn5_19, ...jlptn5_20, ...jlptn5_21, ...jlptn5_22, ...jlptn5_23, ...jlptn5_24, ...jlptn5_25, ...jlptn5_26, ...jlptn5_27, ...jlptn5_28, ...jlptn5_29, ...jlptn5_30, ...jlptn5_31, ...jlptn5_32, ...jlptn5_33, ...jlptn5_34, ...jlptn5_35, ...jlptn5_36, ...jlptn5_37, ...jlptn5_38, ...jlptn5_39, ...jlptn5_40, ...jlptn5_41, ...jlptn5_42, ...jlptn5_43, ...jlptn5_44, ...jlptn5_45, ...jlptn5_46, ...jlptn5_47, ...jlptn5_48, ...jlptn5_49, ...jlptn5_50, ...jlptn5_51, ...jlptn5_52, ...jlptn5_53, ...jlptn5_54, ...jlptn5_55, ...jlptn5_56, ...jlptn5_57, ...jlptn5_58, ...jlptn5_59, ...jlptn5_60, ...jlptn5_61, ...jlptn5_62, ...jlptn5_63, ...jlptn5_64, ...jlptn5_65, ...jlptn5_66, ...jlptn5_67, ...jlptn5_68, ...jlptn5_69, ...jlptn5_70, ...jlptn5_71, ...jlptn5_72, ...jlptn5_73, ...jlptn5_74, ...jlptn5_75, ...jlptn5_76, ...jlptn5_77, ...jlptn5_78, ...jlptn5_79, ...jlptn5_80];
    } else if (type === 'JLPT_N4') {
       q = [...jlptn4_1, ...jlptn4_2, ...jlptn4_3, ...jlptn4_4, ...jlptn4_5, ...jlptn4_6, ...jlptn4_7, ...jlptn4_8, ...jlptn4_9, ...jlptn4_10, ...jlptn4_11, ...jlptn4_12, ...jlptn4_13, ...jlptn4_14, ...jlptn4_15, ...jlptn4_16, ...jlptn4_17, ...jlptn4_18, ...jlptn4_19, ...jlptn4_20];
    } else if (type === 'JLPT_N3') {
       q = [...jlptn3_1, ...jlptn3_2, ...jlptn3_3, ...jlptn3_4, ...jlptn3_5, ...jlptn3_6, ...jlptn3_7, ...jlptn3_8, ...jlptn3_9, ...jlptn3_10, ...jlptn3_11, ...jlptn3_12, ...jlptn3_13, ...jlptn3_14, ...jlptn3_15, ...jlptn3_16, ...jlptn3_17, ...jlptn3_18, ...jlptn3_19, ...jlptn3_20];
    } else if (type === 'JFT_A2') {
       q = [...jftA2b_1, ...jftA2b_2, ...jftA2b_3, ...jftA2b_4, ...jftA2b_5, ...jftA2b_6, ...jftA2b_7, ...jftA2b_8, ...jftA2b_9, ...jftA2b_10, ...jftA2b_11, ...jftA2b_12, ...jftA2b_13, ...jftA2b_14, ...jftA2b_15, ...jftA2b_16, ...jftA2b_17, ...jftA2b_18, ...jftA2b_19, ...jftA2b_20];
    } else if (type === 'SENTENCE') {
       q = [...latihan_kalimat_1, ...latihan_kalimat_2, ...latihan_kalimat_3, ...latihan_kalimat_4, ...latihan_kalimat_5, ...latihan_kalimat_6, ...latihan_kalimat_7, ...latihan_kalimat_8, ...latihan_kalimat_9, ...latihan_kalimat_10, ...latihan_kalimat_11, ...latihan_kalimat_12, ...latihan_kalimat_13, ...latihan_kalimat_14, ...latihan_kalimat_15, ...latihan_kalimat_16, ...latihan_kalimat_17, ...latihan_kalimat_18, ...latihan_kalimat_19, ...latihan_kalimat_20];
    } else if (type === 'PARTICLE') {
       q = [...latihan_partikel_1, ...latihan_partikel_2, ...latihan_partikel_3, ...latihan_partikel_4, ...latihan_partikel_5, ...latihan_partikel_6, ...latihan_partikel_7, ...latihan_partikel_8, ...latihan_partikel_9, ...latihan_partikel_10, ...latihan_partikel_11, ...latihan_partikel_12, ...latihan_partikel_13, ...latihan_partikel_14, ...latihan_partikel_15, ...latihan_partikel_16, ...latihan_partikel_17, ...latihan_partikel_18, ...latihan_partikel_19, ...latihan_partikel_20];
    } else if (type === 'KANJI') {
        const kanjis = this.dataService.getKanji('N5').concat(this.dataService.getKanji('N4'));
        q = kanjis.map(k => ({
            q: `Apa arti kanji ini?\n${k.char}`,
            q_romaji: `Onyomi: ${k.onyomi.join(', ')}`,
            options: this.generateDistractors(k.meaning, kanjis.map(x => x.meaning)),
            correct: 0,
            type: 'KANJI',
            inputType: 'CHOICE'
        }));
    } else if (type === 'VOCAB') {
        const vocabs = this.dataService.getVocab('N5').concat(this.dataService.getVocab('N4'));
        q = vocabs.map(v => ({
            q: `Apa arti kata ini?\n${v.word} (${v.kana})`,
            options: this.generateDistractors(v.meaning, vocabs.map(x => x.meaning)),
            correct: 0,
            type: 'VOCAB',
            inputType: 'CHOICE'
        }));
    } else if (type === 'KANA_HIRAGANA') {
        const kanas = this.dataService.getKana('HIRAGANA', 'GOJUUON');
        q = kanas.map(k => ({
            q: `Apa bacaan huruf ini?\n${k.char}`,
            options: this.generateDistractors(k.romaji, kanas.map(x => x.romaji)),
            correct: 0,
            type: 'KANA',
            inputType: 'CHOICE'
        }));
    } else if (type === 'KANA_KATAKANA') {
        const kanas = this.dataService.getKana('KATAKANA', 'GOJUUON');
        q = kanas.map(k => ({
            q: `Apa bacaan huruf ini?\n${k.char}`,
            options: this.generateDistractors(k.romaji, kanas.map(x => x.romaji)),
            correct: 0,
            type: 'KANA',
            inputType: 'CHOICE'
        }));
    }

    return q;
  }

  generateDistractors(correct: string, all: string[]): string[] {
      const others = all.filter(x => x !== correct);
      const shuffled = others.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 3);
      return [correct, ...selected];
  }

  proceedToQuiz() {
    this.showConfigModal.set(false);
    let allQ = this.getQuestionsByType(this.selectedQuizType || '');
    allQ = allQ.sort(() => 0.5 - Math.random());
    let quizQ = allQ.slice(0, this.configQuestionCount);

    quizQ = quizQ.map(q => {
        if (q.inputType === 'CHOICE' && q.options) {
            if (['KANJI', 'VOCAB', 'KANA', 'KANA_HIRAGANA', 'KANA_KATAKANA'].includes(q.type) || this.selectedQuizType?.startsWith('KANA') || this.selectedQuizType === 'KANJI' || this.selectedQuizType === 'VOCAB') {
                 const correctAnswer = q.options[q.correct || 0];
                 const shuffledOptions = q.options.sort(() => 0.5 - Math.random());
                 const newCorrectIndex = shuffledOptions.indexOf(correctAnswer);
                 return { ...q, options: shuffledOptions, correct: newCorrectIndex };
            }
        }
        return q;
    });

    this.questions.set(quizQ);
    this.currentIndex.set(0);
    this.score.set(0);
    this.isStarted.set(true);
    this.showResult.set(false);
    this.selectedAnswer.set(null);
    this.essayAnswer = '';
    this.isEssayCorrect = false;
    this.timeIsUp = false;

    this.remainingSeconds.set(this.configDuration * 60);
    this.timerInterval = setInterval(() => {
        this.remainingSeconds.update(v => v - 1);
        if (this.remainingSeconds() <= 0) {
            this.finishQuiz(true);
        }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  finishQuiz(timeout = false) {
    this.stopTimer();
    this.timeIsUp = timeout;
    this.showResult.set(true);
    // Force end by setting index out of bounds if it's timeout mid-game?
    // Actually, if timeout happens, we usually show result screen directly.
    // The result screen shows if !currentQuestion().
    // So let's force index to end.
    this.currentIndex.set(this.questions().length);
  }

  answerChoice(index: number) {
    if (this.showResult()) return;
    
    this.selectedAnswer.set(index);
    const q = this.currentQuestion();
    if (q && q.correct === index) {
        this.score.update(s => s + 1);
    }
    this.showResult.set(true);
  }

  checkEssay() {
    if (this.showResult()) return;
    
    const q = this.currentQuestion();
    if (!q) return;

    const input = this.essayAnswer.trim().toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"");
    const correctAnswers = q.correctAnswers?.map(a => a.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"")) || [];
    
    if (correctAnswers.includes(input)) {
        this.isEssayCorrect = true;
        this.score.update(s => s + 1);
    } else {
        this.isEssayCorrect = false;
    }
    this.showResult.set(true);
  }

  next() {
    this.showResult.set(false);
    this.selectedAnswer.set(null);
    this.essayAnswer = '';
    this.isEssayCorrect = false;
    
    if (this.currentIndex() < this.questions().length - 1) {
        this.currentIndex.update(i => i + 1);
    } else {
        this.stopTimer();
        this.currentIndex.update(i => i + 1); 
    }
  }

  toggleRomaji() {
    this.showRomaji.update(v => !v);
  }

  speakQuestion() {
    const q = this.currentQuestion();
    if (q) {
        this.tts.speak(q.q, 'ja-JP');
    }
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  getQuizLabel(type: string): string {
    return type.replace('_', ' ');
  }

  getOptionClass(index: number): string {
    if (!this.showResult()) {
        return "bg-slate-800 border-slate-700 hover:border-blue-500 hover:bg-slate-700";
    }
    const q = this.currentQuestion();
    if (!q) return "";

    if (index === q.correct) {
        return "bg-green-900/30 border-green-500 text-green-200"; 
    }
    if (index === this.selectedAnswer() && index !== q.correct) {
        return "bg-red-900/30 border-red-500 text-red-200"; 
    }
    return "bg-slate-800 border-slate-700 opacity-50"; 
  }

  getScoreColor(): string {
    const s = this.score();
    const total = this.questions().length;
    const ratio = total > 0 ? s / total : 0;
    if (ratio >= 0.8) return "text-green-400";
    if (ratio >= 0.5) return "text-yellow-400";
    return "text-red-400";
  }
}
