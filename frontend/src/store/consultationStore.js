import { create } from 'zustand'

export const useConsultationStore = create((set) => ({
  selectedBodyPart: null,
  symptoms: [],
  chatHistory: [],
  isLoading: false,

  setSelectedBodyPart: (bodyPart) => set({ selectedBodyPart: bodyPart }),

  setSymptoms: (symptoms) => set({ symptoms }),

  addSymptom: (symptom) => set((state) => ({
    symptoms: [...state.symptoms, symptom]
  })),

  removeSymptom: (symptom) => set((state) => ({
    symptoms: state.symptoms.filter(s => s !== symptom)
  })),

  setChatHistory: (history) => set({ chatHistory: history }),

  addChatMessage: (message) => set((state) => ({
    chatHistory: [...state.chatHistory, message]
  })),

  setIsLoading: (isLoading) => set({ isLoading }),

  reset: () => set({
    selectedBodyPart: null,
    symptoms: [],
    isLoading: false
  }),
}))
