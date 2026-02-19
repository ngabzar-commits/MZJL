import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../services/translation.service';
import { JapaneseDataService } from '../services/data.service';
import { Kana, Kanji, Vocab } from '../types';
import { KanaToRomajiPipe } from '../pipes/kana-to-romaji.pipe';
import { TtsService } from '../services/tts.service';

type DeckType = 'HIRAGANA' | 'KATAKANA' | 'KANJI_N5' | 'KANJI_N4' | 'VOCAB_N5' | 'VOCAB_N4';

interface FlashcardItem {
  front: string;
  back: string;
  sub?: string;
}

interface SavedDeck {
  id: number;
  name: string;
  cards: FlashcardItem[];
}

@Component({
  selector: 'app-flashcard',
  imports: [CommonModule, RouterLink, FormsModule, KanaToRomajiPipe],
  providers: [KanaToRomajiPipe],
  styles: [`
    .card-container { perspective: 1000px; }
    .card-inner { position: relative; width: 100%; height: 100%; transition: transform 0.6s; transform-style: preserve-3d; }
    .card-container.flipped .card-inner { transform: rotateY(180deg); }
    .card-front, .card-back { position: absolute; width: 100%; height: 100%; -webkit-backface-visibility: hidden; backface-visibility: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 1.5rem; text-align: center; }
    .card-back { transform: rotateY(180deg); }
  `],
  template: `
    <div class="min-h-screen pb-24 transition-colors" [class.bg-slate-950]="ts.isDarkMode()" [class.bg-gray-50]="!ts.isDarkMode()">
      <!-- Header -->
      <div class="sticky top-0 z-20 p-4 border-b flex items-center gap-4 transition-colors" [class.bg-slate-950]="ts.isDarkMode()" [class.border-slate-800]="ts.isDarkMode()" [class.bg-white]="!ts.isDarkMode()" [class.border-gray-200]="!ts.isDarkMode()">
        <a (click)="goBack()" class="cursor-pointer transition-colors" [class.text-slate-400]="ts.isDarkMode()" [class.hover:text-white]="ts.isDarkMode()" [class.text-slate-500]="!ts.isDarkMode()" [class.hover:text-slate-800]="!ts.isDarkMode()">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
        </a>
        <h1 class="text-xl font-bold transition-colors" [class.text-yellow-400]="ts.isDarkMode()" [class.text-yellow-600]="!ts.isDarkMode()">{{ headerTitle() }}</h1>
      </div>

      <div class="p-4">
        <!-- Menu View -->
        @if (view() === 'menu') {
          <div class="animate-in fade-in duration-300 space-y-4">
            <button (click)="startBuildingNewDeck()" class="w-full p-4 rounded-xl border-2 border-dashed transition-colors text-left" [class.border-yellow-500/40]="ts.isDarkMode()" [class.hover:bg-yellow-950/40]="ts.isDarkMode()" [class.hover:border-yellow-500/70]="ts.isDarkMode()" [class.border-yellow-300]="!ts.isDarkMode()" [class.hover:bg-yellow-50]="!ts.isDarkMode()" [class.hover:border-yellow-400]="!ts.isDarkMode()">
              <div class="flex items-center gap-4"><div class="text-3xl">🎨</div><div><div class="font-bold text-lg" [class.text-yellow-400]="ts.isDarkMode()" [class.text-yellow-700]="!ts.isDarkMode()">{{ ts.get('flashcard.custom_deck') }}</div><div class="text-xs opacity-70">{{ ts.get('flashcard.custom_deck_desc') }}</div></div></div>
            </button>
            <h2 class="text-lg font-semibold pt-4 opacity-80">{{ ts.get('flashcard.choose_deck') }}</h2>
            <div class="grid grid-cols-2 gap-3">
              @for(deck of predefinedDecks; track deck.type) {
                <button (click)="startSession(deck.type)" class="p-4 rounded-xl border transition-colors text-left" [class.bg-slate-900]="ts.isDarkMode()" [class.border-slate-800]="ts.isDarkMode()" [class.hover:border-rose-500]="ts.isDarkMode()" [class.bg-white]="!ts.isDarkMode()" [class.border-gray-200]="!ts.isDarkMode()" [class.hover:border-rose-400]="!ts.isDarkMode()">
                  <div class="text-3xl font-bold" [class]="deck.color">{{ deck.char }}</div>
                  <div class="font-bold mt-2">{{ getDeckName(deck.type) }}</div>
                </button>
              }
            </div>
            <div class="mt-6 p-4 rounded-xl border flex items-center justify-between" [class.bg-slate-900]="ts.isDarkMode()" [class.border-slate-800]="ts.isDarkMode()" [class.bg-white]="!ts.isDarkMode()" [class.border-gray-200]="!ts.isDarkMode()"><label for="shuffle-toggle" class="font-medium">{{ ts.get('flashcard.shuffle') }}</label><button id="shuffle-toggle" (click)="shuffle.set(!shuffle())" class="w-12 h-6 rounded-full relative transition-colors duration-200 focus:outline-none" [class.bg-blue-600]="shuffle()" [class.bg-gray-400]="!shuffle() && !ts.isDarkMode()" [class.bg-slate-700]="!shuffle() && ts.isDarkMode()"><div class="w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-200 shadow-sm" [class.left-6.5]="shuffle()" [class.left-0.5]="!shuffle()"></div></button></div>
            <h2 class="text-lg font-semibold pt-4 opacity-80">{{ ts.get('flashcard.my_decks') }}</h2>
            <div class="space-y-3">
              @for(deck of savedDecks(); track deck.id) {
                <div class="p-4 rounded-xl border flex items-center justify-between" [class.bg-slate-900]="ts.isDarkMode()" [class.border-slate-800]="ts.isDarkMode()" [class.bg-white]="!ts.isDarkMode()" [class.border-gray-200]="!ts.isDarkMode()">
                  <div><div class="font-bold">{{ deck.name }}</div><div class="text-xs opacity-60">{{ deck.cards.length }} {{ ts.get('flashcard.card') }}</div></div>
                  <div class="flex gap-2">
                    <button (click)="startSavedDeckSession(deck)" class="px-4 py-2 text-sm font-bold rounded-lg bg-yellow-600 text-black hover:bg-yellow-500 transition">{{ ts.get('flashcard.start') }}</button>
                    <button (click)="editDeck(deck)" class="p-2 rounded-lg bg-slate-800 hover:bg-blue-900/50 text-blue-400 transition" [attr.aria-label]="ts.get('flashcard.edit')">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" /><path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" /></svg>
                    </button>
                    <button (click)="deleteDeck(deck)" class="p-2 rounded-lg bg-slate-800 hover:bg-red-900/50 text-red-400 transition" [attr.aria-label]="ts.get('flashcard.delete')">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193v-.443A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clip-rule="evenodd" /></svg>
                    </button>
                  </div>
                </div>
              } @empty {
                <div class="text-center text-sm opacity-60 p-6 border-2 border-dashed rounded-xl" [class.border-slate-800]="ts.isDarkMode()" [class.border-gray-200]="!ts.isDarkMode()">{{ ts.get('flashcard.no_custom_decks') }}</div>
              }
            </div>
          </div>
        }

        <!-- Custom Deck Config View -->
        @if (view() === 'config') {
          <div class="animate-in fade-in duration-300 space-y-6">
            <section>
              <label for="deckName" class="font-bold mb-2 block">{{ ts.get('flashcard.deck_name') }}</label>
              <input id="deckName" type="text" [(ngModel)]="customDeckName" class="w-full p-3 rounded-lg border-2" [class.bg-slate-900]="ts.isDarkMode()" [class.border-slate-700]="ts.isDarkMode()" [class.focus:border-yellow-500]="ts.isDarkMode()" [class.bg-white]="!ts.isDarkMode()" [class.border-gray-200]="!ts.isDarkMode()" [class.focus:border-yellow-500]="!ts.isDarkMode()">
            </section>
            <section>
              <h3 class="font-bold mb-2">{{ ts.get('flashcard.cards_in_deck') }} ({{ customDeckCards().length }})</h3>
              <div class="space-y-2 max-h-60 overflow-y-auto no-scrollbar rounded-lg p-2 border" [class.bg-slate-950/50]="ts.isDarkMode()" [class.border-slate-800]="ts.isDarkMode()">
                @for(card of customDeckCards(); track $index) {
                  <div class="p-2 rounded-lg flex justify-between items-center" [class.bg-slate-800]="ts.isDarkMode()"><span class="font-bold">{{ card.front }}</span><span class="text-sm opacity-70">{{ card.back }}</span><button (click)="removeCardFromCustomDeck($index)" class="p-1 text-red-400 hover:bg-red-900/50 rounded-full">&times;</button></div>
                } @empty { <div class="text-center text-xs opacity-50 py-4">Belum ada kartu.</div> }
              </div>
            </section>
            <button (click)="view.set('add_cards')" class="w-full py-3 bg-slate-800 font-bold rounded-xl border border-slate-700 hover:border-yellow-500 transition">{{ ts.get('flashcard.add_cards') }}</button>
            <div class="flex gap-3">
              <button (click)="startCustomSession()" class="flex-1 py-4 bg-yellow-600 hover:bg-yellow-500 text-black font-bold rounded-xl transition" [disabled]="customDeckCards().length === 0">{{ ts.get('flashcard.start_session') }}</button>
              <button (click)="saveDeck()" class="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition">
                {{ editingDeckId() ? ts.get('flashcard.update_deck') : ts.get('flashcard.save_deck') }}
              </button>
            </div>
          </div>
        }

        <!-- Add Cards View -->
        @if (view() === 'add_cards') {
          <div class="animate-in fade-in duration-300 space-y-4">
            <input type="text" [(ngModel)]="searchQuery" (input)="onSearch()" [placeholder]="ts.get('flashcard.search_to_add')" class="w-full p-3 rounded-lg border-2 sticky top-[73px]" [class.bg-slate-900]="ts.isDarkMode()" [class.border-slate-700]="ts.isDarkMode()" [class.focus:border-yellow-500]="ts.isDarkMode()">
            
            <div class="space-y-2">
              <h3 class="text-sm font-bold opacity-70">{{ ts.get('flashcard.browse_by_deck') }}</h3>
              <div class="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                @for(deck of allDeckTypes; track deck) {
                  <button (click)="selectAddCardCategory(deck)" class="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border"
                          [class.bg-yellow-900/40]="addCardCategory() === deck"
                          [class.text-yellow-200]="addCardCategory() === deck"
                          [class.border-yellow-700]="addCardCategory() === deck"
                          [class.bg-slate-900]="addCardCategory() !== deck"
                          [class.text-slate-400]="addCardCategory() !== deck"
                          [class.border-slate-800]="addCardCategory() !== deck"
                          [class.hover:border-slate-600]="addCardCategory() !== deck">
                    {{ getDeckName(deck) }}
                  </button>
                }
              </div>
            </div>

            <div class="border-t pt-4" [class.border-slate-800]="ts.isDarkMode()">
              <div class="space-y-2 max-h-[60vh] overflow-y-auto no-scrollbar">
                @for(item of displayList(); track $index) {
                  <div class="p-3 rounded-lg flex justify-between items-center" [class.bg-slate-800]="ts.isDarkMode()" [class.bg-gray-100]="!ts.isDarkMode()">
                    <div><div class="font-bold text-lg">{{ item.front }}</div><div class="text-sm opacity-70">{{ item.back }} <span class="text-xs">{{ item.sub || ''}}</span></div></div>
                    @if (isCardAdded(item)) { <button class="px-3 py-1.5 text-xs font-bold rounded-md bg-green-900/50 text-green-400 border border-green-800" disabled>{{ ts.get('flashcard.added') }}</button> }
                    @else { <button (click)="addCardToCustomDeck(item)" class="px-3 py-1.5 text-xs font-bold rounded-md bg-blue-600 text-white hover:bg-blue-500">{{ ts.get('flashcard.add') }}</button> }
                  </div>
                } @empty { 
                  <div class="text-center text-sm opacity-50 py-6 border-2 border-dashed rounded-xl" [class.border-slate-800]="ts.isDarkMode()">
                    @if(searchQuery()) {
                      <span>Tidak ada hasil untuk "{{ searchQuery() }}".</span>
                    } @else {
                      <span>{{ ts.get('flashcard.select_category_prompt') }}</span>
                    }
                  </div> 
                }
              </div>
            </div>
          </div>
        }

        <!-- Session View -->
        @if (view() === 'session' && currentCard()) {
          <div class="flex flex-col items-center animate-in fade-in duration-300">
            <div class="w-full max-w-sm flex justify-between items-center mb-4">
              <div class="text-sm font-medium opacity-70">{{ ts.get('flashcard.card') }} {{ currentIndex() + 1 }} {{ ts.get('flashcard.of') }} {{ deck().length }}</div>
              <div class="flex items-center gap-2">
                <label for="romaji-toggle" class="text-sm font-medium opacity-70">{{ ts.get('flashcard.romaji_toggle') }}</label>
                <button id="romaji-toggle" (click)="showRomaji.set(!showRomaji())" class="w-12 h-6 rounded-full relative transition-colors duration-200 focus:outline-none" 
                        [class.bg-blue-600]="showRomaji()" 
                        [class.bg-slate-700]="!showRomaji()">
                  <div class="w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-200 shadow-sm" [class.left-6.5]="showRomaji()" [class.left-0.5]="!showRomaji()"></div>
                </button>
              </div>
            </div>

            <div (click)="flipCard()" class="card-container w-full max-w-sm h-64 cursor-pointer mb-6" [class.flipped]="isFlipped()">
              <div class="card-inner">
                <div class="card-front rounded-2xl border shadow-lg relative" [class.bg-slate-900]="ts.isDarkMode()" [class.border-slate-700]="ts.isDarkMode()" [class.bg-white]="!ts.isDarkMode()" [class.border-gray-200]="!ts.isDarkMode()">
                  <div class="text-6xl font-bold font-serif">{{ currentCard().front }}</div>
                  @if (showRomaji() && romajiForCurrentCard()) {
                    <div class="text-xl opacity-70 mt-4 font-mono animate-in fade-in duration-300">{{ romajiForCurrentCard() }}</div>
                  }
                  
                  <!-- Speaker Button Front -->
                  <div class="absolute top-2 right-2">
                    <button (click)="$event.stopPropagation(); tts.speak(currentCard().front, 'ja-JP')" class="p-2 rounded-full hover:bg-slate-800 transition text-blue-400">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 2.485.519 4.952 1.848 6.595.342 1.241 1.519 1.905 2.66 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 1 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" /></svg>
                    </button>
                  </div>
                </div>
                
                <div class="card-back rounded-2xl border shadow-lg relative" [class.bg-slate-800]="ts.isDarkMode()" [class.border-slate-600]="ts.isDarkMode()" [class.bg-gray-100]="!ts.isDarkMode()" [class.border-gray-300]="!ts.isDarkMode()">
                  <div class="text-4xl font-bold">{{ currentCard().back }}</div>
                  @if(currentCard().sub){
                    <div class="text-xl opacity-70 mt-2 font-mono">{{ currentCard().sub }}</div>
                    @if(showRomaji() && romajiForCurrentCard()) {
                      <div class="text-lg opacity-50 mt-1 font-mono animate-in fade-in duration-300">({{ romajiForCurrentCard() }})</div>
                    }
                  }
                  
                  <!-- Speaker Button Back -->
                  <div class="absolute top-2 right-2">
                    <button (click)="$event.stopPropagation(); tts.speak(currentCard().back, 'id-ID')" class="p-2 rounded-full hover:bg-slate-700 transition text-yellow-400">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 2.485.519 4.952 1.848 6.595.342 1.241 1.519 1.905 2.66 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 1 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="w-full max-w-sm space-y-3"><div class="flex gap-3"><button (click)="prevCard()" class="flex-1 py-3 rounded-xl border font-bold transition-colors" [class.bg-slate-800]="ts.isDarkMode()" [class.border-slate-700]="ts.isDarkMode()" [class.hover:bg-slate-700]="ts.isDarkMode()" [class.bg-white]="!ts.isDarkMode()" [class.border-gray-200]="!ts.isDarkMode()" [class.hover:bg-gray-100]="!ts.isDarkMode()">← {{ ts.get('flashcard.previous') }}</button><button (click)="nextCard()" class="flex-1 py-3 rounded-xl border font-bold transition-colors" [class.bg-slate-800]="ts.isDarkMode()" [class.border-slate-700]="ts.isDarkMode()" [class.hover:bg-slate-700]="ts.isDarkMode()" [class.bg-white]="!ts.isDarkMode()" [class.border-gray-200]="!ts.isDarkMode()" [class.hover:bg-gray-100]="!ts.isDarkMode()">{{ ts.get('flashcard.next') }} →</button></div><button (click)="backToMenu()" class="w-full py-3 rounded-xl font-bold transition-colors opacity-70 hover:opacity-100" [class.text-slate-400]="ts.isDarkMode()" [class.text-slate-500]="!ts.isDarkMode()">{{ ts.get('flashcard.back_to_menu') }}</button></div>
          </div>
        }
      </div>

      <!-- DELETE CONFIRMATION MODAL -->
      @if (deckToDelete()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" (click)="deckToDelete.set(null)"></div>
          <div class="relative border rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200"
               [class.bg-slate-900]="ts.isDarkMode()" [class.border-slate-800]="ts.isDarkMode()"
               [class.bg-white]="!ts.isDarkMode()" [class.border-gray-200]="!ts.isDarkMode()">
            <div class="text-center">
              <div class="text-3xl mb-4 text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 mx-auto">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.067-2.09 1.02-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </div>
              <h3 class="text-lg font-bold mb-2">{{ deleteModalTitle() }}</h3>
              <p class="text-sm mb-6" [class.text-slate-400]="ts.isDarkMode()" [class.text-slate-500]="!ts.isDarkMode()">
                {{ ts.get('flashcard.delete_confirm').replace('{deckName}', deckToDelete()!.name) }}
              </p>
              <div class="flex gap-3">
                <button (click)="deckToDelete.set(null)" class="flex-1 py-3 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700 border border-slate-700 transition">
                  {{ ts.get('common.back') }}
                </button>
                <button (click)="confirmDelete()" class="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-500 shadow-lg shadow-red-900/30 transition">
                  {{ ts.get('flashcard.delete') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class FlashcardComponent implements OnInit {
  ts = inject(TranslationService);
  dataService = inject(JapaneseDataService);
  tts = inject(TtsService); // Inject TTS
  router = inject(Router);
  kanaToRomajiPipe = inject(KanaToRomajiPipe);

  view = signal<'menu' | 'session' | 'config' | 'add_cards'>('menu');
  deck = signal<FlashcardItem[]>([]);
  currentIndex = signal(0);
  isFlipped = signal(false);
  shuffle = signal(true);
  showRomaji = signal(false);

  // Custom Deck Builder State
  customDeckName = signal('');
  customDeckCards = signal<FlashcardItem[]>([]);
  savedDecks = signal<SavedDeck[]>([]);
  editingDeckId = signal<number | null>(null);
  deckToDelete = signal<SavedDeck | null>(null);
  
  // Add Cards View State
  searchQuery = signal('');
  searchResults = signal<FlashcardItem[]>([]);
  addCardCategory = signal<DeckType | null>(null);
  allDeckTypes: DeckType[] = ['HIRAGANA', 'KATAKANA', 'KANJI_N5', 'KANJI_N4', 'VOCAB_N5', 'VOCAB_N4'];

  predefinedDecks = [
    { type: 'HIRAGANA', char: 'あ', color: 'text-rose-400' },
    { type: 'KATAKANA', char: 'ア', color: 'text-rose-400' },
    { type: 'KANJI_N5', char: '字', color: 'text-blue-400' },
    { type: 'KANJI_N4', char: '語', color: 'text-blue-400' },
    { type: 'VOCAB_N5', char: '本', color: 'text-cyan-400' },
    { type: 'VOCAB_N4', char: '味', color: 'text-cyan-400' },
  ] as const;

  currentCard = computed(() => this.deck()[this.currentIndex()]);
  romajiForCurrentCard = computed(() => {
    const card = this.currentCard();
    return card?.sub ? this.kanaToRomajiPipe.transform(card.sub) : '';
  });

  headerTitle = computed(() => {
    switch(this.view()) {
      case 'config': return this.ts.get('flashcard.config_title');
      case 'add_cards': return this.ts.get('flashcard.add_cards');
      default: return this.ts.get('flashcard.title');
    }
  });

  deleteModalTitle = computed(() => {
    return this.ts.currentLang() === 'ID' ? 'Hapus Dek' : 'Delete Deck';
  });

  categoryItems = computed<FlashcardItem[]>(() => {
    const category = this.addCardCategory();
    if (!category) return [];
    
    let rawData: (Kana | Kanji | Vocab)[] = [];
    switch(category) {
      case 'HIRAGANA': rawData = this.dataService.getKana('HIRAGANA', 'GOJUUON'); break;
      case 'KATAKANA': rawData = this.dataService.getKana('KATAKANA', 'GOJUUON'); break;
      case 'KANJI_N5': rawData = this.dataService.getKanji('N5'); break;
      case 'KANJI_N4': rawData = this.dataService.getKanji('N4'); break;
      case 'VOCAB_N5': rawData = this.dataService.getVocab('N5'); break;
      case 'VOCAB_N4': rawData = this.dataService.getVocab('N4'); break;
    }
    return rawData.map(item => this.formatCard(item)).filter(Boolean) as FlashcardItem[];
  });

  displayList = computed<FlashcardItem[]>(() => {
    if (this.searchQuery()) {
      return this.searchResults();
    }
    return this.categoryItems();
  });
  
  ngOnInit() { this.loadDecks(); }

  goBack() {
    if (this.view() === 'session') {
      this.view.set('menu');
    } else if (this.view() === 'config') {
      this.resetCustomDeckBuilder();
      this.view.set('menu');
    } else if (this.view() === 'add_cards') {
      this.view.set('config');
    } else {
      this.router.navigate(['/']);
    }
  }

  loadDecks() {
    const data = localStorage.getItem('customFlashcardDecks');
    if (data) this.savedDecks.set(JSON.parse(data));
  }

  saveDeck() {
    const name = this.customDeckName().trim();
    const cards = this.customDeckCards();
    if (!name || cards.length === 0) { alert('Nama dek dan kartu tidak boleh kosong.'); return; }

    const editingId = this.editingDeckId();
    if (editingId !== null) {
      this.savedDecks.update(decks =>
        decks.map(deck => deck.id === editingId ? { ...deck, name, cards } : deck)
      );
    } else {
      const newDeck: SavedDeck = { id: Date.now(), name, cards };
      this.savedDecks.update(decks => [...decks, newDeck]);
    }
    
    localStorage.setItem('customFlashcardDecks', JSON.stringify(this.savedDecks()));
    this.resetCustomDeckBuilder();
    this.view.set('menu');
  }

  deleteDeck(deck: SavedDeck) {
    this.deckToDelete.set(deck);
  }

  confirmDelete() {
    const deckToDelete = this.deckToDelete();
    if (!deckToDelete) return;

    this.savedDecks.update(decks => decks.filter(d => d.id !== deckToDelete.id));
    localStorage.setItem('customFlashcardDecks', JSON.stringify(this.savedDecks()));
    
    this.deckToDelete.set(null); // Close modal
  }

  startSession(type: DeckType) {
    let rawData: (Kana | Kanji | Vocab)[] = [];
    switch(type) {
      case 'HIRAGANA': rawData = this.dataService.getKana('HIRAGANA', 'GOJUUON'); break;
      case 'KATAKANA': rawData = this.dataService.getKana('KATAKANA', 'GOJUUON'); break;
      case 'KANJI_N5': rawData = this.dataService.getKanji('N5'); break;
      case 'KANJI_N4': rawData = this.dataService.getKanji('N4'); break;
      case 'VOCAB_N5': rawData = this.dataService.getVocab('N5'); break;
      case 'VOCAB_N4': rawData = this.dataService.getVocab('N4'); break;
    }
    this.startDeck(rawData.map(item => this.formatCard(item)).filter(Boolean) as FlashcardItem[]);
  }

  startSavedDeckSession(deck: SavedDeck) { this.startDeck(deck.cards); }
  startCustomSession() { this.startDeck(this.customDeckCards()); }
  startBuildingNewDeck() {
    this.resetCustomDeckBuilder();
    this.view.set('config');
  }
  
  editDeck(deckToEdit: SavedDeck) {
    this.editingDeckId.set(deckToEdit.id);
    this.customDeckName.set(deckToEdit.name);
    this.customDeckCards.set([...deckToEdit.cards]); // Salin array untuk menghindari mutasi
    this.view.set('config');
  }

  private resetCustomDeckBuilder() {
    this.editingDeckId.set(null);
    this.customDeckName.set('');
    this.customDeckCards.set([]);
  }

  startDeck(cards: FlashcardItem[]) {
    this.deck.set(this.shuffle() ? this.shuffleArray(cards) : cards);
    this.currentIndex.set(0);
    this.isFlipped.set(false);
    this.view.set('session');
  }
  
  selectAddCardCategory(category: DeckType | null) {
    this.searchQuery.set('');
    this.searchResults.set([]);
    this.addCardCategory.set(category);
  }

  onSearch() {
    this.addCardCategory.set(null);
    const q = this.searchQuery().toLowerCase().trim();
    if (q.length < 1) { this.searchResults.set([]); return; }
    const allItems: (Kana | Kanji | Vocab)[] = [...this.dataService.getKana('HIRAGANA', 'GOJUUON'), ...this.dataService.getKana('KATAKANA', 'GOJUUON'), ...this.dataService.getKanji('ALL'), ...this.dataService.getVocab('ALL')];
    const filtered = allItems.filter(item => {
      if ('romaji' in item) return item.char.includes(q) || item.romaji.includes(q);
      if ('onyomi' in item) return item.char.includes(q) || item.meaning.toLowerCase().includes(q) || item.onyomi.join(',').includes(q) || item.kunyomi.join(',').includes(q);
      if ('word' in item) return item.word.includes(q) || item.kana.includes(q) || item.meaning.toLowerCase().includes(q);
      return false;
    });
    const formatted = filtered.map(item => this.formatCard(item)).filter(Boolean) as FlashcardItem[];
    this.searchResults.set(formatted.slice(0, 50));
  }
  
  addCardToCustomDeck(card: FlashcardItem) { this.customDeckCards.update(cards => [...cards, card]); }
  removeCardFromCustomDeck(index: number) { this.customDeckCards.update(cards => cards.filter((_, i) => i !== index)); }
  isCardAdded = (card: FlashcardItem) => computed(() => this.customDeckCards().some(c => c.front === card.front && c.back === card.back))();

  formatCard(item: Kana | Kanji | Vocab): FlashcardItem | null {
    if ('romaji' in item) return { front: item.char, back: (item as Kana).romaji };
    if ('onyomi' in item) { const k = item as Kanji; return { front: k.char, back: k.meaning, sub: `${k.onyomi.join(', ')} / ${k.kunyomi.join(', ')}` }; }
    if ('word' in item) { const v = item as Vocab; return { front: v.word, back: v.meaning, sub: v.kana }; }
    return null;
  }

  flipCard() { this.isFlipped.update(v => !v); }
  nextCard() { this.isFlipped.set(false); setTimeout(() => this.currentIndex.update(i => (i + 1) % this.deck().length), 150); }
  prevCard() { this.isFlipped.set(false); setTimeout(() => this.currentIndex.update(i => (i - 1 + this.deck().length) % this.deck().length), 150); }
  backToMenu() { this.view.set('menu'); this.deck.set([]); }
  
  getDeckName(type: DeckType): string {
    switch (type) {
      case 'HIRAGANA': return this.ts.get('flashcard.hiragana_deck');
      case 'KATAKANA': return this.ts.get('flashcard.katakana_deck');
      case 'KANJI_N5': return `${this.ts.get('flashcard.kanji_deck')} N5`;
      case 'KANJI_N4': return `${this.ts.get('flashcard.kanji_deck')} N4`;
      case 'VOCAB_N5': return `${this.ts.get('flashcard.vocab_deck')} N5`;
      case 'VOCAB_N4': return `${this.ts.get('flashcard.vocab_deck')} N4`;
      default: return '';
    }
  }

  private shuffleArray(array: any[]): any[] {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [newArr[i], newArr[j]] = [newArr[j], newArr[i]]; }
    return newArr;
  }
}