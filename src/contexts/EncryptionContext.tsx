/**
 * Encryption Context
 * 
 * Provides encryption utilities and key management across the app
 */
"use client";

import React, { createContext, useContext, useCallback } from "react";
import { encryptMessage, decryptMessage } from "@/lib/encryption";
import { ensureConversationKey, clearAllKeys } from "@/lib/keyManagement";

interface EncryptionContextType {
  encryptMessageForConversation: (
    message: string,
    conversationId: string,
    userId: string,
    otherUserId: string
  ) => Promise<string>;
  decryptMessageForConversation: (
    encryptedMessage: string,
    conversationId: string,
    userId: string,
    otherUserId: string
  ) => Promise<string>;
  clearAllEncryptionKeys: () => Promise<void>;
}

const EncryptionContext = createContext<EncryptionContextType | undefined>(undefined);

export function EncryptionProvider({ children }: { children: React.ReactNode }) {
  const encryptMessageForConversation = useCallback(
    async (
      message: string,
      conversationId: string,
      userId: string,
      otherUserId: string
    ): Promise<string> => {
      const key = await ensureConversationKey(conversationId, userId, otherUserId);
      return encryptMessage(message, key);
    },
    []
  );

  const decryptMessageForConversation = useCallback(
    async (
      encryptedMessage: string,
      conversationId: string,
      userId: string,
      otherUserId: string
    ): Promise<string> => {
      const key = await ensureConversationKey(conversationId, userId, otherUserId);
      return decryptMessage(encryptedMessage, key);
    },
    []
  );

  const clearAllEncryptionKeys = useCallback(async () => {
    await clearAllKeys();
  }, []);

  const value: EncryptionContextType = {
    encryptMessageForConversation,
    decryptMessageForConversation,
    clearAllEncryptionKeys,
  };

  return (
    <EncryptionContext.Provider value={value}>
      {children}
    </EncryptionContext.Provider>
  );
}

export function useEncryption() {
  const context = useContext(EncryptionContext);
  if (context === undefined) {
    throw new Error("useEncryption must be used within an EncryptionProvider");
  }
  return context;
}
