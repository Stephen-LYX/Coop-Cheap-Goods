"use client";

import { ItemProvider } from "../contexts/ItemContext";
import { EncryptionProvider } from "../contexts/EncryptionContext";
import { AuthProvider } from "../contexts/AuthContext";
import { SearchProvider } from "../contexts/SearchContext";
import { Toaster } from "react-hot-toast";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <EncryptionProvider>
        <ItemProvider>
          <SearchProvider>
            {children}
            <Toaster position="bottom-right" />
          </SearchProvider>
        </ItemProvider>
      </EncryptionProvider>
    </AuthProvider>
  );
}
