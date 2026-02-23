import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Image } from 'expo-image';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'helper';
  time: string;
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    text: 'Welkom bij de RoboRadar hulplijn! Mijn naam is Lisa. Hoe kan ik u helpen?',
    sender: 'helper',
    time: '14:30',
  },
  {
    id: '2',
    text: 'U kunt hier al uw vragen stellen over drones in uw buurt. Ik help u graag! 😊',
    sender: 'helper',
    time: '14:30',
  },
];

const MOCK_REPLIES = [
  'Ik begrijp uw zorgen helemaal. Drones in uw buurt zijn bijna altijd hulpverlening drones die levens redden.',
  'Dat is een goede vraag! De meeste drones die u ziet zijn van hulpdiensten zoals ambulance of politie.',
  'U hoeft zich geen zorgen te maken. Deze drones zijn er voor uw veiligheid.',
  'Ik kan u daar meer over vertellen. Wilt u dat ik het uitleg?',
  'Fijn dat u contact opneemt! We zijn er om u gerust te stellen.',
];

function ChatBubble({ message }: { message: Message }) {
  const isUser = message.sender === 'user';

  return (
    <Animated.View
      entering={FadeInDown.duration(300).springify()}
      style={[
        styles.bubbleRow,
        isUser ? styles.bubbleRowUser : styles.bubbleRowHelper,
      ]}
    >
      {!isUser && (
        <View style={styles.avatar}>
          <Image
            source={require('../../public/cutedrone.png')}
            style={styles.avatarImg}
            contentFit="contain"
          />
        </View>
      )}
      <View
        style={[
          styles.bubble,
          isUser ? styles.bubbleUser : styles.bubbleHelper,
        ]}
      >
        <Text
          style={[
            styles.bubbleText,
            isUser ? styles.bubbleTextUser : styles.bubbleTextHelper,
          ]}
        >
          {message.text}
        </Text>
        <Text
          style={[
            styles.timeText,
            isUser ? styles.timeTextUser : styles.timeTextHelper,
          ]}
        >
          {message.time}
        </Text>
      </View>
    </Animated.View>
  );
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => { showSub.remove(); hideSub.remove(); };
  }, []);

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      time: timeStr,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Mock reply after a short delay
    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        text: MOCK_REPLIES[Math.floor(Math.random() * MOCK_REPLIES.length)],
        sender: 'helper',
        time: timeStr,
      };
      setMessages((prev) => [...prev, reply]);
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <Animated.View entering={FadeInUp.duration(400)} style={styles.header}>
        <View style={styles.headerIcon}>
          <Image
            source={require('../../public/cutedrone.png')}
            style={styles.headerDroneImg}
            contentFit="contain"
          />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Robo Hulplijn</Text>
          <View style={styles.onlineRow}>
            <View style={styles.onlineDot} />
            <Text style={styles.headerSubtitle}>Online - Wij helpen u graag</Text>
          </View>
        </View>
      </Animated.View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ChatBubble message={item} />}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          showsVerticalScrollIndicator={false}
        />

        {/* Input */}
        <View style={[styles.inputContainer, keyboardVisible && styles.inputContainerKeyboard]}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Typ uw bericht..."
              placeholderTextColor="#A0AEC0"
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={sendMessage}
              returnKeyType="send"
              multiline
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                !inputText.trim() && styles.sendButtonDisabled,
              ]}
              onPress={sendMessage}
              disabled={!inputText.trim()}
              activeOpacity={0.7}
            >
              <MaterialIcons
                name="send"
                size={22}
                color={inputText.trim() ? '#FFFFFF' : '#CBD5E0'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  flex: {
    flex: 1,
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EBF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  headerDroneImg: {
    width: 44,
    height: 44,
  },
  headerText: {
    marginLeft: 14,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A202C',
  },
  onlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#48BB78',
    marginRight: 6,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#718096',
  },
  // Messages
  messageList: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  bubbleRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  bubbleRowUser: {
    justifyContent: 'flex-end',
  },
  bubbleRowHelper: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EBF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    overflow: 'hidden',
  },
  avatarImg: {
    width: 26,
    height: 26,
  },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  bubbleHelper: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  bubbleUser: {
    backgroundColor: '#2E86DE',
    borderBottomRightRadius: 6,
  },
  bubbleText: {
    fontSize: 17,
    lineHeight: 24,
  },
  bubbleTextHelper: {
    color: '#1A202C',
  },
  bubbleTextUser: {
    color: '#FFFFFF',
  },
  timeText: {
    fontSize: 12,
    marginTop: 4,
  },
  timeTextHelper: {
    color: '#A0AEC0',
  },
  timeTextUser: {
    color: 'rgba(255,255,255,0.7)',
  },
  // Input
  inputContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 100,
    backgroundColor: '#F7FAFC',
  },
  inputContainerKeyboard: {
    paddingBottom: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingLeft: 18,
    paddingRight: 6,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  input: {
    flex: 1,
    fontSize: 17,
    color: '#1A202C',
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2E86DE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#EDF2F7',
  },
});
