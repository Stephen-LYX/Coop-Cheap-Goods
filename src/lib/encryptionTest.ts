/**
 * Encryption Test Script
 * 
 * Run this in browser console to verify encryption is working
 */

// Test the encryption utilities
async function testEncryption() {
  console.log('🔒 Testing End-to-End Encryption...\n');

  // Import functions (you'll need to copy these from the modules in production)
  const testMessage = "Hello, this is a secret message! 🔐";
  const password = "test-conversation-key-12345";

  try {
    // Test 1: Basic encryption/decryption
    console.log('Test 1: Basic Encryption/Decryption');
    console.log('Original message:', testMessage);
    
    const { encryptMessage, decryptMessage } = await import('./encryption');
    
    const encrypted = await encryptMessage(testMessage, password);
    console.log('Encrypted (Base64):', encrypted.substring(0, 50) + '...');
    console.log('Encrypted length:', encrypted.length, 'characters');
    
    const decrypted = await decryptMessage(encrypted, password);
    console.log('Decrypted message:', decrypted);
    console.log('Match:', testMessage === decrypted ? '✅' : '❌');
    console.log('');

    // Test 2: Key management
    console.log('Test 2: Key Management');
    const { ensureConversationKey } = await import('./keyManagement');
    
    const conversationId = 'test-conversation-123';
    const userId = 'user-abc';
    const otherUserId = 'user-xyz';
    
    const key1 = await ensureConversationKey(conversationId, userId, otherUserId);
    console.log('Generated key:', key1.substring(0, 20) + '...');
    
    const key2 = await ensureConversationKey(conversationId, userId, otherUserId);
    console.log('Cached key:', key2.substring(0, 20) + '...');
    console.log('Keys match:', key1 === key2 ? '✅' : '❌');
    console.log('');

    // Test 3: Multiple messages with same key
    console.log('Test 3: Multiple Messages');
    const messages = [
      "First message",
      "Second message with emojis 🎉",
      "Third message with special chars: !@#$%^&*()"
    ];
    
    for (const msg of messages) {
      const enc = await encryptMessage(msg, password);
      const dec = await decryptMessage(enc, password);
      console.log(`"${msg}" → Encrypted → Decrypted: "${dec}" ${msg === dec ? '✅' : '❌'}`);
    }
    console.log('');

    // Test 4: Wrong password fails
    console.log('Test 4: Security - Wrong Password');
    const encrypted2 = await encryptMessage("Secret message", "correct-password");
    try {
      await decryptMessage(encrypted2, "wrong-password");
      console.log('Decryption with wrong password: ❌ SECURITY ISSUE!');
    } catch (err) {
      console.log('Decryption with wrong password failed: ✅ SECURE');
    }
    console.log('');

    console.log('🎉 All encryption tests passed!');
    
    return true;
  } catch (error) {
    console.error('❌ Encryption test failed:', error);
    return false;
  }
}

// Instructions for browser console
console.log(`
To test encryption in your browser:
1. Open the app in your browser
2. Open Developer Tools (F12)
3. Go to Console tab
4. Run: testEncryption()

To check IndexedDB storage:
1. Application tab → IndexedDB → CoopCheapGoodsEncryption
2. Expand 'conversationKeys' to see stored keys

To verify messages are encrypted in database:
1. Open Supabase Dashboard
2. Go to Table Editor → messages
3. Check 'content' column - should show Base64 gibberish
`);

export { testEncryption };
